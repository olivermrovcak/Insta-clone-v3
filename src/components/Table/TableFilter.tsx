import React, {useEffect} from 'react'
import {Table} from "@tanstack/react-table";
import {TableRow} from "@mui/material";
import {Input, Chip, Tooltip} from "@material-tailwind/react";

interface Props<TData> {
    tableRef: Table<TData>,
    tableId?: number
    deleteAction: (rows: any) => void
    filterChange: (filter: any) => void
}

interface Filter {
    columnId: string,
    value: string | number
    isNumeric?: boolean
}

export default function TableFilter<TData>({tableRef, filterChange}: Props<TData>) {

    const [filterArr, setFilterArr] = React.useState<Filter[]>([])

    function handleFilterChange(filterString: string, columnId: string, isNumeric: boolean) {
        const existingFilter = filterArr.find((el: Filter) => el.columnId === columnId);

        if (filterString === '') {
            if (existingFilter) {
                const newFilterArr = filterArr.filter((obj: Filter) => obj.columnId !== columnId);
                setFilterArr(newFilterArr);
            }
            return;
        }

        if (existingFilter && existingFilter.value === filterString) {
            return;
        }

        if (!existingFilter) {
            setFilterArr([...filterArr, {value: filterString, columnId: columnId, isNumeric: isNumeric}]);
        } else {
            const newFilterArr = filterArr.filter((obj: Filter) => obj.columnId !== columnId);
            setFilterArr([...newFilterArr, {value: filterString, columnId: columnId, isNumeric: isNumeric}]);
        }
    }

    useEffect(() => {
        filterChange(filterArr);
    }, [filterArr])

    return (
        <>
            {tableRef.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="w-full">
                    {headerGroup.headers.map(header => (
                        <th key={header.id} className="table-header-th !bg-white dark:!bg-ssk-dark-hover "
                            style={{
                                minWidth: header.getSize() ? header.getSize() : 160
                            }}
                        >
                            {header.column.getCanFilter() ? (
                                <Filter column={header.column} onChange={handleFilterChange}/>
                            ) : <MultiAction
                                selectedRowsLength={tableRef?.getSelectedRowModel()?.rows?.length ?? 0}
                            />}
                            <p className="w-full absolute bottom-0 h-[1px] bg-[#E0E0E0] left-0 z-300 dark:!bg-ssk-dark-secondary"></p>
                        </th>
                    ))}
                </TableRow>
            ))}
        </>
    )
}

interface MultiActionprops {
    children?: React.ReactNode | React.ReactNodeArray
    selectedRowsLength: any
}

function MultiAction({ selectedRowsLength}: MultiActionprops) {
    return (
        <>
            {selectedRowsLength > 0 ? (
                <Tooltip
                    content={"Počet zvolených riadkov: " + selectedRowsLength}
                    placement="bottom"
                    color="blue"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 0 },
                    }}
                    className="bg-blue-600"
                >
                    <Chip
                        color="blue"
                        size="sm"
                        value={selectedRowsLength}
                        className="w-10 text-center"
                    />
                </Tooltip>
            ) : null}
        </>
    )
}

interface FilterProps {
    column: any
    onChange: (filterString: string | number, columnId: string, isNumeric: boolean) => void
}

function Filter({column, onChange}: FilterProps) {
    const columnFilterValue = column.getFilterValue();
    const label = column?.columnDef?.header()?.props.children;

    return (
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? '') as number}
            onChange={value => onChange(value, column.id, column.columnDef.isNumeric)}
            placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
            list={column.id + 'list'}
            label={label}
        />
    )
}

// A debounced input react component
function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                            label,

                        }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
    label?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)
        return () => clearTimeout(timeout)
    }, [value, debounce, onChange])

    return (
        <Input
            type={'text'}
            onChange={e => setValue(e.target.value)}
            value={value}
            placeholder={label}
            className="input-field input-field--border-color"
            labelProps={{
                className: "hidden ",
            }} crossOrigin={undefined} onResize={undefined} onResizeCapture={undefined}/>
    )
}

