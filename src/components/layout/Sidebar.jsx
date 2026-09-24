import React from 'react';
import { NavLink } from 'react-router-dom';
import './../../../assets/style/navigation/sidebar.css'

export function Sidebar({
                            isOpen,
                            onClose,
                            title = "Together",
                            sections = [],
                            children
                        }) {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sb-header">
                    <span className="sb-title">{title}</span>
                    <button className="sb-close" onClick={onClose} aria-label="Fermer">
                        <i className="ti ti-x" aria-hidden="true" />
                    </button>
                </div>

                {children}

                {sections.map((section, idx) => (
                    <React.Fragment key={section.label || idx}>
                        {idx > 0 && <div className="sb-divider" />}
                        <div className="sb-section">
                            {section.label && <p className="sb-label">{section.label}</p>}
                            {section.items.map((item, itemIdx) => (
                                <NavLink
                                    key={itemIdx}
                                    to={item.to || "#"}
                                    className="sb-item"
                                    onClick={(e) => {
                                        if (item.onClick) {
                                            e.preventDefault();
                                            item.onClick();
                                        }
                                        onClose();
                                    }}
                                >
                                    <i className={item.icon} aria-hidden="true" />
                                    {item.label}
                                    {item.badge && <span className="sb-badge">{item.badge}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </React.Fragment>
                ))}
            </aside>
        </>
    );
}