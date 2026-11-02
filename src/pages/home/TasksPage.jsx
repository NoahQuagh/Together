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

    const [statutFilter, setStatutFilter] = useState('tout');
    const [prioFilter, setPrioFilter] = useState('tout');

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

    const normalizeStatut = (rawStatut) => {
        if (!rawStatut) return '';
        const str = String(rawStatut).toLowerCase().trim();

        if (str.includes('attente') || str === 'waiting' || str === '1') return 'attente';
        if (str.includes('cours') || str === 'in progress' || str === 'encours' || str === '2') return 'encours';
        if (str.includes('review') || str.includes('relecture') || str === '3') return 'review';
        if (str.includes('termine') || str.includes('fini') || str === '4') return 'termine';

        return str;
    };

    const normalizePrio = (rawPrio) => {
        if (!rawPrio) return '';
        return String(rawPrio).toLowerCase().trim();
    };

    const handleTaskClick = (task) => {
        const searchParam = encodeURIComponent(task.titre_tache || '');
        navigate(`/project/${task.projet_uuid}?tab=tasks&search=${searchParam}`);
    };

    const filteredTasks = tasks.filter((task) => {
        const taskStatut = normalizeStatut(task.statut);
        const taskPrio = normalizePrio(task.prio);

        const matchStatut = statutFilter === 'tout' || taskStatut === statutFilter;
        const matchPrio = prioFilter === 'tout' || taskPrio === prioFilter;

        return matchStatut && matchPrio;
    });

    const statusOptions = [
        { id: 'tout', label: t('all') },
        { id: 'attente', label: t('waiting') },
        { id: 'encours', label: t('in progress') },
        { id: 'review', label: t('in review') },
        { id: 'termine', label: t('termine') },
    ];

    const priorityOptions = [
        { id: 'tout', label: t('all') },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        {t('status')} :
                    </span>
                    <SearchableSelect
                        value={statutFilter}
                        options={statusOptions}
                        keyExpr="id"
                        labelExpr="label"
                        placeholder={t('select status')}
                        onChange={(val) => setStatutFilter(val || 'tout')}
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
                        placeholder={t('select priority')}
                        onChange={(val) => setPrioFilter(val || 'tout')}
                    />
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <EmptyStateContainer />
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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