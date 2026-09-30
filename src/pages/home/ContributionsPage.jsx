import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { FolderProjectItem } from '../../components/ui/FolderProjectItem';
import './../../../assets/style/home/myproject.css';
import {LoadingSpinner} from "../../components/ui/LoadingSpinner.jsx";
import {ErrorMessage} from "../../components/ui/ErrorMessage.jsx";

export function ContributionsPage() {
    const { t } = useTranslation();
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('tout');

    const [projectToLeave, setProjectToLeave] = useState(null);

    useEffect(() => {
        fetch('/api/loader/loadMyContributions.php', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                setContributions(res.data || []);
            })
            .catch((err) => {
                console.error("Erreur contributions :", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleLeaveProject = (project) => {
        setProjectToLeave(project);
        //TODO a dev
    };

    const confirmLeave = () => {
        if (!projectToLeave) return;

        fetch('/api/project/leaveProject.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ project_uuid: projectToLeave.project_uuid })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setContributions((prev) =>
                        prev.filter((p) => p.project_uuid !== projectToLeave.project_uuid)
                    );
                }
            })
            .catch((err) => console.error("Erreur lors de la sortie :", err))
            .finally(() => setProjectToLeave(null));
    };

    // Filtrage
    const filteredContributions = contributions.filter((p) => {
        if (filter === 'tout') return true;
        return p.project_statut_label === filter;
    });

    if (loading) {
        return (
            <article className="dash-page">
                <LoadingSpinner
                    caption={t('we are looking for your projects... even the ones you had forgotten about')}
                />
            </article>
        );
    }

    if (error) {
        return (<article className="dash-page">
            <ErrorMessage message={t(error)} />
        </article>);
    }

    return (
        <article className="dash-page">
            <div className="proj-filters">
                <button
                    className={`proj-filter-btn ${filter === 'tout' ? 'active' : ''}`}
                    onClick={() => setFilter('tout')}
                >
                    <i className="ti ti-layout-grid" />{t('all')}
                </button>
                <button
                    className={`proj-filter-btn ${filter === 'actif' ? 'active' : ''}`}
                    onClick={() => setFilter('actif')}
                >
                    <i className="ti ti-activity" />{t('active')}
                </button>
                <button
                    className={`proj-filter-btn ${filter === 'pause' ? 'active' : ''}`}
                    onClick={() => setFilter('pause')}
                >
                    <i className="ti ti-player-pause" />{t('paused')}
                </button>
                <button
                    className={`proj-filter-btn ${filter === 'termine' ? 'active' : ''}`}
                    onClick={() => setFilter('termine')}
                >
                    <i className="ti ti-check" />{t('finished')}
                </button>
            </div>

            {contributions.length === 0 ? (
                <div className="dash-empty proj-empty-global">
                    <i className="ti ti-folder-off" />
                    <p>{t("you don't have any contributions yet")}</p>
                </div>
            ) : filteredContributions.length === 0 ? (
                <div className="dash-empty proj-empty-filtered">
                    <i className="ti ti-filter-off" />
                    <p>{t('no projects match this filter')}</p>
                </div>
            ) : (
                <div className="projects-folder-grid">
                    {filteredContributions.map((project) => (
                        <FolderProjectItem
                            key={project.project_uuid}
                            project={project}
                            from={{ path: '/mycontributions', label: 'Mes contributions' }}
                            onDelete={handleLeaveProject}
                            onChangeStatus={() => {}}
                            onEdit={() => {}}
                        />
                    ))}
                </div>
            )}

            {projectToLeave && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                {t('leave the project')} ?
                            </h3>
                            <button
                                className="text-gray-400 hover:text-white"
                                onClick={() => setProjectToLeave(null)}
                            >
                                <i className="ti ti-x text-xl" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-300 mb-6">
                            {t('are you sure you want to leave this project ?')}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-xs font-medium text-gray-300 bg-zinc-800 rounded-lg hover:bg-zinc-700"
                                onClick={() => setProjectToLeave(null)}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                onClick={confirmLeave}
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}