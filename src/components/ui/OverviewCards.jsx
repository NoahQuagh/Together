import React from 'react';
import {CustomAvatar} from "@/components/ui/CustomAvatar.jsx";

export function OverviewCard({ title, icon, children, className = '' }) {
    return (
        <div className={`ov-card ${className}`}>
            <div className="ov-label">
                {icon && <i className={`ti ${icon}`} aria-hidden="true" />}
                {title}
            </div>
            {children}
        </div>
    );
}

export function ProgressBar({ label, valueText, percent, variant = 'sprint' }) {
    return (
        <div className="prog-row">
            <div className="prog-head">
                <span className="prog-title">{label}</span>
                <span className={`prog-val ${variant === 'late' ? 'prog-val--late' : ''}`}>
                    {valueText}
                </span>
            </div>
            <div className="prog-track">
                <div
                    className={`prog-bar prog-bar--${variant}`}
                    style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                />
            </div>
        </div>
    );
}

export function SprintItem({ sprint }) {
    const totalTasks = Number(sprint.totalTasks ?? 0);
    const doneTasks = Number(sprint.tasks_terminer ?? 0);
    const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const isDone = pct === 100;

    return (
        <li className="sp-item-row">
            <div className="sp-head">
                <span className="sp-name">{sprint.sprint_nom}</span>
                {totalTasks === 0 ? (
                    <span className="sp-badge sp-badge--plan">Planifié</span>
                ) : isDone ? (
                    <span className="sp-badge sp-badge--done">Terminé</span>
                ) : (
                    <span className="sp-badge sp-badge--active">En cours</span>
                )}
            </div>
            <div className="prog-track">
                <div
                    className={`prog-bar ${isDone ? 'prog-bar--tasks' : 'prog-bar--sprint'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </li>
    );
}

export function MemberItem({ member }) {
    if (!member) return null;

    return (
        <li className="mb-item">
            <CustomAvatar
                size={'sm'}
                variant="blue"
                src={`/assets/uploads/avatars/${member.member_avatar}`}
                name={member.member_nom}
                role={member.member_role}
            />
            <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{member.member_nom}</span>
                <span className="text-xs text-zinc-400">{member.member_role}</span>
            </div>
        </li>
    );
}

export function ResourceItem({ resource }) {
    const icon = resource.icon_ressource
        ? resource.icon_ressource.replace(/^ti\s+/, '')
        : 'ti-link';

    return (
        <li>
            <a
                href={resource.link ?? '#'}
                className="res-item"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className={`ti ti-${icon}`} aria-hidden="true" />
                <span className="res-name">{resource.nom_ressource}</span>
                <i className="ti ti-external-link res-ext" aria-hidden="true" />
            </a>
        </li>
    );
}