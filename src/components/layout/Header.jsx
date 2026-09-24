import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './../../../assets/style/navigation/header.css'

export function Header({
                           title = "Together",
                           titleLink = "/",
                           searchPlaceholder = "Rechercher...",
                           onSearch,
                           actions = [],
                           tabs,
                           sidebarSections = [],
                           sidebarTitle
                       }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <header>
                <section className="header-disposition-top">
                    <div className="header-disposition-left" style={{ marginLeft: '5px' }}>
                        <div className="menu tooltip-container" onClick={() => setSidebarOpen(true)}>
                            <i className="ti ti-menu-2" aria-hidden="true" />
                            <span className="tooltip-text menuHelp">Ouvrir le menu</span>
                        </div>
                        <Link to={titleLink} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3>{title}</h3>
                        </Link>
                    </div>

                    <div className="header-disposition-left">
                        {onSearch && (
                            <div className="menu account-menu tooltip-container searchZone">
                                <i className="ti ti-search" aria-hidden="true" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                                <span className="tooltip-text normalHelp">Rechercher</span>
                            </div>
                        )}

                        {actions.map((action, idx) => (
                            action.to ? (
                                <Link key={idx} className="menu account-menu tooltip-container" to={action.to}>
                                    <i className={action.icon} aria-hidden="true" />
                                    {action.tooltip && <span className="tooltip-text normalHelp">{action.tooltip}</span>}
                                </Link>
                            ) : (
                                <div key={idx} className="menu account-menu tooltip-container" onClick={action.onClick}>
                                    <i className={action.icon} aria-hidden="true" />
                                    {action.tooltip && <span className="tooltip-text normalHelp">{action.tooltip}</span>}
                                </div>
                            )
                        ))}
                    </div>
                </section>

                {tabs}
            </header>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                title={sidebarTitle || title}
                sections={sidebarSections}
            />
        </>
    );
}