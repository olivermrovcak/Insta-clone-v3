import {columnAsDateTime, columnAsText, getSelectColumn} from "../../components/Table/TableUtils";
import {createColumnHelper} from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export const columns = [
    getSelectColumn(),
    columnAsText(columnHelper, 'name', "Meno"),
    columnAsText(columnHelper, 'email', "Email"),
    columnAsText(columnHelper, 'uid', "uid"),
    columnAsText(columnHelper, 'isAdmin', "isAdmin"),
];
