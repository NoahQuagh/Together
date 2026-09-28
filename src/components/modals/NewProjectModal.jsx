import React, { useState } from 'react';
import './../../../assets/style/project/newProjectModal.css'
import './../../../assets/style/tools/modal-dialog.css'
import './../../../assets/script/tools/modal-dialog.js'
import {Modal} from "./Modal.jsx";
import {useTranslation} from "../../context/LanguageContext.jsx";


export function NewProjectModal({ isOpen, onClose }) {
    const [selectedType, setSelectedType] = useState(null);

    if (!isOpen) return null;

    const { t } = useTranslation();
    const handleClose = () => {
        setSelectedType(null);
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Soumission du formulaire
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('new project')}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        form="new-project-form"
                        className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        {t('create')}
                    </button>
                </>
            }
        >
            <form id="new-project-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Vos champs de formulaire ici */}
            </form>
        </Modal>
    );
}


/*<div className="modal-overlay">
            <div className="modal-box modalNewProject">
                <div className="modal-header">
                    {selectedType && (
                        <button className="btn-back" onClick={() => setSelectedType(null)}>
                            <i className="ti ti-arrow-left" />
                        </button>
                    )}
                    <h3>
                        <i className="ti ti-folder-plus" aria-hidden="true" />
                        Créer un nouveau projet
                    </h3>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <i className="ti ti-x" />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="step-select-type">
                        <div className="layout-select-type">
                            <h2>Type de projet</h2>

                            <div
                                className={`card-type-project ${selectedType === 'classic' ? 'selected' : ''}`}
                                onClick={() => setSelectedType('classic')}
                            >
                                <div className="icon-type"><i className="ti ti-folders" /></div>
                                <div className="text-zone">
                                    <h3>Classique</h3>
                                    <p>Organisation complète de vos projets : listes détaillées, gestion Kanban, vue Calendrier et pilotage de Sprints.</p>
                                </div>
                            </div>

                            <div className="card-type-project disable">
                                <div className="icon-type"><i className="ti ti-building-factory-2" /></div>
                                <div className="text-zone">
                                    <h3>Projet d'Affaire <span className="comingSoon">BIENTÔT DISPONIBLE</span></h3>
                                    <p>Gamme d'usinage, dépendance entre étapes et décalage automatique.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="modal-btn btn-cancel" onClick={handleClose}>Annuler</button>
                    <button className="modal-btn btn-confirm" disabled={!selectedType}>Créer</button>
                </div>
            </div>
        </div>*/