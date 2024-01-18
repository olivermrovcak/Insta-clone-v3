const { verifyIdToken } = require('./verifyId');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const {Firestore} = require('firebase-admin/firestore');
const {v4: uuidv4} = require('uuid');
const {getUserByUid} = require("../index");

module.exports.getAllThreads = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const threadsSnapshot = await admin.firestore().collection('threads').orderBy('timeStamp', 'desc').get();
                const threads = [];

                threadsSnapshot.forEach((doc) => {
                    threads.push({
                        id: doc.id, // Include the thread ID
                        ...doc.data(), // Include the thread data
                    });
                });

                return response.status(200).json(threads);
            });
        } catch (error) {
            console.error('Error getting threads', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.getAllThreadsFollowing = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async (decodedToken) => {
                const uid = decodedToken.uid;

                // Fetch the list of users the current user is following
                const followingSnapshot = await admin.firestore().collection('users').doc(uid).collection('following').get();
                const following = followingSnapshot.docs.map(doc => doc.id);

                // Fetch the threads from the users the current user is following
                const threadsSnapshot = await admin.firestore().collection('threads')
                    .where('uid', 'in', following)
                    .orderBy('timeStamp', 'desc')
                    .get();

                const threads = [];

                await Promise.all(threadsSnapshot.docs.map(async (doc) => {
                    const threadData = doc.data();
                    const userData = (await admin.firestore().collection('users').doc(threadData.uid).get()).data();
                    threads.push({
                        id: doc.id,
                        ...threadData,
                        user: userData,
                    });
                }));

                // Fetch the reposted threads from the users the current user is following
                const repostsSnapshot = await admin.firestore().collection('repostedThreads')
                    .where('uid', 'in', following)
                    .orderBy('timeStamp', 'desc')
                    .get();

                await Promise.all(repostsSnapshot.docs.map(async (doc) => {
                    const repostData = doc.data();
                    const userData = (await admin.firestore().collection('users').doc(repostData.uid).get()).data();
                    const threadSnapshot = (await admin.firestore().collection('threads').doc(repostData.threadId).get()).data();
                    threads.push({
                        id: doc.id,
                        ...repostData,
                        user: userData,
                        thread: threadSnapshot,
                    });
                }));

                // Fetch the threads of the logged in user
                const userThreadsSnapshot = await admin.firestore().collection('threads')
                    .where('uid', '==', uid)
                    .orderBy('timeStamp', 'desc')
                    .get();

                await Promise.all(userThreadsSnapshot.docs.map(async (doc) => {
                    const threadData = doc.data();
                    const userData = (await admin.firestore().collection('users').doc(threadData.uid).get()).data();
                    threads.push({
                        id: doc.id,
                        ...threadData,
                        user: userData,
                    });
                }));

                // Fetch the reposted threads of the logged in user
                const userRepostsSnapshot = await admin.firestore().collection('repostedThreads')
                    .where('uid', '==', uid)
                    .orderBy('timeStamp', 'desc')
                    .get();

                await Promise.all(userRepostsSnapshot.docs.map(async (doc) => {
                    const repostData = doc.data();
                    const userData = (await admin.firestore().collection('users').doc(repostData.uid).get()).data();
                    const threadSnapshot = (await admin.firestore().collection('threads').doc(repostData.threadId).get()).data();
                    threads.push({
                        id: doc.id,
                        ...repostData,
                        user: userData,
                        thread: threadSnapshot,
                    });
                }));

                threads.sort((a, b) => b.timeStamp - a.timeStamp);

                return response.status(200).json(threads);
            });
        } catch (error) {
            console.error('Error getting threads', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.uploadThread = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const {uid, text, attachment} = request.body;

                if (!uid || !text ) {
                    return response.status(400).send('Missing required fields');
                }

                if (text.length > 1000) {
                    return response.status(400).send('Text is too long. Maximum length is 1000 characters.');
                }

                const threadRef = admin.firestore().collection('threads').doc();

                // If attachment exists, upload it to the bucket
                if (attachment) {
                    const mimeType = attachment.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
                    const attachmentData = attachment.split('base64,')[1];

                    // Check the size of the attachment
                    const sizeInBytes = Buffer.byteLength(attachmentData, 'base64');
                    const sizeInMegabytes = sizeInBytes / (1024*1024);

                    if (sizeInMegabytes > 10) { // Change this to your desired maximum size
                        return response.status(400).send('Attachment is too large. Maximum size is 10 MB.');
                    }

                    // Check if the mimeType is either an image or a mp4 video
                    if (!mimeType.startsWith('image/') && mimeType !== 'video/mp4') {
                        return response.status(400).send('Invalid file type. Only images and mp4 videos are allowed.');
                    }

                    const uuid = uuidv4();

                    const bucket = admin.storage().bucket('gs://oliverminstaclone.appspot.com');
                    // Prepend the mimeType to the file path
                    const file = bucket.file(`${mimeType}/threads/${threadRef.id}/attachment`);
                    const stream = file.createWriteStream({
                        metadata: {
                            public: true,
                            contentType: mimeType,
                            metadata: {
                                firebaseStorageDownloadTokens: uuid,
                            },
                        },
                    });

                    stream.on('error', (error) => {
                        console.error('Stream error:', error);
                        response.status(500).send('Error uploading attachment');
                    });

                    stream.on('finish', async () => {
                        const downloadURL = await file.getSignedUrl({
                            action: 'read', expires: '03-09-2491',
                        });

                        await threadRef.set({
                            uid: uid,
                            text: text,
                            timeStamp: Firestore.FieldValue.serverTimestamp(),
                            attachment: downloadURL[0], // Initialize attachment
                        });

                        response.status(200).send('Thread with attachment uploaded successfully');
                    });

                    stream.write(Buffer.from(attachmentData, 'base64'));
                    stream.end();
                } else {

                    await threadRef.set({
                        uid: uid,
                        text: text,
                        timeStamp: Firestore.FieldValue.serverTimestamp(),
                        attachment: null, // Initialize attachment as null
                    });

                    response.status(200).send('Thread uploaded successfully');
                }
            });
        } catch (error) {
            console.error('Error uploading thread', error);
            response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.getThreadById = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const { threadId } = request.body;

                if (!threadId) {
                    return response.status(400).send('Missing thread ID');
                }

                const threadSnapshot = await admin.firestore().collection('threads').doc(threadId).get();

                if (!threadSnapshot.exists) {
                    return response.status(404).send('Thread not found');
                }

                const commentsSnapshot = await threadSnapshot.ref.collection('comments').orderBy('timeStamp', 'desc').get();
                const comments = [];

                await Promise.all(commentsSnapshot.docs.map(async (doc) => {
                    const commentData = doc.data();
                    const userData = (await admin.firestore().collection('users').doc(commentData.uid).get()).data();
                    comments.push({
                        id: doc.id, // Include the comment ID
                        ...commentData , // Include the comment data
                        user: userData,
                    });
                }));

                const threadData = threadSnapshot.data();
                const userSnapshot = await admin.firestore().collection('users').doc(threadData.uid).get();
                const user = userSnapshot.data();

                const thread = {
                    id: threadSnapshot.id, // Include the thread ID
                    ...threadData, // Include the thread data
                    user: user, // Include the user data
                    comments: comments, // Include the comments
                };

                return response.status(200).json(thread);
            });
        } catch (error) {
            console.error('Error getting thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.addCommentToThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            const { threadId, comment, uid } = request.body;

            if (!threadId || !comment || !uid) {
                return response.status(400).send('Missing thread ID, comment or user ID');
            }

            if (comment.length > 300) {
                return response.status(400).send('Comment is too long. Maximum length is 300 characters.');
            }

            const threadRef = admin.firestore().collection('threads').doc(threadId);

            if (!(await threadRef.get()).exists) {
                return response.status(404).send('Thread not found');
            }

            const commentRef = await threadRef.collection('comments').add({
                text: comment,
                uid: uid,
                timeStamp: Firestore.FieldValue.serverTimestamp(),
            });

            return response.status(200).json({ id: commentRef.id, ...comment });
        } catch (error) {
            console.error('Error adding comment to thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.deleteCommentFromThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const { threadId, commentId } = request.body;

                if (!threadId || !commentId) {
                    return response.status(400).send('Missing thread ID or comment ID');
                }

                const threadRef = admin.firestore().collection('threads').doc(threadId);
                const threadSnapshot = await threadRef.get();

                if (!threadSnapshot.exists) {
                    return response.status(404).send('Thread not found');
                }

                const commentRef = threadRef.collection('comments').doc(commentId);
                const commentSnapshot = await commentRef.get();

                if (!commentSnapshot.exists) {
                    return response.status(404).send('Comment not found');
                }

                // Delete the comment document from Firestore
                await commentRef.delete();

                return response.status(200).send('Comment deleted successfully');
            });
        } catch (error) {
            console.error('Error deleting comment', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.updateCommentInThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const { threadId, commentId, newText } = request.body;

                if (!threadId || !commentId || !newText) {
                    return response.status(400).send('Missing thread ID, comment ID or new text');
                }

                const threadRef = admin.firestore().collection('threads').doc(threadId);
                const threadSnapshot = await threadRef.get();

                if (!threadSnapshot.exists) {
                    return response.status(404).send('Thread not found');
                }

                const commentRef = threadRef.collection('comments').doc(commentId);
                const commentSnapshot = await commentRef.get();

                if (!commentSnapshot.exists) {
                    return response.status(404).send('Comment not found');
                }

                // Update the comment document in Firestore
                await commentRef.update({
                    text: newText,
                    timeStamp: Firestore.FieldValue.serverTimestamp(),
                });

                return response.status(200).send('Comment updated successfully');
            });
        } catch (error) {
            console.error('Error updating comment', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.hasUserLikedThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            const { threadId, uid } = request.body;

            if (!threadId || !uid) {
                return response.status(400).send('Missing thread ID or user ID');
            }

            const threadRef = admin.firestore().collection('threads').doc(threadId);

            if (!(await threadRef.get()).exists) {
                return response.status(404).send('Thread not found');
            }

            const likesSnapshot = await threadRef.collection('likes').where('uid', '==', uid).get();

            if (likesSnapshot.empty) {
                return response.status(200).json({ hasLiked: false });
            } else {
                return response.status(200).json({ hasLiked: true });
            }
        } catch (error) {
            console.error('Error checking if user has liked thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.likeThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            const { threadId, uid } = request.body;

            if (!threadId || !uid) {
                return response.status(400).send('Missing thread ID or user ID');
            }

            const threadRef = admin.firestore().collection('threads').doc(threadId);

            if (!(await threadRef.get()).exists) {
                return response.status(404).send('Thread not found');
            }

            const likesRef = threadRef.collection('likes').doc(uid);
            if ((await likesRef.get()).exists) {
                return response.status(400).send('User has already liked this thread');
            }

            await likesRef.set({ uid: uid });

            return response.status(200).send('Thread liked successfully');
        } catch (error) {
            console.error('Error liking thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.unlikeThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            const { threadId, uid } = request.body;

            if (!threadId || !uid) {
                return response.status(400).send('Missing thread ID or user ID');
            }

            const threadRef = admin.firestore().collection('threads').doc(threadId);

            if (!(await threadRef.get()).exists) {
                return response.status(404).send('Thread not found');
            }

            const likesRef = threadRef.collection('likes').doc(uid);
            if (!(await likesRef.get()).exists) {
                return response.status(400).send('User has not liked this thread');
            }

            await likesRef.delete();

            return response.status(200).send('Thread unliked successfully');
        } catch (error) {
            console.error('Error unliking thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.repostThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            const { threadId, uid } = request.body;

            if (!threadId || !uid) {
                return response.status(400).send('Missing thread ID or user ID');
            }

            const threadRef = admin.firestore().collection('threads').doc(threadId);

            if (!(await threadRef.get()).exists) {
                return response.status(404).send('Thread not found');
            }

            const repostsRef = admin.firestore().collection('repostedThreads').doc();

            await repostsRef.set({
                threadId: threadId,
                uid: uid,
                timeStamp: Firestore.FieldValue.serverTimestamp(),
            });

            return response.status(200).send('Thread reposted successfully');
        } catch (error) {
            console.error('Error reposting thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.deleteRepostedThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const { repostId } = request.body;

                if (!repostId) {
                    return response.status(400).send('Missing repost ID');
                }

                const repostRef = admin.firestore().collection('repostedThreads').doc(repostId);
                const repostSnapshot = await repostRef.get();

                if (!repostSnapshot.exists) {
                    return response.status(404).send('Reposted thread not found');
                }

                // Delete the reposted thread document from Firestore
                await repostRef.delete();

                return response.status(200).send('Reposted thread deleted successfully');
            });
        } catch (error) {
            console.error('Error deleting reposted thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.deleteThread = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const { threadId } = request.body;

                if (!threadId) {
                    return response.status(400).send('Missing thread ID');
                }

                const threadRef = admin.firestore().collection('threads').doc(threadId);
                const threadSnapshot = await threadRef.get();

                if (!threadSnapshot.exists) {
                    return response.status(404).send('Thread not found');
                }

                const threadData = threadSnapshot.data();

                // If the thread has an attachment, delete it from the storage bucket
                if (threadData.attachment) {
                    const bucket = admin.storage().bucket('gs://oliverminstaclone.appspot.com');
                    const filePath = threadData.attachment.split('oliverminstaclone.appspot.com/')[1];
                    await bucket.file(filePath).delete();
                }

                // Delete the thread document from Firestore
                await threadRef.delete();

                return response.status(200).send('Thread deleted successfully');
            });
        } catch (error) {
            console.error('Error deleting thread', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

