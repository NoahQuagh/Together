import React from 'react';
import { NavLink } from 'react-router-dom';

export function NavigationTabs() {
    return (
        <section className="header-disposition-bottom">
            <div className="header-disposition-line">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-item ${isActive ? 'active-nav' : ''}`}
                >
                    <div className="item">
                        <i className="ti ti-layout-dashboard" aria-hidden="true" />
                        <h4>Tableau de bord</h4>
                    </div>
                </NavLink>

                <NavLink
                    to="/projects"
                    className={({ isActive }) => `nav-item ${isActive ? 'active-nav' : ''}`}
                >
                    <div className="item">
                        <i className="ti ti-folders" aria-hidden="true" />
                        <h4>Mes projets</h4>
                    </div>
                </NavLink>

                <NavLink
                    to="/contributions"
                    className={({ isActive }) => `nav-item ${isActive ? 'active-nav' : ''}`}
                >
                    <div className="item">
                        <i className="ti ti-users" aria-hidden="true" />
                        <h4>Contributions</h4>
                    </div>
                </NavLink>

                <NavLink
                    to="/tasks"
                    className={({ isActive }) => `nav-item ${isActive ? 'active-nav' : ''}`}
                >
                    <div className="item" id="myTasksMenu">
                        <i className="ti ti-checklist" aria-hidden="true" />
                        <h4>Mes tâches</h4>
                    </div>
                </NavLink>
            </div>
        </section>
    );
}