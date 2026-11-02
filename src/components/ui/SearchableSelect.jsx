import React from "react";
import {Combobox} from "@/components/ui/combobox.jsx";

export function SearchableSelect({
                                                value,
                                                onChange,
                                                options = [],
                                                placeholder = "Rechercher...",
                                                defaultLabel,
                                                keyExpr = "id",
                                                labelExpr = "nom"
                                            }) {
    const formattedOptions = [
        ...(defaultLabel ? [{ value: "", label: defaultLabel }] : []),
        ...options.map((opt) => ({
            value: String(opt[keyExpr] ?? ""),
            label: String(opt[labelExpr] ?? ""),
        })),
    ];

    const handleSelect = (selectedValue) => {
        if (!selectedValue) {
            onChange("");
        } else {
            onChange(selectedValue);
        }
    };

    return (
        <div className="w-full">
            <Combobox
                options={formattedOptions}
                value={value !== null && value !== undefined ? String(value) : ""}
                onValueChange={handleSelect}
                placeholder={placeholder}
                className="w-full"
            />
        </div>
    );
}