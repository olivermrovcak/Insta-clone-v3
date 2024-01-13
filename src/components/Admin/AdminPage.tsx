import React from 'react'
import Table from "../Table/Table";
import {columns} from "../../utils/columns/usersColumns";


function AdminPage() {

    const url = "https://us-central1-oliverminstaclone.cloudfunctions.net/getAllUsers"

    return (
       <div className="w-full p-5">
           Admin neheheh

           <div className="w-full">
               <Table
                   tableId={"userTable"}
                   columns={columns}
                   url={url}
                     onRowClick={(data) => console.log(data)}
                />
           </div>
       </div>
    )
}

export default AdminPage
