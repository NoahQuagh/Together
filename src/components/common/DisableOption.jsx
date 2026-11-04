import React from "react";

export function DisableOption() {
    return (
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center p-6 text-center gap-2">
            <i className="ti ti-crane text-white text-9xl" aria-hidden="true"></i>
            <h3>Cette fonctionnalité n'est pas disponible pour l'instant</h3>

            <div className="mt-4 flex flex-col items-center gap-2">
                <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                    <i className="ti ti-arrow-left" aria-hidden="true"/>
                    Retour
                </button>
            </div>

        </div>
    );
}