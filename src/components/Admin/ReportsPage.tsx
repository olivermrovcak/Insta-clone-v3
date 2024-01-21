import React, {useEffect, useState} from 'react'
import {getDataFromFirebase, getRawDataFromFirebase} from "../../firebase/apiCalls";
import {ErrorToast, SuccessToast} from "../../utils/ToastUtils";
import {db} from "../../firebase/firebase";
import {deleteDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import AttachmentRender from "../ThreadsFeed/AttachmentRender";

function ReportsPage() {

    const [reports, setReports] = useState([])

    function getReports() {
        getRawDataFromFirebase('reports').then((response) => {
            const reportsWithId = response.map(report => ({id: report.id, ...report.data()}));
            setReports(reportsWithId);
            console.log(reportsWithId);
        }).catch((error) => {
            console.error(error)
            ErrorToast("Nepodarilo sa načítať reporty");
        })
    }

    useEffect(() => {
        getReports();
    }, []);

    return (
        <div className="w-full p-5 text-white ">
            <h1 className="font-bold text-4xl mb-5">Reportované príspevky</h1>
            <div className="grid grid-cols-1 md:grid-cols-4  gap-3">
                {reports.filter(report => !report.resolved).map((report) => (
                    <Report key={report?.id} id={report?.id} report={report} reference={report?.subject}/>
                ))}
            </div>
        </div>
    )
}

export default ReportsPage

interface ReportProps {
    id: string
    reference: any
    report: any
}

function Report({id, reference, report}: ReportProps) {

    const [open, setOpen] = useState(false)
    const [data, setData] = useState({} as any)

    async function getReportedPost() {
        const snapshot = await getDoc(reference);
        setData(snapshot.data());
        console.log(snapshot.data());
    }

    async function resolveReport(reportId: string) {
        const reportRef = doc(db, 'reports', reportId);
        await updateDoc(reportRef, {
            resolved: true
        });
    }

    async function deleteReportedPost(reportId: string) {
        const reportRef = doc(db, 'reports', reportId);
        await updateDoc(reportRef, {
            resolved: true
        }).then(response => {
            console.log(response);
            deleteDoc(reference).then(response => {
                console.log(response);
                SuccessToast("Príspevok bol odstránený");
            });
        });
    }

    function renderText(data: any) {
        if (data?.text) {
            return <p><strong>Text prispevku:</strong> {data?.text}</p>
        } else if (data?.caption) {
            return <p><strong>Text prispevku:</strong> {data?.caption}</p>
        }
    }

    function renderReason() {
        return <p><strong>Dôvod: </strong> {report.reason}</p>
    }

    function renderImage(data: any) {
        if (data?.image) {
            return <div className="w-full p-2">
                <p><strong>Súbor: </strong></p>
                <img className=" object-cover" src={data?.image} alt=""/>
            </div>
        } else if (data?.attachment) {
            return <div className="w-full p-2">
                <p><strong>Súbor: </strong></p>
                <AttachmentRender url={data?.attachment}/>
            </div>
        }
    }

    useEffect(() => {
        getReportedPost();
    }, []);

    return (
        <div
            onClick={() => setOpen(!open)}
             className={`border border-gray-500 border-opacity-20 p-2 rounded-lg transition-all duration-500
                 hover:bg-gray-600 hover:bg-opacity-20 hover:shadow-md hover:shadow-gray-700 cursor-pointer
                 overflow-hidden flex flex-col 
                 ${open ? " md:col-span-2 " : "h-12"}`}
        >
            <p><strong>ID: </strong>{id}</p>
            {open &&
                <div className="flex-1 flex flex-col justify-around">
                    <div className="h-full w-full">
                        {renderReason()}
                        {renderText(data)}
                        {renderImage(data)}
                    </div>
                    <div className="w-full flex flex-row justify-start space-x-2">
                        <button
                            onClick={() => resolveReport(id)}
                            className="bg-green-600 hover:bg-green-700 transition-all duration-500 text-white rounded-lg px-3 py-1">Zachovat
                            príspevok
                        </button>
                        <button
                            onClick={() => deleteReportedPost(id)}
                            className="bg-red-500 hover:bg-red-600 transition-all duration-500 text-white rounded-lg px-3 py-1">Odstranit
                            príspevok
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}