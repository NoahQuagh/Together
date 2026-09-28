import React from 'react';
import {Link} from 'react-router-dom';
import {useSidebar} from '../motion/animated-sidebar';
import './../../../assets/style/navigation/header.css';
import {Breadcrumb} from "./Breadcrumb.jsx";

export function Header({
                           title = "Together",
                           titleLink = "/",
                           searchPlaceholder = "Rechercher...",
                           onSearch,
                           actions = [],
                           user,
                           tabs,
                       }) {
    const {toggleSidebar} = useSidebar();


    return (
        <header className="w-full border-[var(--color-main-quaternary)]">
            <section className="header-disposition-top">

                <div className="header-disposition-left" style={{marginLeft: '5px'}}>
                    <button className="sb-close" onClick={toggleSidebar} type="button">
                        <i className="ti ti-layout-sidebar" aria-hidden={true}></i>
                    </button>
                    <Breadcrumb user={user}/>
                </div>

                <div className="header-disposition-left">
                    {onSearch && (
                        <div className="menu account-menu tooltip-container searchZone">
                            <i className="ti ti-search" aria-hidden="true"/>
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
                                <i className={action.icon} aria-hidden="true"/>
                                {action.tooltip && <span className="tooltip-text normalHelp">{action.tooltip}</span>}
                            </Link>
                        ) : (
                            <div key={idx} className="menu account-menu tooltip-container" onClick={action.onClick}>
                                <i className={action.icon} aria-hidden="true"/>
                                {action.tooltip && <span className="tooltip-text normalHelp">{action.tooltip}</span>}
                            </div>
                        )
                    ))}
                </div>
            </section>

            {tabs}
        </header>
    );
}