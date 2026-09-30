import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ROUTE_LABELS = {
    dashboard: "Tableau de bord",
    myprojects: "Mes projets",
    mycontributions: "Mes contributions",
    tasks: "Mes tâches",
    profile: "Profil",
    settings: "Paramètres",
    notifications: "Notifications",
    project: "Projet",
};

export function Breadcrumb({ user }) {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const rootLabel = user?.name || "User";

    // Si on est dans un projet, on récupère le nom du projet et l'origine transmis via location.state
    const isProjectRoute = pathnames[0] === 'project';
    const projectName = location.state?.projectName;
    const originRoute = location.state?.from; // ex: { path: '/myprojects', label: 'Mes projets' }

    return (
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm">
            {/* Racine : Nom de l'utilisateur */}
            <Link to="/dashboard" className="text-[color:var(--color-second-five)] hover:text-white transition-colors font-medium">
                {rootLabel}
            </Link>

            {/* CAS SPECIFIQUE : VUE PROJET */}
            {isProjectRoute ? (
                <>
                    {/* 1. Origine d'où l'on vient (ex: Mes projets) */}
                    {originRoute && (
                        <>
                            <span className="text-[color:var(--color-second-five)] text-base">
                                <i className="ti ti-chevron-right" />
                            </span>
                            <Link to={originRoute.path} className="text-[color:var(--color-second-five)] hover:text-white transition-colors">
                                {originRoute.label}
                            </Link>
                        </>
                    )}

                    {/* 2. Étape intermediate "Project" */}
                    <span className="text-[color:var(--color-second-five)] text-base">
                        <i className="ti ti-chevron-right" />
                    </span>
                    <span className="text-[color:var(--color-second-five)]">
                        Project
                    </span>

                    {/* 3. Nom du projet au lieu du UUID */}
                    <span className="text-[color:var(--color-second-five)] text-base">
                        <i className="ti ti-chevron-right" />
                    </span>
                    <span className="text-white font-semibold">
                        {projectName || "Détails"}
                    </span>
                </>
            ) : (
                /* CAS CLASSIQUE POUR TOUTES LES AUTRES PAGES */
                pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const label = ROUTE_LABELS[value] || value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <React.Fragment key={to}>
                            <span className="text-[color:var(--color-second-five)] text-base">
                                <i className="ti ti-chevron-right" />
                            </span>

                            {isLast ? (
                                <span className="text-white font-semibold">{label}</span>
                            ) : (
                                <Link to={to} className="text-[color:var(--color-second-five)] hover:text-white transition-colors">
                                    {label}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })
            )}
        </nav>
    );
}