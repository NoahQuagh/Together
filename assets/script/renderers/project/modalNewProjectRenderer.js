import React, { useState, useEffect } from 'react';
import './../../../assets/style/project/newProjectModal.css';
import './../../../assets/style/tools/modal-dialog.css';
import { Modal } from "./Modal.jsx";
import { useTranslation } from "../../context/LanguageContext.jsx";

export function NewProjectModal({ isOpen, onClose }) {
    const { t } = useTranslation();

    // Champs du formulaire
    const [projectUuid, setProjectUuid] = useState('');
    const [projectLink, setProjectLink] = useState('Lien indisponible');
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Toggle Public/Membres & Copie
    const [isPublic, setIsPublic] = useState(false);
    const [copied, setCopied] = useState(false);

    // Membres
    const [members, setMembers] = useState([]);
    const [memberInput, setMemberInput] = useState('');

    // Ressources & Types de ressources dynamiques
    const [typeRessourceList, setTypeRessourceList] = useState([]);
    const [resources, setResources] = useState([]);
    const [resName, setResName] = useState('');
    const [resLink, setResLink] = useState('');
    const [selectedResType, setSelectedResType] = useState(null);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    // 1. Chargement des types de ressources au montage
    useEffect(() => {
        fetch('../api/loader/loadRessourceType.php')
            .then((res) => res.json())
            .then((res) => {
                if (res.success && res.data?.length) {
                    setTypeRessourceList(res.data);
                    setSelectedResType(res.data[0]);
                }
            })
            .catch((err) => console.error("Erreur de chargement des types de ressource :", err));
    }, []);

    // 2. Génération du lien/UUID du projet à l'ouverture de la modale
    useEffect(() => {
        if (!isOpen) return;

        fetch('../assets/script/project/uuidGenerator.php', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.exists) {
                    setProjectUuid(data.pro_uuid || '');
                    setProjectLink(data.pro_path || 'Lien indisponible');
                }
            })
            .catch((err) => console.error("Erreur de génération d'UUID :", err));
    }, [isOpen]);

    // Fermeture & Reset
    const handleClose = () => {
        setProjectName('');
        setProjectDesc('');
        setStartDate('');
        setEndDate('');
        setMembers([]);
        setResources([]);
        setIsPublic(false);
        setCopied(false);
        onClose();
    };

    // Copie du lien
    const handleCopyLink = () => {
        if (!projectLink || projectLink === 'Lien indisponible') return;
        navigator.clipboard.writeText(projectLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Ajout/Retrait Membres
    const handleAddMember = async () => {
        const email = memberInput.trim();
        if (!email) return;

        if (members.some((m) => m.email === email)) {
            setMemberInput('');
            return;
        }

        const newMember = { email, status: 'loading', isValid: false, userId: null, message: '' };
        setMembers((prev) => [...prev, newMember]);
        setMemberInput('');

        try {
            const params = new URLSearchParams({ email });
            const res = await fetch(`../api/validator/checkMember.php?${params.toString()}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();

            setMembers((prev) =>
                prev.map((m) => {
                    if (m.email !== email) return m;
                    const found = !!(data && data.exists);
                    return {
                        ...m,
                        status: 'done',
                        isValid: found,
                        userId: data?.user_id || null,
                        message: found ? '' : (data?.message || 'Aucun compte associé à cet email.')
                    };
                })
            );
        } catch {
            setMembers((prev) =>
                prev.map((m) =>
                    m.email === email
                        ? { ...m, status: 'done', isValid: false, message: 'Impossible de vérifier cet email.' }
                        : m
                )
            );
        }
    };

    const handleRemoveMember = (email) => {
        setMembers((prev) => prev.filter((m) => m.email !== email));
    };

    // Ajout/Retrait Ressources
    const handleAddResource = () => {
        const name = resName.trim();
        const link = resLink.trim();
        if (!name) return;

        setResources((prev) => [
            ...prev,
            {
                id: Date.now(),
                name,
                link,
                typeId: selectedResType?.typeResId || '',
                typeIcon: selectedResType?.typeResIcon || 'link'
            }
        ]);
        setResName('');
        setResLink('');
    };

    const handleRemoveResource = (id) => {
        setResources((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="7xl"
            isNewProject={true}
            header={
                <h3>
                    <i className="ti ti-folder-plus" aria-hidden="true" />
                    Créer un nouveau projet
                </h3>
            }
            footer={
                <>
                    <button className="modal-btn btn-cancel" onClick={handleClose}>
                        {t('cancel') || 'Annuler'}
                    </button>
                    <button className="modal-btn btn-confirm" onClick={handleClose}>
                        {t('confirm') || 'Créer'}
                    </button>
                </>
            }
        >
            <div id="step-form-content" className="step-form-content">
                <div className="form-new-pro">

                    {/* FORMULAIRE GAUCHE */}
                    <form id="form-create-project" className="project-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="hidden" id="project-uuid" name="project_uuid" value={projectUuid} />

                        <div className="form-group">
                            <label htmlFor="project-name" className="form-label">Nom du projet</label>
                            <input
                                type="text"
                                id="project-name"
                                name="project_name"
                                className="form-input"
                                placeholder="Ex: Mon projet"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="project-desc" className="form-label">Description</label>
                            <textarea
                                id="project-desc"
                                name="project_desc"
                                className="form-textarea"
                                rows="3"
                                placeholder="Décrivez les objectifs du projet..."
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                            />
                        </div>

                        <div className="form-col">
                            <div className="form-group">
                                <label htmlFor="project-start" className="form-label">Date de début</label>
                                <input
                                    type="datetime-local"
                                    id="project-start"
                                    name="project_start"
                                    className="form-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="project-end" className="form-label">Date de fin</label>
                                <input
                                    type="datetime-local"
                                    id="project-end"
                                    name="project_end"
                                    className="form-input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* SECTION RESSOURCES */}
                        <div className="form-group">
                            <label className="form-label res-label">
                                <span>Ressources du projet</span>
                                <span className="info-label">
                                    <i className="ti ti-info-circle" aria-hidden="true"></i>
                                    <span>Lien externe utile au projet (GitHub, Figma, Notion, Drive, etc.)</span>
                                </span>
                            </label>

                            <label className="form-label-sm">Nom de la ressource</label>
                            <div className="resource-input-group">
                                <input
                                    type="text"
                                    id="project-resource-name"
                                    name="resource_nom"
                                    className="form-input"
                                    placeholder="Ex: Documentation API"
                                    value={resName}
                                    onChange={(e) => setResName(e.target.value)}
                                />

                                {/* Custom Select */}
                                <div className={`custom-select-wrapper ${isSelectOpen ? 'is-open' : ''}`} id="custom-res-select">
                                    <input type="hidden" id="project-resource-type" name="resource_type_id" value={selectedResType?.typeResId || ''} />

                                    <div className="custom-select-trigger" onClick={() => setIsSelectOpen(!isSelectOpen)}>
                                        <span className="selected-option">
                                            {selectedResType && <i className={`ti ti-${selectedResType.typeResIcon}`} />}
                                        </span>
                                        <i className="ti ti-chevron-down arrow-icon" />
                                    </div>

                                    <div className="custom-select-options">
                                        {typeRessourceList.map((r) => (
                                            <div
                                                key={r.typeResId}
                                                className="custom-option"
                                                onClick={() => {
                                                    setSelectedResType(r);
                                                    setIsSelectOpen(false);
                                                }}
                                            >
                                                <i className={`ti ti-${r.typeResIcon}`} />
                                                <span>{r.typeResNom}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <label className="form-label-sm">Lien de la ressource</label>
                            <div className="resource-input-group">
                                <input
                                    type="text"
                                    id="project-resource-link"
                                    name="resource_link"
                                    className="form-input"
                                    placeholder="Ex: https://github.com/myName/myProject"
                                    value={resLink}
                                    onChange={(e) => setResLink(e.target.value)}
                                />

                                <button className="btn-invite" type="button" onClick={handleAddResource}>
                                    <i className="ti ti-plus" />
                                    <span>Ajouter</span>
                                </button>
                            </div>

                            <div className="selected-members-list" id="selected-ressource-list">
                                {resources.map((r) => (
                                    <div key={r.id} className="member-chip" data-link-res={r.link} data-icon-id={r.typeId}>
                                        <span>{r.name}</span>
                                        <button type="button" className="remove-chip" title="Retirer" onClick={() => handleRemoveResource(r.id)}>
                                            <i className="ti ti-x" aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* ZONE DE DROITE : PARTAGER */}
                    <div className="invite-zone">
                        <h3>Partager</h3>

                        <div className="form-group form-group-inline">
                            <div className="toggle-wrapper">
                                <div className="content-link">
                                    <i className="ti ti-world" aria-hidden="true" />
                                    <div className="text-form-col">
                                        <label htmlFor="project-highlight-toggle" className="form-label">Public</label>
                                        <p>Toute personne avec le lien peut accéder</p>
                                    </div>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="project-highlight-toggle"
                                        name="project_highlight_enabled"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        <div className="project-link-zone">
                            <label className="form-label">Lien du projet</label>
                            <div className="copy-input-wrapper">
                                <p id="project-copy-link" className="link-pro">{projectLink}</p>
                                <button type="button" className="btn-copy" onClick={handleCopyLink} title="Copier le lien">
                                    <i className={copied ? "ti ti-check" : "ti ti-copy"} id="copy-icon" />
                                </button>
                            </div>
                        </div>

                        {/* Zone Membres (Masquée si le projet est Public) */}
                        <div className={`members-selection-zone ${isPublic ? 'is-hidden' : ''}`} id="members-selection-zone">
                            <label className="form-label">Inviter</label>

                            <div className="member-search-wrapper">
                                <input
                                    type="email"
                                    id="member-search-input"
                                    className="form-input"
                                    placeholder="Email du membre..."
                                    value={memberInput}
                                    onChange={(e) => setMemberInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                                />
                                <button className="btn-invite" type="button" onClick={handleAddMember}>
                                    <i className="ti ti-location-plus" />
                                    <span>Inviter</span>
                                </button>
                            </div>

                            <div className="selected-members-list" id="selected-members-list">
                                {members.map((m) => (
                                    <div key={m.email} className={`member-chip ${m.isValid ? 'is-valid' : m.status === 'done' ? 'is-invalid' : ''}`} data-email={m.email}>
                                        <span>{m.email}</span>
                                        <span className="member-status">
                                            {m.status === 'loading' ? (
                                                <span className="loader"></span>
                                            ) : m.isValid ? (
                                                <i className="ti ti-check" aria-hidden="true" />
                                            ) : (
                                                <span className="tooltip-container">
                                                    <i className="ti ti-exclamation-mark" aria-hidden="true" />
                                                    <span className="tooltip-text">{m.message}</span>
                                                </span>
                                            )}
                                        </span>
                                        <button type="button" className="remove-chip" title="Retirer" onClick={() => handleRemoveMember(m.email)}>
                                            <i className="ti ti-x" aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
}