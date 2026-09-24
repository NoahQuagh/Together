import React from "react";

export function KpiCard({ icon, colorClass, value, label }) {
    return (
        <div className="dash-kpi-card">
            <div className={`dash-kpi-icon ${colorClass}`}>
                <i className={icon} aria-hidden="true" />
            </div>
            <div className="dash-kpi-info">
                <span className="dash-kpi-value">{value}</span>
                <span className="dash-kpi-label">{label}</span>
            </div>
        </div>
    );
}