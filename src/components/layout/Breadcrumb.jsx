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
};

export function Breadcrumb({user}) {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="text-[color:var(--color-second-five)] hover:text-white transition-colors font-medium">
                {user.name}
            </Link>

            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                const label = ROUTE_LABELS[value] || value.charAt(0).toUpperCase() + value.slice(1);

                return (
                    <React.Fragment key={to}>
                        <span className="text-[color:var(--color-second-five)] text-base"><i className="ti ti-chevron-right"></i></span>

                        {isLast ? (
                            <span className="text-white font-semibold">{label}</span>
                        ) : (
                            <Link to={to} className="text-[color:var(--color-second-five)] hover:text-white transition-colors">
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}