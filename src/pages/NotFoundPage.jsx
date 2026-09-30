import React from "react";
import { useNavigate } from "react-router-dom";
import EmptyStates from "../components/motion/empty-states/empty-states.tsx";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
            <EmptyStates defaultScene="map" />

            <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-lg"
            >
                <i className="ti ti-home" aria-hidden="true" />
                Retour à l'accueil
            </button>
        </div>
    );
}

export default NotFoundPage;