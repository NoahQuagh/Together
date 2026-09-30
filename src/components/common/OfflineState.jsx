import React, { useState, useEffect } from "react";
import { EmptyStates } from "@/components/motion/empty-states/empty-states.tsx";

export function OfflineState({ children }) {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOffline) {
        return (
            <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
                <div className="w-full max-w-xl">
                    <EmptyStates defaultScene="offline" />
                </div>

                <div className="mt-4 flex flex-col items-center gap-2">
                    <p className="text-sm text-[var(--color-second-tertiary)]">
                        Vérifiez votre connexion Wi-Fi ou vos données mobiles.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        <i className="ti ti-refresh" aria-hidden="true" />
                        Réessayer la connexion
                    </button>
                </div>
            </div>
        );
    }

    return children;
}