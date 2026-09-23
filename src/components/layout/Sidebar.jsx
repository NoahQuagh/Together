import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar({ isOpen, onClose, onOpenNewProject }) {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sb-header">
                    <span className="sb-title">Together</span>
                    <button className="sb-close" onClick={onClose} aria-label="Fermer">
                        <i className="ti ti-x" aria-hidden="true" />
                    </button>
                </div>

                <div className="sb-section">
                    <p className="sb-label">GÉNÉRAL</p>
                    <NavLink to="/dashboard" className="sb-item" onClick={onClose}>
                        <i className="ti ti-smart-home" aria-hidden="true" />Accueil
                    </NavLink>
                    <NavLink to="/notifications" className="sb-item" onClick={onClose}>
                        <i className="ti ti-bell" aria-hidden="true" />Notifications
                        <span className="sb-badge">3</span>
                    </NavLink>
                    <NavLink to="/calendar" className="sb-item" onClick={onClose}>
                        <i className="ti ti-calendar" aria-hidden="true" />Calendrier
                    </NavLink>
                </div>

                <div className="sb-divider" />

                <div className="sb-section">
                    <p className="sb-label">PROJETS</p>
                    <NavLink to="/projects" className="sb-item" onClick={onClose}>
                        <i className="ti ti-folder" aria-hidden="true" />Mes projets
                    </NavLink>
                    <NavLink to="/contributions" className="sb-item" onClick={onClose}>
                        <i className="ti ti-users" aria-hidden="true" />Contributions
                    </NavLink>
                    <button className="sb-item sb-btn" onClick={() => { onClose(); onOpenNewProject(); }}>
                        <i className="ti ti-circle-plus" aria-hidden="true" />Nouveau projet
                    </button>
                </div>

                <div className="sb-divider" />

                <div className="sb-section">
                    <p className="sb-label">TRAVAIL</p>
                    <NavLink to="/tasks" className="sb-item" onClick={onClose}>
                        <i className="ti ti-checklist" aria-hidden="true" />Mes tâches
                    </NavLink>
                </div>

                <div className="sb-divider" />

                <div className="sb-section">
                    <p className="sb-label">ANALYSE</p>
                    <NavLink to="/stats" className="sb-item" onClick={onClose}>
                        <i className="ti ti-chart-bar" aria-hidden="true" />Statistiques
                    </NavLink>
                    <NavLink to="/reports" className="sb-item" onClick={onClose}>
                        <i className="ti ti-report" aria-hidden="true" />Rapports
                    </NavLink>
                </div>

                <div className="sb-divider" />

                <div className="sb-section">
                    <p className="sb-label">COMPTE</p>
                    <NavLink to="/settings" className="sb-item" onClick={onClose}>
                        <i className="ti ti-settings-2" aria-hidden="true" />Paramètres
                    </NavLink>
                    <a href="/api/auth/logout.php" className="sb-item">
                        <i className="ti ti-logout" aria-hidden="true" />Déconnexion
                    </a>
                </div>
            </aside>
        </>
    );
}