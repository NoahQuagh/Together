import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Modal } from '@/components/modals/Modal.jsx';

export function ProjectTaskModifyModal({ task, membersList = [], labelsList = [], onClose, onSave }) {
    const { t } = useTranslation();

    const [titre, setTitre] = useState(task.titre || '');
    const [desc, setDesc] = useState(task.desc || '');
    const [assignes, setAssignes] = useState(task.assignes || []);
    const [etiquettes, setEtiquettes] = useState(task.etiquettes || []);
    const [dateDebut, setDateDebut] = useState(task.date_debut ? task.date_debut.replace(' ', 'T').slice(0, 16) : '');
    const [dateFin, setDateFin] = useState(task.date_fin ? task.date_fin.replace(' ', 'T').slice(0, 16) : '');
    const [priorite, setPriorite] = useState(task.priorite === 'basse' ? '1' : task.priorite === 'normale' ? '2' : task.priorite === 'haute' ? '3' : '4');
    const [statut, setStatut] = useState(task.statut === 'en_attente' ? '1' : task.statut === 'en_cours' ? '2' : task.statut === 'en_review' ? '3' : '4');

    const [showAssignSubModal, setShowAssignSubModal] = useState(false);
    const [showTagSubModal, setShowTagSubModal] = useState(false);

    const initiales = (nom) => {
        if (!nom) return '';
        return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleRemoveAssignee = (id) => {
        setAssignes(assignes.filter(a => a.id !== id));
    };

    const handleRemoveLabel = (id) => {
        setEtiquettes(etiquettes.filter(e => e.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            tk_id: task.id,
            tk_title: titre,
            tk_desc: desc,
            tk_date_start: dateDebut,
            tk_date_end: dateFin,
            tk_prio: priorite,
            tk_status: statut,
            assignes: assignes.map(a => a.id),
            etiquettes: etiquettes.map(e => e.id)
        });
    };

    const headerContent = (
        <div className="modal-header-meta">
            <h4>{t('edit task')}</h4>
        </div>
    );

    const footerContent = (
        <div className="tk-footer-actions flex justify-end gap-3 w-full">
            <button type="button" className="tk-btn-cancel" onClick={onClose}>{t('cancel')}</button>
            <button type="button" className="tk-btn-save" onClick={handleSubmit}>
                <i className="ti ti-device-floppy" />{t('save')}
            </button>
        </div>
    );

    return (
        <>
            <Modal
                isOpen={Boolean(task)}
                onClose={onClose}
                header={headerContent}
                footer={footerContent}
                size="lg"
            >
                <form className="tk-form-layout" onSubmit={handleSubmit}>
                    <input type="hidden" className="id-tk" value={task.id} />

                    <div className="modal-section modal-section-full mb-4">
                        <label className="modal-section-label">{t('task title')}</label>
                        <input
                            type="text"
                            className="tk-input titre-tk"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-section modal-section-full mb-4">
                        <label className="modal-section-label">{t('description')}</label>
                        <textarea
                            className="tk-input tk-textarea desc-tk"
                            placeholder={`${t('add a description')}...`}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>

                    <div className="modal-section mb-4">
                        <span className="modal-section-label"><i className="ti ti-users" />{t('assigned')}</span>
                        <div className="tk-people">
                            {assignes.map((a) => (
                                <div key={a.id} className="tk-person tk-person-item tk-editable-badge">
                                    <div className="tk-avatar">{initiales(a.nom)}</div>
                                    <span className="tk-person-label" style={{ color: 'var(--color-second-primary)' }}>{a.nom}</span>
                                    <button type="button" className="tk-remove-btn" onClick={() => handleRemoveAssignee(a.id)} title="Retirer">
                                        <i className="ti ti-x" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="tk-btn-add-badge" onClick={() => setShowAssignSubModal(true)}>
                                <i className="ti ti-plus" />{t('add')}
                            </button>
                        </div>
                    </div>

                    <div className="modal-section mb-4">
                        <span className="modal-section-label"><i className="ti ti-tag" />{t('labels')}</span>
                        <div className="tk-etiquettes">
                            {etiquettes.map((e) => (
                                <span key={e.id} className="tk-info-badge tk-tag-item tk-editable-badge" style={{ background: e.couleur, color: 'white' }}>
                                    {e.label}
                                    <button type="button" className="tk-remove-btn" onClick={() => handleRemoveLabel(e.id)} title="Retirer">
                                        <i className="ti ti-x" />
                                    </button>
                                </span>
                            ))}
                            <button type="button" className="tk-btn-add-badge" onClick={() => setShowTagSubModal(true)}>
                                <i className="ti ti-plus" />{t('add')}
                            </button>
                        </div>
                    </div>

                    <div className="modal-section modal-dates">
                        <div className="modal-date-item">
                            <label className="modal-section-label"><i className="ti ti-calendar-event" />{t('beginning')}</label>
                            <input
                                type="datetime-local"
                                className="tk-input date_debut-tk"
                                value={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                            />
                        </div>

                        <div className="modal-date-item">
                            <label className="modal-section-label">{t('priority')}</label>
                            <select className="tk-input tk-select priority-tk" value={priorite} onChange={(e) => setPriorite(e.target.value)}>
                                <option value="1">{t('low')}</option>
                                <option value="2">{t('normal')}</option>
                                <option value="3">{t('high')}</option>
                                <option value="4">{t('critical')}</option>
                            </select>
                        </div>

                        <div className="modal-date-item">
                            <label className="modal-section-label">{t('status')}</label>
                            <select className="tk-input tk-select statut-tk" value={statut} onChange={(e) => setStatut(e.target.value)}>
                                <option value="1">{t('waiting')}</option>
                                <option value="2">{t('in progress')}</option>
                                <option value="3">{t('in review')}</option>
                                <option value="4">{t('finished')}</option>
                            </select>
                        </div>

                        <div className="modal-date-item">
                            <label className="modal-section-label"><i className="ti ti-calendar-due" />{t('end')}</label>
                            <input
                                type="datetime-local"
                                className="tk-input date_fin-tk"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Sous-modale Assignation */}
            <Modal
                isOpen={showAssignSubModal}
                onClose={() => setShowAssignSubModal(false)}
                header={<h4>{t('assign member')}</h4>}
                size="sm"
            >
                <div className="tk-select-list">
                    {membersList.map((m) => (
                        <div key={m.member_id} className="tk-select-item" onClick={() => {
                            if (!assignes.some(a => a.id === m.member_id)) {
                                setAssignes([...assignes, { id: m.member_id, nom: m.member_nom }]);
                            }
                            setShowAssignSubModal(false);
                        }}>
                            <div className="tk-avatar">{initiales(m.member_nom)}</div>
                            <span>{m.member_nom}</span>
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Sous-modale Tags */}
            <Modal
                isOpen={showTagSubModal}
                onClose={() => setShowTagSubModal(false)}
                header={<h4>{t('manage labels')}</h4>}
                size="sm"
            >
                <div className="tk-select-list">
                    {labelsList.map((tag) => (
                        <div key={tag.eti_id} className="tk-select-item" onClick={() => {
                            if (!etiquettes.some(e => e.id === tag.eti_id)) {
                                setEtiquettes([...etiquettes, { id: tag.eti_id, label: tag.eti_label, couleur: tag.eti_couleur }]);
                            }
                            setShowTagSubModal(false);
                        }}>
                            <span className="tk-info-badge" style={{ background: tag.eti_couleur, color: 'white' }}>{tag.eti_label}</span>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
}