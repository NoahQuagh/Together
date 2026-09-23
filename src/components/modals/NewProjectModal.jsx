import React, { useState } from 'react';

export function NewProjectModal({ isOpen, onClose }) {
    const [selectedType, setSelectedType] = useState(null);

    if (!isOpen) return null;

    const handleClose = () => {
        setSelectedType(null);
        onClose();
    };

    return (
        <div className="modal-overlay">
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
        </div>
    );
}