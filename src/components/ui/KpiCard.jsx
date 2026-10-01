import React from "react";
import '../../../assets/style/ui/KpiCardStyle.css'

export function KpiCard({ icon, colorClass, value, label ,statLabel,stat}) {
    return (
        <div className="dash-kpi-card">

            <div className={"dash-kpi-card-row"}>
                <div className={`dash-kpi-icon ${colorClass}`}>
                    <i className={icon} aria-hidden="true" />
                </div>
                <span className="dash-kpi-label">{label}</span>
            </div>

            <div className={"dash-kpi-card-row pl-2"}>
                <span className="dash-kpi-value">{value}</span>
            </div>


            <div className="dash-kpi-card-row justify-between">
                <span className="dash-kpi-value-sm">{statLabel}</span>
                <span className="dash-kpi-value-sm">{stat}</span>
            </div>
        </div>
    );
}