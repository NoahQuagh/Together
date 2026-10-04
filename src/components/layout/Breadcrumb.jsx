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
    const cleanRootLabel = rootLabel.replace(/\s+/g, '');

    const isProjectRoute = pathnames[0] === 'project';
    const projectName = location.state?.projectName;
    const originRoute = location.state?.from;

    const isProfileRoute = pathnames[0]?.toLowerCase() === cleanRootLabel.toLowerCase() || pathnames[0] === 'profile';

    return (
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm">

            {isProfileRoute && pathnames.length === 1 ? (
                <span className="text-white font-semibold">
                    {cleanRootLabel}
                </span>
            ) : (
                <Link to={`/${cleanRootLabel}`} className="text-[color:var(--color-second-five)] hover:text-white transition-colors font-medium">
                    {cleanRootLabel}
                </Link>
            )}

            {/* CAS 1 : VUE PROJET */}
            {isProjectRoute ? (
                <>
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

                    <span className="text-[color:var(--color-second-five)] text-base">
                        <i className="ti ti-chevron-right" />
                    </span>
                    <span className="text-[color:var(--color-second-five)]">
                        Projet
                    </span>

                    <span className="text-[color:var(--color-second-five)] text-base">
                        <i className="ti ti-chevron-right" />
                    </span>
                    <span className="text-white font-semibold">
                        {projectName || "Détails"}
                    </span>
                </>
            ) : (
                !isProfileRoute && pathnames.map((value, index) => {
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