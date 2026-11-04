import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Modal } from '@/components/modals/Modal.jsx'; // Ajuste le chemin selon ton projet

export function ProjectTaskDetailModal({ task, onClose }) {
    const { t } = useTranslation();

    if (!task) return null;

    const initiales = (nom) => {
        if (!nom) return '';
        return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return t('not specified');
        return dateStr.split(' ')[0];
    };

    const headerContent = (
        <div className="modal-header-meta">
            <span className="modal-statut">{t(task.statut)}</span>
        </div>
    );

    return (
        <Modal
            isOpen={Boolean(task)}
            onClose={onClose}
            header={headerContent}
            size="lg"
        >
            <h2 className="modal-titre">{task.titre}</h2>
            <p className="modal-desc">
                {task.desc ? task.desc : <em>{t("no description")}</em>}
            </p>
            <div className="modal-section">
                <span className="modal-section-label"><i className="ti ti-users" />{t('assigned')}</span>
                <div className="tk-people">
                    {(task.assignes ?? []).length > 0 ? (
                        task.assignes.map((a, idx) => (
                            <div key={a.id || idx} className="tk-person">
                                <div className="tk-avatar">{initiales(a.nom)}</div>
                                <span className="tk-person-label" style={{ color: 'var(--color-second-primary)' }}>{a.nom}</span>
                            </div>
                        ))
                    ) : (
                        <span className="tk-unassigned unassigned-ink"><i className="ti ti-user-off" />{t('unassigned')}</span>
                    )}
                </div>
            </div>
            <div className="modal-section">
                <span className="modal-section-label"><i className="ti ti-tag" />{t('labels')}</span>
                <div className="tk-etiquettes">
                    {(task.etiquettes ?? []).length > 0 ? (
                        task.etiquettes.map((e, idx) => (
                            <span key={e.id || idx} className="tk-info-badge" style={{ background: e.couleur, color: 'white' }}>{e.label}</span>
                        ))
                    ) : (
                        <span className="modal-empty">{t('no label')}</span>
                    )}
                </div>
            </div>
            <div className="modal-section modal-dates">
                <div className="modal-date-item">
                    <span className="modal-section-label"><i className="ti ti-calendar-event" />{t('beginning')}</span>
                    <span className="tk-date-modal">
                        {task.date_debut ? formatDate(task.date_debut) : t("not specified")} {t('at')} {task.date_debut && task.date_debut.split(' ')[1] ? task.date_debut.split(' ')[1].slice(0, 5) : ''}
                    </span>
                </div>
                <div className="modal-date-item">
                    <span className="modal-section-label"><i className="ti ti-calendar-due" />{t('end')}</span>
                    <span className="tk-date-modal">
                        {task.date_fin ? formatDate(task.date_fin) : t("not specified")} {t('at')} {task.date_fin && task.date_fin.split(' ')[1] ? task.date_fin.split(' ')[1].slice(0, 5) : ''}
                    </span>
                </div>
                <div className="modal-date-item">
                    <span className="modal-section-label"><i className="ti ti-user-check" /> {t("reporter")}</span>
                    <span>{task.reporter ?? '—'}</span>
                </div>
            </div>
        </Modal>
    );
}