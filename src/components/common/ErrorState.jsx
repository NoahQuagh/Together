import React from "react";
import { EmptyStates } from "@/components/motion/empty-states/empty-states.tsx";

export function ErrorState({
                               title = "Une erreur est survenue",
                               description = "Impossible de charger les données pour le moment.",
                               onRetry,
                           }) {
    return (
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-xl">
                <EmptyStates defaultScene="offline" />
            </div>

            <div className="mt-4 flex flex-col items-center gap-2">

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        <i className="ti ti-refresh" aria-hidden="true" />
                        Réessayer
                    </button>
                )}
            </div>
        </div>
    );
}