import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';

export function ProjectTaskCard({ task, onOpenModal, onOpenModify }) {
    const { t } = useTranslation();
    const [dropdownShow, setDropdownShow] = useState(false);

    const initiales = (nom) => {
        if (!nom) return '';
        return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return t('not specified');
        return dateStr.split(' ')[0];
    };

    const getActionLabel = (statut) => {
        switch (statut) {
            case 'en_attente':
                return (
                    <>
                        <i className="ti ti-player-play" aria-hidden="true" />
                        {t("start")}
                    </>
                );
            case 'en_cours':
                return (
                    <>
                        <i className="ti ti-pencil-check" aria-hidden="true" />
                        {t("validate")}
                    </>
                );
            case 'en_review':
                return (
                    <>
                        <i className="ti ti-circle-check" aria-hidden="true" />
                        {t("complete")}
                    </>
                );
            default:
                return (
                    <>
                        <i className="ti ti-arrow-back-up" aria-hidden="true" />
                        {t("cancel")}
                    </>
                );
        }
    };

    return (
        <li className={`tk-card ${task.statut} ${task.isLate ? 'is-late' : ''}`} onClick={() => onOpenModal(task)}>
            <div className="tk-card-head">
                <h3 className="tk-titre">{task.titre}</h3>
                <div className="tk-dropdown" onMouseLeave={() => setDropdownShow(false)}>
                    <button type="button" className="zone-more" onClick={(e) => { e.stopPropagation(); setDropdownShow(!dropdownShow); }}>
                        <i className="ti ti-dots-vertical" />
                    </button>
                    <div className={`tk-dropdown-menu ${dropdownShow ? 'show' : ''}`}>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setDropdownShow(false); onOpenModify(task); }}>
                            <i className="ti ti-pencil" /> {t('edit')}
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); }}>
                            <i className="ti ti-copy" /> {t('duplicate')}
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); }}>
                            <i className="ti ti-user-plus" /> {t('become co worker')}
                        </button>
                        <div className="dropdown-divider" />
                        <button type="button" className="danger" onClick={(e) => { e.stopPropagation(); }}>
                            <i className="ti ti-trash" /> {t('delete')}
                        </button>
                    </div>
                </div>
            </div>

            <p className="tk-card-desc">
                {task.desc ? task.desc : <span className="tk-desc-empty">{t('no description')}</span>}
            </p>

            <div className="tk-card-meta">
                <div className="tk-meta-col">
                    <span className="tk-meta-label">{t('assigned')}</span>
                    <div className="tk-avatars">
                        {(task.assignes ?? []).length > 0 ? (
                            <>
                                {task.assignes.slice(0, 4).map((a, idx) => (
                                    <div key={idx} className="tk-avatar" title={a.nom}>{initiales(a.nom)}</div>
                                ))}
                                {task.assignes.length > 4 && (
                                    <div className="tk-avatar tk-avatar-more">+{task.assignes.length - 4}</div>
                                )}
                            </>
                        ) : (
                            <span className="tk-unassigned"><i className="ti ti-user-off" />{t('unassigned')}</span>
                        )}
                    </div>
                </div>

                <div className="tk-meta-col">
                    <span className="tk-meta-label">{t('deadline')}</span>
                    <span className={`tk-deadline ${task.isLate ? 'is-late-text' : ''}`}>
                        <i className="ti ti-calendar-event" aria-hidden="true" />
                        {task.date_fin ? formatDate(task.date_fin) : t('not specified')}
                    </span>
                </div>
            </div>

            <div className="tk-card-foot">
                <span className={`tk-badge tk-badge-statut tk-badge-${task.statut}`}>
                    {t(task.statut)}
                </span>
                <span className={`tk-badge tk-badge-prio tk-badge-prio-${task.priorite}`}>
                    {t(task.priorite)}
                </span>
                <button
                    className="tk-quick-action"
                    onClick={(e) => {
                        e.stopPropagation();//TODO action here
                    }}
                    title={t('quick action')}
                >
                    {getActionLabel(task.statut)}
                </button>
            </div>
        </li>
    );
}