import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { FolderProjectItem } from '../../components/ui/FolderProjectItem.jsx';
import './../../../assets/style/home/myproject.css';

export function ProjectsPage() {
    const { t } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('tout');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/loader/loadMyProject.php`, { credentials: 'include' })
            .then((res) => res.json())
            .then((res) => {
                if (!res.success) throw new Error(res.message);
                setProjects(res.data);
            })
            .catch(() => setError("an error occurred while loading your projects"))
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = (uuid, newStatus) => {
        setProjects(prev => prev.map(p =>
            p.project_uuid === uuid ? { ...p, project_statut_label: newStatus } : p
        ));
        //TODO actionDB
    };

    const handleEdit = (project) => {
        console.log("Éditer le projet :", project);
        //TODO edit modal + actionDB
    };

    const handleDelete = (project) => {
        setProjects(prev => prev.filter(p => p.project_uuid !== project.project_uuid));
        //TODO modal delete + actionDB
    };

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

    const filteredProjects = projects.filter(p => {
        if (filter === 'tout') return true;
        return p.project_statut_label === filter;
    });

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

                {projects.length === 0 ? (
                    <div className="dash-empty proj-empty-global">
                        <i className="ti ti-folder-off" />
                        <p>{t("You haven't created any projects yet")}.</p>
                        <button className="proj-create-btn" onClick={() => window.location.href = '/project/create'}>
                            <i className="ti ti-plus" /> {t('create my first project')}
                        </button>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="dash-empty proj-empty-filtered">
                        <i className="ti ti-filter-off" />
                        <p>{t('no projects match this filter')}.</p>
                    </div>
                ) : (
                    <div className="projects-folder-grid">
                        {filteredProjects.map((project) => (
                            <FolderProjectItem
                                key={project.project_uuid}
                                project={project}
                                onEdit={handleEdit}
                                onChangeStatus={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
        </article>
    );
}