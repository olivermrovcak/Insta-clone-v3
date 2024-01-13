import React from 'react'
import {Checkbox, Input, Menu, MenuHandler, MenuItem, MenuList} from "@material-tailwind/react";
import SearchIcon from "@mui/icons-material/Search";
import {Column} from "@tanstack/react-table";
import SettingsIcon from '@mui/icons-material/Settings';

interface ColumnVisibilityHandlerProps {
    columns?: Column<any>[],
    setColumnVisibilityProp?: any,
    columnVisibilityProp?: any
}

function ColumnVisibilityHandler({columns, setColumnVisibilityProp, columnVisibilityProp}: ColumnVisibilityHandlerProps) {

    const [columnSearchValue, setColumnSearchValue] = React.useState<string>("");

    function handleToggleAllColumns(checked: boolean) {
        setVisibilityToAllColumns(checked);
    }

    const handleColumnVisibilityToggle = (columnId: string) => {
        setColumnVisibilityProp(prevState => ({
            ...prevState,
            [columnId]: !prevState[columnId]
        }));
    };

    function setVisibilityToAllColumns(isVisible: boolean) {
        const newColumnVisibility = {};
        columns?.forEach(column => {
            newColumnVisibility[column.id] = isVisible;
        });
        setColumnVisibilityProp(newColumnVisibility);
    }

    return (
        <Menu
            dismiss={{itemPress: false}}
            animate={{
                mount: {scale: 1, opacity: 1},
                unmount: {scale: 0.5, opacity: 0},
            }}
            placement="bottom-end"
            offset={{mainAxis: 20, crossAxis: 0}}
        >
            <MenuHandler>
                <button
                    className="button-1 ring-0 dark:bg-ssk-dark !text-white
                    shadow-md hover:-translate-y-[1px] transition-all duration-300 hover:!bg-transparent "
                >
                   <SettingsIcon className="text-blue-500"/>
                </button>
            </MenuHandler>
            <MenuList className="h-96 w-96 " >
                <Input onChange={(e) => setColumnSearchValue(e.target.value)} label="Názov stlpca"
                       crossOrigin={undefined}
                       icon={<SearchIcon/>}
                />
                <hr className="my-4"/>
                <MenuItem className="p-2 flex flex-row items-center">
                    <Checkbox
                        color="blue"
                        ripple={false}
                        label="Označiť všetky"
                        onChange={(e) => handleToggleAllColumns(e.target.checked)}
                        containerProps={{className: "p-0"}}
                        labelProps={{className: "ml-2"}}
                        className="hover:before:content-none"
                        crossOrigin={undefined}
                    />
                </MenuItem>
                <hr className="my-2"/>
                {columns?.filter((column: any) => {
                    if (column.id === "select") {
                        return false;
                    }
                    const columnLabel = column.columnDef.label;
                    return columnLabel.toLowerCase().includes(columnSearchValue.toLowerCase()) || column.id.toLowerCase().includes(columnSearchValue.toLowerCase());
                })
                    .map((column: any) => (
                        <React.Fragment key={column.id}>
                            <MenuItem className="p-0">
                                <label
                                    htmlFor="item-1"
                                    className="flex cursor-pointer items-center gap-2 p-2"
                                >
                                    <Checkbox
                                        {...{
                                            type: 'checkbox',
                                            checked: columnVisibilityProp[column.id],
                                            onChange: () => {
                                                handleColumnVisibilityToggle(column.id)
                                            },
                                        }}
                                        color="blue"
                                        ripple={false}
                                        id={column.id}
                                        containerProps={{className: "p-0"}}
                                        className="hover:before:content-none"
                                        crossOrigin={undefined}
                                    />
                                    <p>{column.columnDef.label }</p>
                                </label>
                            </MenuItem>
                        </React.Fragment>
                    ))}

            </MenuList>
        </Menu>
    )
}

export default ColumnVisibilityHandler
