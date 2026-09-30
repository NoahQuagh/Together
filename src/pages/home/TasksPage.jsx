import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { useToolbox } from '../../hooks/useToolbox';
import './../../../assets/style/home/myTasks.css'
import {LoadingSpinner} from "../../components/ui/LoadingSpinner.jsx";
import {ErrorMessage} from "../../components/ui/ErrorMessage.jsx";
import {ErrorState} from "@/components/common/ErrorState.jsx";
import EmptyStates from "../../components/motion/empty-states/empty-states.tsx";
import {EmptyStateContainer} from "@/components/common/EmptyStateContainer.jsx";

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
            <div className="flex flex-col gap-3 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 mr-2 uppercase tracking-wider">
            {t('status')} :
          </span>
                    {[
                        { id: 'tout', label: t('all'), icon: 'ti-layout-grid' },
                        { id: 'attente', label: t('waiting'), icon: 'ti-loader' },
                        { id: 'encours', label: t('in progress'), icon: 'ti-circle-dashed' },
                        { id: 'review', label: t('in review'), icon: 'ti-telescope' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setStatutFilter(item.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                statutFilter === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                        >
                            <i className={`ti ${item.icon}`} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 mr-2 uppercase tracking-wider">
            {t('priority')} :
          </span>
                    {[
                        { id: 'tout', label: t('all'), icon: 'ti-layout-grid' },
                        { id: 'basse', label: t('basse') },
                        { id: 'normale', label: t('normale') },
                        { id: 'haute', label: t('haute') },
                        { id: 'critique', label: t('critique') },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setPrioFilter(item.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                prioFilter === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                        >
                            {item.icon && <i className={`ti ${item.icon}`} />}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <EmptyStateContainer/>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map((task, index) => (
                        <li
                            key={task.id_tache || index}
                            onClick={() => handleTaskClick(task)}
                            className={`flex flex-col justify-between p-4 bg-zinc-900/80 border rounded-xl cursor-pointer transition-all hover:scale-[1.01] hover:border-blue-500/50 ${
                                task.isLate
                                    ? 'border-red-500/50 bg-red-950/10'
                                    : 'border-white/10'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 font-semibold text-white text-sm">
                                        <i className="ti ti-clipboard-list text-blue-400" />
                                        <span>{task.titre_tache}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                        <i className="ti ti-folder text-zinc-500" />
                                        <span>{task.projet_nom}</span>
                                    </div>
                                </div>
                                <i className="ti ti-external-link text-zinc-500 hover:text-white transition-colors" />
                            </div>

                            {task.desc_tache && (
                                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                                    {task.desc_tache}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-zinc-500">
                                <div className="flex items-center gap-1">
                                    <i className="ti ti-calendar" />
                                    <span>{formatDateTime ? formatDateTime(task.date_fin) : task.date_fin}</span>
                                </div>
                                {task.reporter && (
                                    <span className="truncate max-w-[100px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                    {task.reporter}
                  </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}