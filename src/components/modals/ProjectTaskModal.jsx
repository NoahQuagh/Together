import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';

export function ProjectTaskModal({ task, mode = 'view', membersList = [], labelsList = [], onClose, onSaveSuccess }) {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(mode === 'edit');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        tk_id: task?.id || '',
        tk_title: task?.titre || '',
        tk_desc: task?.desc || '',
        tk_date_start: task?.date_debut ? task.date_debut.replace(' ', 'T').slice(0, 16) : '',
        tk_date_end: task?.date_fin ? task.date_fin.replace(' ', 'T').slice(0, 16) : '',
        tk_prio: task?.priorite === 'basse' ? '1' : task?.priorite === 'normale' ? '2' : task?.priorite === 'haute' ? '3' : '4',
        tk_status: task?.statut === 'en_attente' ? '1' : task?.statut === 'en_cours' ? '2' : task?.statut === 'en_review' ? '3' : '4',
        assignes: task?.assignes?.map((a) => a.id) || [],
        etiquettes: task?.etiquettes?.map((e) => e.id) || [],
    });

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/updateTask.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const result = await res.json();

            if (result.success) {
                onSaveSuccess();
                onClose();
            } else {
                alert(result.message || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            console.error(err);
            alert('Erreur réseau');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!task) return null;

    return (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="text-white font-semibold">{isEditing ? t('edit task') : t('task details')}</h4>
                    <button type="button" className="modal-close-btn" onClick={onClose}>
                        <i className="ti ti-x" />
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSave} className="tk-form-layout">
                        <div className="modal-body space-y-4">
                            <div className="modal-section modal-section-full">
                                <label className="modal-section-label">{t('task title')}</label>
                                <input
                                    type="text"
                                    className="tk-input titre-tk"
                                    value={formData.tk_title}
                                    onChange={(e) => setFormData({ ...formData, tk_title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="modal-section modal-section-full">
                                <label className="modal-section-label">{t('description')}</label>
                                <textarea
                                    className="tk-input tk-textarea desc-tk"
                                    value={formData.tk_desc}
                                    onChange={(e) => setFormData({ ...formData, tk_desc: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="modal-section-label">{t('status')}</label>
                                    <select
                                        className="tk-input tk-select"
                                        value={formData.tk_status}
                                        onChange={(e) => setFormData({ ...formData, tk_status: e.target.value })}
                                    >
                                        <option value="1">{t('waiting')}</option>
                                        <option value="2">{t('in progress')}</option>
                                        <option value="3">{t('in review')}</option>
                                        <option value="4">{t('finished')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="modal-section-label">{t('priority')}</label>
                                    <select
                                        className="tk-input tk-select"
                                        value={formData.tk_prio}
                                        onChange={(e) => setFormData({ ...formData, tk_prio: e.target.value })}
                                    >
                                        <option value="1">{t('low')}</option>
                                        <option value="2">{t('normal')}</option>
                                        <option value="3">{t('high')}</option>
                                        <option value="4">{t('critical')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer tk-footer-actions mt-6 flex justify-end gap-3">
                            <button type="button" className="tk-btn-cancel" onClick={() => setIsEditing(false)}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="tk-btn-save" disabled={isSubmitting}>
                                <i className="ti ti-device-floppy" /> {t('save')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="modal-body space-y-4">
                        <h2 className="modal-titre text-lg font-bold text-white">{task.titre}</h2>
                        <p className="modal-desc text-sm text-zinc-400">{task.desc || <em>{t('no description')}</em>}</p>

                        <div className="flex gap-4 border-t border-white/10 pt-4 text-xs text-zinc-400">
                            <div><strong className="text-white">{t('reporter')}:</strong> {task.reporter || '—'}</div>
                            <div><strong className="text-white">{t('status')}:</strong> {t(task.statut)}</div>
                            <div><strong className="text-white">{t('priority')}:</strong> {t(task.priorite)}</div>
                        </div>

                        <div className="modal-footer justify-end flex gap-2 pt-4">
                            <button type="button" className="tk-btn-wh" onClick={() => setIsEditing(true)}>
                                <i className="ti ti-pencil" /> {t('edit')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}