const admin = require("firebase-admin");

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

module.exports = { verifyIdToken };