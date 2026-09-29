"use client";

import React, { createContext, useContext, useState } from "react";
import {
    AnimatedToastStack,
    useAnimatedToastStack,
} from "@/components/motion/animated-toast-stack";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [position, setPosition] = useState("bottom-right");

    const {
        toasts,
        showToast,
        updateToast,
        dismissToast,
        clearToasts,
    } = useAnimatedToastStack({
        defaultDuration: 4000,
        limit: 5,
    });

    const notify = (title, description = "", status = "info", options = {}) => {
        return showToast({
            title,
            description,
            status,
            ...options,
        });
    };

    return (
        <ToastContext.Provider
            value={{
                showToast,
                notify,
                updateToast,
                dismissToast,
                clearToasts,
                setPosition,
            }}
        >
            {children}

            <AnimatedToastStack
                toasts={toasts}
                onDismiss={dismissToast}
                position={position}
                placement="fixed"
                maxVisible={4}
                classNames={{
                    surface: "bg-[var(--color-main-secondary)] border border-[var(--color-second-six)] text-[var(--color-second-primary)] shadow-2xl",
                }}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast doit être utilisé à l'intérieur d'un ToastProvider");
    }
    return context;
}