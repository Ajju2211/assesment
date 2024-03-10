import React, { useState } from 'react';
import {  Notification } from 'grommet';

const useToastService = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (title, message, duration = 3000, status,onClose) => {
        const id = Date.now();
        const newToast = { id, title, message, duration, onClose,status };
        setToasts((prevToasts) => [...prevToasts, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    const toastError = (errMsg, duration = 3000) => {
        addToast('Error', errMsg, duration,"warning",()=>{});
    };

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const closeToast = (id, onClose) => {
        if (onClose) {
            onClose();
        }
        removeToast(id);
    };

    const ToastContainer = () => (
        <>
            {toasts.map(({ id, title, status, message, duration, onClose }, index) => (
                <Notification
                    toast
                    title={title}
                    onClose={() => closeToast(id, onClose)}
                    message={message}
                    time={duration}
                    status={status || "info"}
                />
            ))}
        </>
    );

    return { addToast, ToastContainer, toastError };
};

export default useToastService;
