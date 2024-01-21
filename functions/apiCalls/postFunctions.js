const { verifyIdToken } = require('./verifyId');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const {Firestore} = require('firebase-admin/firestore');
const {v4: uuidv4} = require('uuid');


module.exports.getAllPostsFollowing = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async (decodedToken) => {
                const followingSnapshot = await admin.firestore()
                    .collection('users').doc(decodedToken.uid)
                    .collection('following').get();
                const following = followingSnapshot.docs.map((doc) => doc.data().uid);

                following.push(decodedToken.uid);

                const postsSnapshot = await admin.firestore()
                    .collection('posts')
                    .where('uid', 'in', following).orderBy('timeStamp', 'desc').get();
                const posts = [];

                postsSnapshot.forEach((doc) => {
                    posts.push({
                        id: doc.id, // Include the post ID
                        ...doc.data(), // Include the post data
                    });
                });

                return response.status(200).json(posts);
            });
        } catch (error) {
            console.error('Error getting posts', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.getAllPosts = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const postsSnapshot = await admin.firestore().collection('posts').get();
                const posts = [];

                postsSnapshot.forEach((doc) => {
                    posts.push({
                        id: doc.id, // Include the post ID
                        ...doc.data(), // Include the post data
                    });
                });

                return response.status(200).json(posts);
            });
        } catch (error) {
            console.error('Error getting posts', error);
            return response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.getPost = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const {postId} = request.body;
            if (!postId) {
                return response.status(400).send('Invalid post ID');
            }

            // Get the post document
            const postSnapshot = await admin.firestore().collection('posts').doc(postId).get();
            if (!postSnapshot.exists) {
                return response.status(404).send('Post not found');
            }

            // Get the comments subcollection
            const commentsSnapshot = await admin.firestore().collection('posts').doc(postId).collection('comments').orderBy('timeStamp', 'desc').get();
            const comments = commentsSnapshot.docs.map(doc => doc.data());

            // Combine the post data and comments into a single object
            const postData = postSnapshot.data();
            const postWithComments = {
                ...postData,
                comments: comments
            };

            response.status(200).json(postWithComments);
        } catch (error) {
            console.error('Error getting post', error);
            response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.uploadPost = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const {uid, username, caption, profileImg, selectedFile} = request.body;

            if (!uid || !username || !caption || !profileImg || !selectedFile) {
                return response.status(400).send('Missing required fields');
            }

            if (caption.length > 100) {
                return response.status(400).send('Caption is too long. Maximum length is 100 characters.');
            }

            const mimeType = selectedFile.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
            if (!mimeType.startsWith('image/')) {
                return response.status(400).send('Invalid file type. Only images are allowed.');
            }

            const postRef = admin.firestore().collection('posts').doc();
            await postRef.set({
                uid: uid,
                username: username,
                caption: caption,
                profileImg: profileImg,
                timeStamp: Firestore.FieldValue.serverTimestamp(),
            });

            const uuid = uuidv4();

            const bucket = admin.storage().bucket('gs://oliverminstaclone.appspot.com');
            const file = bucket.file(`posts/${postRef.id}/image`);
            const stream = file.createWriteStream({
                metadata: {
                    public: true,
                    contentType: mimeType, // use the mimeType from the selected file
                    metadata: {
                        firebaseStorageDownloadTokens: uuid,
                    },
                },
            });

            stream.on('error', (error) => {
                console.error('Stream error:', error);
                response.status(500).send('Error uploading file');
            });

            stream.on('finish', async () => {
                const downloadURL = await file.getSignedUrl({
                    action: 'read', expires: '03-09-2491',
                });

                await postRef.update({
                    image: downloadURL[0],
                });

                response.status(200).send('Post uploaded successfully');
            });

            const imageData = selectedFile.split('base64,')[1];

            stream.write(Buffer.from(imageData, 'base64'));
            stream.end();
        } catch (error) {
            console.error('Error uploading post', error);
            response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.deletePost = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const {postId} = request.body;
            if (!postId) {
                return response.status(400).send('Invalid post ID');
            }
            await admin.firestore().collection('posts').doc(postId).delete();
            response.status(200).send('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post', error);
            response.status(500).send('Internal Server Error');
        }
    });
});

module.exports.updatePost = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const {postId, caption} = request.body;

            if (!postId) {
                return response.status(400).send('Invalid post ID');
            }

            await admin.firestore().collection('posts').doc(postId)
                .update({caption: caption});
            response.status(200).send('Post updated successfully');
        } catch (error) {
            console.error('Error updating post', error);
            response.status(500).send('Internal Server Error');
        }
    });
});