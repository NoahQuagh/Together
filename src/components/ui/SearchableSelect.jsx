import React, { useState, useRef, useEffect } from "react";

export function SearchableSelect({
                                     value = [],
                                     onChange,
                                     options = [],
                                     placeholder = "Sélectionner...",
                                     searchPlaceholder = "Rechercher...",
                                     keyExpr = "id",
                                     labelExpr = "nom",
                                     multiple = true,
                                 }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef(null);

    // Normalisation des valeurs sélectionnées sous forme de tableau de chaînes
    const selectedValues = Array.isArray(value)
        ? value.map(String)
        : value !== null && value !== undefined && value !== "" && value !== "tout"
            ? [String(value)]
            : [];

    // Fermer le menu déroulant lors d'un clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleOption = (optionValue) => {
        if (!multiple) {
            onChange(optionValue);
            setIsOpen(false);
            setSearchTerm("");
            return;
        }

        let updatedValues;
        if (selectedValues.includes(optionValue)) {
            updatedValues = selectedValues.filter((v) => v !== optionValue);
        } else {
            updatedValues = [...selectedValues, optionValue];
        }
        onChange(updatedValues);
    };

    const handleRemoveBadge = (e, optionValue) => {
        e.stopPropagation();
        onChange(selectedValues.filter((v) => v !== optionValue));
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        onChange([]);
    };

    // Filtrage des options selon le texte tapé dans la recherche
    const filteredOptions = options.filter((opt) =>
        String(opt[labelExpr] ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Bouton déclencheur */}
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center justify-between min-h-[42px] w-full px-3 py-1.5 bg-zinc-900/80 border border-white/10 rounded-xl cursor-pointer hover:bg-zinc-800/80 transition-colors"
            >
                <div className="flex flex-wrap gap-1.5 items-center flex-1 max-w-[90%]">
                    {selectedValues.length === 0 ? (
                        <span className="text-zinc-400 text-sm select-none">{placeholder}</span>
                    ) : (
                        selectedValues.map((val) => {
                            const opt = options.find((o) => String(o[keyExpr]) === val);
                            const label = opt ? opt[labelExpr] : val;
                            return (
                                <span
                                    key={val}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600/30 border border-blue-500/40 text-blue-200 text-xs font-medium"
                                >
                  {label}
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveBadge(e, val)}
                                        className="hover:text-white transition-colors"
                                    >
                    <i className="ti ti-x text-xs" />
                  </button>
                </span>
                            );
                        })
                    )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2 text-zinc-400">
                    {selectedValues.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="hover:text-white transition-colors"
                            title="Tout effacer"
                        >
                            <i className="ti ti-x text-sm" />
                        </button>
                    )}
                    <i className={`ti ti-chevron-down text-sm transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {/* Menu déroulant */}
            {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden flex flex-col">
                    {/* Champ de recherche interne */}
                    <div className="p-2 border-b border-white/10 flex items-center gap-2 bg-zinc-950/50">
                        <i className="ti ti-search text-zinc-400 text-sm" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-zinc-500"
                            autoFocus
                        />
                    </div>

                    {/* Liste des options */}
                    <ul className="max-h-56 overflow-y-auto p-1 space-y-0.5">
                        {filteredOptions.length === 0 ? (
                            <li className="px-3 py-2 text-xs text-zinc-500 text-center select-none">
                                Aucun résultat trouvé
                            </li>
                        ) : (
                            filteredOptions.map((opt) => {
                                const optValue = String(opt[keyExpr] ?? "");
                                const optLabel = String(opt[labelExpr] ?? "");
                                const isSelected = selectedValues.includes(optValue);

                                return (
                                    <li
                                        key={optValue}
                                        onClick={() => handleToggleOption(optValue)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors select-none ${
                                            isSelected
                                                ? "bg-blue-600/20 text-blue-300 font-medium"
                                                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                    >
                                        <span>{optLabel}</span>
                                        {isSelected && <i className="ti ti-check text-blue-400 text-sm" />}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}