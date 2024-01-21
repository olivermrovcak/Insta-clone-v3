import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    getPaginationRowModel
} from '@tanstack/react-table'
import {
    useInfiniteQuery,
} from '@tanstack/react-query'

import '../../styles/table.css';

import {Table as MuiTable, TableBody, TableCell, TableHead, TablePagination, TableRow} from "@mui/material";
import axios from "axios";
import TableFilter from "./TableFilter";
import SouthIcon from "@mui/icons-material/South";
import {ErrorToast} from "../../utils/ToastUtils";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import TablePaginationActions from './actions'

enum FilterType {
    EQUAL = "==",
    LIKE = "=like=",
}

interface TableProps {
    tableId: string
    columns: any
    url: string
    onRowClick?: (data: any, id: any) => void
    customSort?: any
    defaultColumnVisibility?: any
    defaultFilter?: string
    customOrder?: any
}

export interface TableRefCallbacks {
    tableReset(): void,

    getAllLeafColumns(): any,

    getSelectedRows(): any,

    resetRowSelection(): void
}

export type ApiResponse = {
    content: any
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    pageable: {
        offset: number
        pageNumber: number
        pageSize: number
        paged: boolean
        sort: {
            empty: boolean
            sorted: boolean
            unsorted: boolean
        }
        unpaged: boolean
    }
    size: number
    sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
    }
    totalElements: number
    totalPages: number
}

const Table = forwardRef<TableRefCallbacks, TableProps>(({
                                                             tableId,
                                                             columns,
                                                             onRowClick,
                                                             url,
                                                             customSort,
                                                             defaultColumnVisibility,
                                                             defaultFilter,
    customOrder
                                                         }, ref) => {

    const auth = getAuth(app as any);
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalSort, setGlobalSort] = React.useState({
        col: customSort ?? "id",
        order: customOrder ?? "desc",
    })
    const [globalFilter, setGlobalFilter] = React.useState<any>(null);
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    const {data, refetch} = useInfiniteQuery<ApiResponse>({
        queryKey: [tableId, globalSort, globalFilter, columns],
        queryFn: () => {
            return fetchData()
        },
        getNextPageParam: (lastPage, allPages) => {
            // return the parameter for the next page based on the last page data
        },
        staleTime: Infinity, // data will never become stale
        initialPageParam: 0,
    })

    const flatData = React.useMemo(
        () => data?.pages?.map(page => page).flat() ?? [],
        [data]
    )

    const totalDBRowCount = data?.pages?.[0]?.totalElements ?? 0
    const totalFetched = flatData?.length

    async function fetchData() {
        try {
            const idToken = await auth?.currentUser?.getIdToken(true);
            const response = await axios.get(url, {
                headers: {
                    'Authorization': idToken ?? "",
                }
            });
            return response.data;
        } catch (error) {
            console.error(error);
            ErrorToast("Nepodarilo sa načítať dáta z databázy");
        }
    }

    function getFilter() {
        let filterString = convertFilterArrayToString();

        if (defaultFilter) {
            filterString = filterString.length !== 0 ? filterString + ';' + defaultFilter : defaultFilter;
        }

        if (filterString.includes("_")) {
            filterString = filterString.replace(/_/g, ".");
        }

        if (filterString.includes("user.")) {
            filterString = filterString.replace(/user\./g, "");
        }

        return filterString;
    }

    function handleRowClick(data: Array<object>, rowId: number) {
        if (onRowClick) {
            onRowClick(data, rowId);
        }
    }

    function handleChangeOrder(columnId: string) {
        if (columnId.startsWith("user.")) {
            columnId = columnId.replace("user.", "");
        }

        if (globalSort.order === "asc") {
            setGlobalSort({
                col: columnId,
                order: "desc",
            })
        } else if (globalSort.order === "") {
            setGlobalSort({
                col: columnId,
                order: "asc",
            })
        } else {
            setGlobalSort({
                col: "",
                order: "",
            })
        }
    }

    function convertFilterArrayToString() {
        return globalFilter?.length
            ? globalFilter.map((filter: any) => `${filter?.columnId}${filter?.isNumeric ? FilterType.EQUAL : FilterType.LIKE}"${filter?.value}"`).join(";")
            : [];
    }

    const table = useReactTable({
        data: flatData,
        columns,
        state: {
            rowSelection
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    useImperativeHandle(ref, () => ({
        tableReset,
        getAllLeafColumns,
        getSelectedRows,
        resetRowSelection
    }));

    const tableReset = () => {
        refetch();
    };

    const getSelectedRows = () => {
        return table.getSelectedRowModel().rows.map(row => row.original);
    }

    const resetRowSelection = () => {
        setRowSelection({});
    }

    const getAllLeafColumns = () => {
        return table.getAllLeafColumns();
    }

    const styleStickyHeader = {
        position: 'sticky',
        top: 0,
        zIndex: 3,
    } as const;

    const { pageSize, pageIndex } = table.getState().pagination

    return (
        <>
            <section className="table-section">
                <div
                    className="table-wrapper custom-scrollbar"
                   // onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                    ref={tableContainerRef}
                >
                    <MuiTable
                        {...{
                            style: {
                                width: "fullWidth",
                            },
                        }}>
                        <TableHead style={styleStickyHeader}>
                            <TableFilter tableRef={table} filterChange={setGlobalFilter} deleteAction={() => {
                            }}/>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id} className=" ">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="table-header-th "
                                            style={{width: header.getSize() === Number.MAX_SAFE_INTEGER ? "auto" : header.getSize()}}
                                        >
                                            <div className="flex">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                {header.id !== 'select' &&
                                                    <p><SouthIcon
                                                        {...{
                                                            className: `
                                                            ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                                            ${globalSort.col === (header.id.startsWith("user.") ? header.id.replace("user.", "") : header.id) ? "!text-blue-700 " : "!text-[#667085]"}
                                                            ${(globalSort.order === 'asc' && globalSort.col === (header.id.startsWith("user.") ? header.id.replace("user.", "") : header.id)) ? '!rotate-180' : ''}
                                                            !w-5 !ml-3 !transition-all`,
                                                            onClick: () => handleChangeOrder(header.id),
                                                        }}
                                                    /></p>
                                                }
                                            </div>
                                            <p className="w-full absolute bottom-0 h-[1px] bg-[#E0E0E0] left-0 z-300 dark:!bg-ssk-dark-border "></p>
                                        </th>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}
                                          className={`${Object.hasOwn(table.getState().rowSelection, row.id) && "bg-opacity-[3%] "} 
                                          cursor-pointer hover:bg-disabled   `}
                                          onClick={() => {
                                              if (!table.getIsSomeRowsSelected()) {
                                                  handleRowClick(row?.original as any, row.index)
                                              }
                                          }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}
                                                   className="!py-1  "
                                        >
                                            <>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </MuiTable>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: data?.pages.length }]}
                        component="div"
                        count={table.getFilteredRowModel().rows.length}
                        rowsPerPage={pageSize}
                        page={pageIndex}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                        }}
                        onPageChange={(_, page) => {
                            table.setPageIndex(page)
                        }}
                        onRowsPerPageChange={e => {
                            const size = e.target.value ? Number(e.target.value) : 10
                            table.setPageSize(size)
                        }}
                        ActionsComponent={TablePaginationActions}
                    />
                    {totalDBRowCount === totalFetched ? (
                        <p className="py-1 px-7 text-gray-500 text-sm">Zobrazené všetky záznamy</p>
                    ) : null}
                </div>
            </section>
        </>
    )
});

Table.displayName = 'MyComponent';

export default Table;