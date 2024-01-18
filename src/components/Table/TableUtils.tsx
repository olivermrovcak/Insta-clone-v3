import React from 'react'
import {CellContext, ColumnHelper, HeaderContext} from "@tanstack/react-table";
import {Checkbox} from "@mui/material";
import {format, parseISO} from "date-fns";
import {Tooltip} from "@material-tailwind/react";

const DATE_FORMAT = 'dd.MM.yyyy';
const DATETIME_FORMAT = 'dd.MM.yyyy hh:mm';

const truncateText = (text: string, maxLength: number) => {
    if (text?.length > maxLength) {
        return (
            <Tooltip
                className="w-96"
                content={text} placement="bottom">
                {text?.substring(0, maxLength) + '...'}
            </Tooltip>
        )
    }
    return text;
}

const getFormattedDate = (info: CellContext<any, any>, dateFormat = DATE_FORMAT) => {
    return (info?.getValue() && format(parseISO(info?.getValue()?.toString()), dateFormat)) || '';
}

const getHeader = (col: HeaderContext<any, any>, title: string) => <span>{title}</span>;
const getCell = (content: string) => <span>{truncateText(content, 30)}</span>;
const getCellAsText = (info: CellContext<any, any>) => getCell(info.getValue());
const getCellAsDate = (info: CellContext<any, any>) => getCell(getFormattedDate(info));
const getCellAsDateTime = (info: CellContext<any, any>) => getCell(getFormattedDate(info, DATETIME_FORMAT));

type getCellFunction = (info: CellContext<any, any>) => JSX.Element;

const getColumn = (columnHelper: ColumnHelper<any>, accesor: string, title: string, getCellFnc: getCellFunction, customSize?: number) => {
    return columnHelper.accessor(accesor, {
        id: accesor,
        header: (col) => getHeader(col, title),
        cell: (info) => getCellFnc(info),
        size: customSize ? customSize : 160,
    });
}

export const columnAsText = (columnHelper: ColumnHelper<any>, accesor: string, title: string, isNumeric?: boolean, customSize?: number) => {
    return getColumn(columnHelper, accesor, title, getCellAsText, customSize);
}

export const columnAsDate = (columnHelper: ColumnHelper<any>, accesor: string, title: string, customSize?: number) => {
    return getColumn(columnHelper, accesor, title, getCellAsDate, customSize);
}

export const columnAsDateTime = (columnHelper: ColumnHelper<any>, accesor: string, title: string, isNumeric?: boolean, customSize?: number) => {
    return getColumn(columnHelper, accesor, title, getCellAsDateTime, customSize);
}

export const getSelectColumn = () => {
    return {
        id: 'select',
        header: ({table}: any) => (
            <Checkbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                    className: "!text-spf-primary  "
                }}
            />
        ),
        cell: ({row}: any) => (
            <Checkbox
                {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                    className: "!text-spf-primary ",
                    onClick: (event: React.MouseEvent) => {
                        event.stopPropagation();
                    }
                }}
            />
        ),
        enableResizing: false,
        size: 50,
    }
}
