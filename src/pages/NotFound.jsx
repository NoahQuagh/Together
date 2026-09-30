import React from "react";
import { NotFoundGlitch } from "../components/motion/not-found/glitch";

export function NotFound() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[var(--bg-body)] text-[var(--color-second-primary)] p-4">
            <NotFoundGlitch
                code="404"
                title="Page introuvable"
                description="La page que vous recherchez a été déplacée, supprimée ou n'a jamais existé."
                homeHref="/dashboard"
                homeLabel="Retour au tableau de bord"
                browseHref="/myprojects"
                browseLabel="Voir mes projets"
            />
        </div>
    );
}