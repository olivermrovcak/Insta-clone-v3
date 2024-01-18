import { getFirestore, collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';

export async function reportThread(text: string, threadId: string) {
    const db = getFirestore();
    const reportsCollection = collection(db, 'reports');
    const threadRef = doc(db, 'threads', threadId); // Get the thread reference
    const reportObject = {
        resolved: false,
        subject: threadRef, // Set the thread reference as the subject
        text: text,
        timestamp: serverTimestamp(),
    };

    try {
        const docRef = await addDoc(reportsCollection, reportObject);
        console.log('Report submitted with ID: ', docRef.id);
    } catch (error) {
        console.error('Error submitting report: ', error.message);
    }
}