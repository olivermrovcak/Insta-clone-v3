import {collection, doc, getDoc, getDocs, orderBy, query} from "firebase/firestore";
import {db} from "./firebase";

interface Props {
    path: string,
    pathSegments?: string,
    orderByField?: string
    order?: string | any
}

async function getDataFromDb({path, pathSegments, orderByField, order}: Props): Promise<[]>;
async function getDataFromDb({path, pathSegments}: Props): Promise<[]>;

async function getDataFromDb({path, pathSegments, orderByField, order}: Props) {
    const q = query(collection(
            db,
            path,
            pathSegments ? (pathSegments) : ("")),
        orderBy(orderByField ? (orderByField) : ("timeStamp"), order ? (order) : ("desc"))
    );
    const querySnapshot = await getDocs(q);
    var data: any = [];
    querySnapshot.forEach((doc) => {
        data = [...data, doc];
    });

    return data;

};

export async function getDocument({path, pathSegments}: Props) {
    const ref = doc(db, path, pathSegments ? (pathSegments) : (""));
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
        return docSnap;
    }
}

export default getDataFromDb;