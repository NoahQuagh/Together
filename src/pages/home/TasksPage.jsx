import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { useToolbox } from '../../hooks/useToolbox';
import './../../../assets/style/home/myTasks.css';
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { ErrorState } from "@/components/common/ErrorState.jsx";
import { EmptyStateContainer } from "@/components/common/EmptyStateContainer.jsx";
import { TasksCardUser } from "@/components/ui/TasksCardUser.jsx";
import { SearchableSelect } from "@/components/ui/SearchableSelect.jsx";

export function TasksPage() {
    const { t } = useTranslation();
    const { formatDateTime } = useToolbox();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statutFilter, setStatutFilter] = useState([]);
    const [prioFilter, setPrioFilter] = useState([]);

    useEffect(() => {
        fetch('/api/loader/loadTasksUser.php', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                setTasks(res.data || []);
            })
            .catch((err) => {
                console.error("Erreur chargement des tâches :", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Normalisation permissive du Statut
    const normalizeStatut = (rawStatut) => {
        if (!rawStatut && rawStatut !== 0) return '';
        const str = String(rawStatut).toLowerCase().trim();

        if (str.includes('attente') || str.includes('wait') || str === '1') return 'attente';
        if (str.includes('cours') || str.includes('progress') || str === 'encours' || str === '2') return 'encours';
        if (str.includes('review') || str.includes('relecture') || str === '3') return 'review';
        if (str.includes('termine') || str.includes('fini') || str.includes('done') || str === '4') return 'termine';

        return str;
    };

    // Normalisation permissive de la Priorité
    const normalizePrio = (rawPrio) => {
        if (!rawPrio && rawPrio !== 0) return '';
        const str = String(rawPrio).toLowerCase().trim();

        if (str.includes('bas') || str === '1' || str === 'low') return 'basse';
        if (str.includes('norm') || str.includes('moyen') || str === '2' || str === 'medium') return 'normale';
        if (str.includes('haut') || str === '3' || str === 'high') return 'haute';
        if (str.includes('crit') || str.includes('urg') || str === '4') return 'critique';

        return str;
    };

    const handleTaskClick = (task) => {
        const searchParam = encodeURIComponent(task.titre_tache || '');
        navigate(`/project/${task.projet_uuid}?tab=tasks&search=${searchParam}`);
    };

    // Filtrage dynamique
    const filteredTasks = tasks.filter((task) => {
        const taskStatut = normalizeStatut(task.statut || task.tas_statut_id || task.statut_id);
        const taskPrio = normalizePrio(task.prio || task.tas_prio_id || task.prio_id);

        const matchStatut = statutFilter.length === 0 || statutFilter.includes(taskStatut);
        const matchPrio = prioFilter.length === 0 || prioFilter.includes(taskPrio);

        return matchStatut && matchPrio;
    });

    const statusOptions = [
        { id: 'attente', label: t('waiting') },
        { id: 'encours', label: t('in progress') },
        { id: 'review', label: t('in review') },
        { id: 'termine', label: t('termine') },
    ];

    const priorityOptions = [
        { id: 'basse', label: t('basse') },
        { id: 'normale', label: t('normale') },
        { id: 'haute', label: t('haute') },
        { id: 'critique', label: t('critique') },
    ];

    if (loading) {
        return (
            <article className="dash-page">
                <LoadingSpinner
                    caption={t("we're listing your tasks... hang in there, there can't be that many of them")}
                />
            </article>
        );
    }

    if (error) {
        return (
            <article className="dash-page">
                <ErrorState
                    title="Impossible de charger vos taches"
                    description={error}
                    onRetry={() => window.location.reload()}
                />
            </article>
        );
    }

    return (
        <article className="dash-page p-6 space-y-6">
            <div className="p-4 tasksPageUser rounded-xl border">
                <h3>Filtrer par :</h3>

                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        {t('status')} :
                    </span>
                    <SearchableSelect
                        value={statutFilter}
                        options={statusOptions}
                        keyExpr="id"
                        labelExpr="label"
                        placeholder={t('Tous les statuts')}
                        onChange={(selected) => setStatutFilter(selected)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        {t('priority')} :
                    </span>
                    <SearchableSelect
                        value={prioFilter}
                        options={priorityOptions}
                        keyExpr="id"
                        labelExpr="label"
                        placeholder={t('Toutes les priorités')}
                        onChange={(selected) => setPrioFilter(selected)}
                    />
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <EmptyStateContainer />
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-5">
                    {filteredTasks.map((task, index) => (
                        <TasksCardUser
                            key={task.id || task.tas_id || index}
                            task={task}
                            onClickTask={() => handleTaskClick(task)}
                        />
                    ))}
                </ul>
            )}
        </article>
    );
}