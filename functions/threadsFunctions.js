const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {v4: uuidv4} = require('uuid');
const cors = require('cors')({origin: true});

const {Firestore} = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

async function verifyIdToken(request, response, next) {
    const idToken = request.headers.authorization;
    if (!idToken) {
        console.log('No ID token was found in the request headers.');
        return response.status(403).send('Unauthorized');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return next(decodedToken);
    } catch (error) {
        console.error('Error verifying ID token:', error);
        return response.status(403).send('Unauthorized');
    }
}

exports.getAllThreads = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await verifyIdToken(request, response, async () => {
                const threadsSnapshot = await admin.firestore().collection('threads').get();
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