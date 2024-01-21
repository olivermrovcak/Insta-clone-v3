import { getFirestore, collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';

export async function reportThread(text: string, threadId: string) {
    const db = getFirestore();
    const reportsCollection = collection(db, 'reports');
    const threadRef = doc(db, 'threads', threadId);
    const reportObject = {
        resolved: false,
        subject: threadRef,
        reason: text,
        timestamp: serverTimestamp(),
    };

    try {
        const docRef = await addDoc(reportsCollection, reportObject);
        console.log('Report submitted with ID: ', docRef.id);
    } catch (error) {
        console.error('Error submitting report: ', error.message);
    }
}

export async function reportPost(text: string, postId: string) {
    const db = getFirestore();
    const reportsCollection = collection(db, 'reports');
    const postRef = doc(db, 'posts', postId);
    const reportObject = {
        resolved: false,
        subject: postRef,
        reason: text,
        timestamp: serverTimestamp(),
    };

    try {
        const docRef = await addDoc(reportsCollection, reportObject);
        console.log('Report submitted with ID: ', docRef.id);
    } catch (error) {
        console.error('Error submitting report: ', error.message);
    }
}