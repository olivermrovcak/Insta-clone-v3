import { toast } from "react-toastify";
import React from "react";

const defaultToastProps = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const SuccessToast = (message) => {
    return toast.success(message, defaultToastProps);
};

export const ErrorToast = (message) => {
    return toast.error(message, defaultToastProps);
};

export const WarningToast = (message) => {
    return toast.warning(message, defaultToastProps);
};

export const getDefaultText = (text) => {
    return <div style={{ fontSize: "15px" }}>{text}</div>;
};

export const getTextWithBoldPart = (leftText, bold, rightText) => {
    return (
        <div style={{ fontSize: "15px" }}>
            {leftText}
            <b style={{ fontSize: "18px", marginLeft: "5px" }}>{bold}</b>
            {rightText && <span style={{marginLeft: "5px"}} >{rightText}</span>  }
        </div>
    );
};
