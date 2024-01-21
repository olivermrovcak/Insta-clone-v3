import React, {useEffect, useState} from "react";
import {Control, Controller} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {Input, Textarea, ThemeProvider} from "@material-tailwind/react";

interface RHFBasicTextFieldProps {
    name: string;
    label: string;
    rules?: Record<string, unknown>;
    type?: string;
    control: Control;
    autoComplete?: string;
    multiline?: boolean;
    defaultValue?: string | number | boolean;
    readonly?: boolean;
    disabled?: boolean;
    tableView?: boolean;
}

export const RHFBasicTextField = ({
                                      rules,
                                      name,
                                      label,
                                      type,
                                      control,
                                      autoComplete,
                                      defaultValue,
                                      disabled,
                                  }: RHFBasicTextFieldProps) => {

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue ?? ""}
            render={({field: {onChange, value}, fieldState: {error}}) => {

                const generateClassName = () => {
                    let className = 'input-field';
                    if (error) className += ' !input-field--error';
                    return className;
                };

                return (
                    <Input
                        crossOrigin="true"
                        type={type ?? "text"}
                        label={label}
                        autoComplete={autoComplete ?? ""}
                        value={value}
                        onChange={(newValue) => {
                            onChange(newValue);
                        }}
                        error={!!error}
                        disabled={disabled === true}
                        className={generateClassName()} // Use the function here
                        labelProps={{
                            className: "hidden",
                        }} onResize={undefined} onResizeCapture={undefined}                    />
                );
            }}
            rules={rules ?? {}}
        />
    );
};


interface RHFBasicAutocompleteProps {
    name: string;
    label?: string;
    rules?: Record<string, unknown>
    control: Control;
    options: any;
    optionsLabel: string;
    optionsId?: string;
    defaultValue?: any;
    disabled?: boolean;
}


export const RHFBasicTextArea = ({
                                     name,
                                     label,
                                     rules,
                                     type,
                                     control,
                                     autoComplete,
                                     multiline,
                                     defaultValue,
                                     disabled,
                                 }: RHFBasicTextFieldProps) => {
    const [value, setValue] = useState(defaultValue ?? "");

    useEffect(() => {
        setValue(defaultValue ?? null);
    }, [defaultValue]);

    const darkMode = document.documentElement.classList.contains('dark');

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue ?? ""}
            render={({field: {onChange}, fieldState: {error}}) => {

                const generateClassName = () => {
                    let className = 'input-field !h-5';
                    if (error) className += ' !input-field--error';
                    if (disabled) className += ' dark:bg-ssk-dark';
                    className += darkMode ? ' input-field--border-color-dark' : ' input-field--border-color';
                    return className;
                };

                return (
                    <Textarea
                        label={label}
                        autoComplete={autoComplete ?? ""}
                        value={value as any}
                        onChange={(newValue) => {
                            setValue(newValue.target.value);
                            onChange(newValue);
                        }}
                        error={!!error}
                        disabled={disabled === true}
                        className={generateClassName()}
                        labelProps={{
                            className: "hidden ",
                        }} onResize={undefined} onResizeCapture={undefined}                    />)
            }}
            rules={rules ?? {}}
        />
    );
};



