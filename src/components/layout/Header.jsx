import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { NavigationTabs } from './NavigationTabs';

export function Header({ onOpenNewProject }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Affiche les onglets uniquement sur les pages principales
    const showTabs = ['/dashboard', '/projects', '/contributions', '/tasks'].includes(location.pathname);

    return (
        <>
            <header>
                <section className="header-disposition-top">
                    <div className="header-disposition-left" style={{ marginLeft: '5px' }}>
                        <div className="menu tooltip-container" onClick={() => setSidebarOpen(true)}>
                            <i className="ti ti-menu-2" aria-hidden="true" />
                            <span className="tooltip-text menuHelp">Ouvrir le menu</span>
                        </div>
                        <h3>Together</h3>
                    </div>

                    <div className="header-disposition-left">
                        <div className="menu account-menu tooltip-container searchZone">
                            <i className="ti ti-search" aria-hidden="true" />
                            <input type="text" placeholder="Rechercher..." />
                            <span className="tooltip-text normalHelp">Rechercher</span>
                        </div>

                        <div className="menu account-menu tooltip-container" onClick={onOpenNewProject}>
                            <i className="ti ti-plus" />
                            <span className="tooltip-text normalHelp">Nouveau projet</span>
                        </div>

                        <Link className="menu account-menu tooltip-container" to="/profile">
                            <i className="ti ti-user" aria-hidden="true" />
                            <span className="tooltip-text userHelp">Profil</span>
                        </Link>
                    </div>
                </section>

                {showTabs && <NavigationTabs />}
            </header>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpenNewProject={onOpenNewProject}
            />
        </>
    );
}