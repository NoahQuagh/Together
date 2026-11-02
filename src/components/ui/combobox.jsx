"use client";

import React, { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Search, X } from "lucide-react";

function AutoHeight({ children, reduceMotion }) {
    const innerRef = useRef(null);
    const [height, setHeight] = useState("auto");

    useEffect(() => {
        const inner = innerRef.current;
        if (!inner) return;
        const observer = new ResizeObserver(() => {
            if (inner.offsetHeight > 0) {
                setHeight(inner.offsetHeight);
            }
        });
        observer.observe(inner);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            style={{ overflow: "hidden" }}
            initial={false}
            animate={{ height }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
        >
            <div ref={innerRef}>{children}</div>
        </motion.div>
    );
}

export const Combobox = forwardRef(function Combobox(
    {
        label,
        options = [],
        value: controlledValue,
        defaultValue = "",
        onValueChange,
        description,
        placeholder = "Rechercher...",
        emptyMessage = "Aucun résultat",
        id,
        className = "",
        disabled,
        onFocus,
        ...inputProps
    },
    forwardedRef
) {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const listboxId = `${controlId}-listbox`;
    const hintId = description ? `${controlId}-description` : undefined;
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const optionRefs = useRef({});
    const reduceMotion = useReducedMotion();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = useMemo(() => {
        return options.find((option) => String(option.value) === String(controlledValue));
    }, [options, controlledValue]);

    useImperativeHandle(forwardedRef, () => inputRef.current);

    const updatePosition = () => {
        if (rootRef.current) {
            const rect = rootRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY + 6,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    const filteredOptions = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();
        if (!normalizedQuery) return options;
        return options.filter((option) =>
            [option.label, ...(option.keywords ?? [])].some((term) =>
                String(term).toLocaleLowerCase().includes(normalizedQuery)
            )
        );
    }, [options, query]);

    useEffect(() => {
        if (open) {
            updatePosition();
            const handlePointerDown = (event) => {
                if (
                    rootRef.current && !rootRef.current.contains(event.target) &&
                    !event.target.closest(`[role="listbox"]`)
                ) {
                    setOpen(false);
                    setQuery("");
                }
            };
            document.addEventListener("pointerdown", handlePointerDown);
            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition, true);
            return () => {
                document.removeEventListener("pointerdown", handlePointerDown);
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition, true);
            };
        }
    }, [open]);

    const choose = (option) => {
        if (option.disabled) return;
        onValueChange?.(option.value);
        setQuery("");
        setOpen(false);
    };

    const clear = (event) => {
        event.stopPropagation();
        onValueChange?.("");
        setQuery("");
    };

    const openMenu = () => {
        if (disabled) return;
        updatePosition();
        setOpen(true);
        setQuery("");
    };

    const displayValue = open ? query : (selectedOption?.label ?? "");

    return (
        <div ref={rootRef} className={`relative flex flex-col gap-1.5 w-full ${className}`}>
            {label && <label className="text-xs font-semibold text-zinc-300" htmlFor={controlId}>{label}</label>}
            <div
                onClick={openMenu}
                className={`relative flex h-11 w-full items-center rounded-xl bg-[#1a1b1e] border border-white/10 px-3 py-2 text-sm text-white cursor-pointer focus-within:border-white/40 transition-all ${disabled ? "opacity-50" : ""}`}
            >
                <Search className="text-zinc-400 mr-2 shrink-0" size={16} />
                <input
                    {...inputProps}
                    ref={inputRef}
                    id={controlId}
                    type="text"
                    role="combobox"
                    value={displayValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-describedby={hintId}
                    aria-expanded={open}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 cursor-pointer"
                    onChange={(event) => {
                        setQuery(event.target.value);
                        if (!open) setOpen(true);
                    }}
                />
                <AnimatePresence>
                    {selectedOption && !disabled && (
                        <motion.button
                            type="button"
                            className="p-1 text-zinc-400 hover:text-white shrink-0"
                            onClick={clear}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <X size={16} />
                        </motion.button>
                    )}
                </AnimatePresence>
                <ChevronDown className="text-zinc-400 ml-1 shrink-0" size={16} />
            </div>

            {typeof document !== "undefined" && open && createPortal(
                <AnimatePresence>
                    <motion.div
                        style={{
                            position: "absolute",
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            width: `${coords.width}px`,
                            zIndex: 99999,
                        }}
                        className="bg-[#18191c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[200px]"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                    >
                        <AutoHeight reduceMotion={reduceMotion}>
                            <div id={listboxId} className="max-h-60 overflow-y-auto p-1.5 space-y-0.5" role="listbox">
                                {filteredOptions.length ? (
                                    filteredOptions.map((option, index) => {
                                        const isSelected = String(option.value) === String(controlledValue);
                                        return (
                                            <div
                                                key={option.value}
                                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                                                    isSelected ? "bg-white/10 text-white font-bold" : "text-zinc-300 hover:bg-white/5"
                                                }`}
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => choose(option)}
                                            >
                                                <span className="truncate">{option.label}</span>
                                                {isSelected && <Check size={16} className="text-emerald-400 shrink-0 ml-2" />}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 text-center text-xs text-zinc-500">{emptyMessage}</div>
                                )}
                            </div>
                        </AutoHeight>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
});

Combobox.displayName = "Combobox";