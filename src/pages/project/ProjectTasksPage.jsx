import React, { useState, useEffect, useMemo } from 'react';
import {useOutletContext, useParams} from 'react-router-dom';
import { useTranslation } from '@/context/LanguageContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';

import { ProjectTaskCard } from '@/components/ui/ProjectTaskCard';
import { ProjectTaskDetailModal } from '@/components/modals/ProjectTaskDetailModal';
import { ProjectTaskModifyModal } from '@/components/modals/ProjectTaskModifyModal';
import { TaskFilterDropdown } from '@/components/ui/TaskFilterDropdown.jsx';

import '@/../assets/style/project/projectTasksList.css';
import '@/../assets/style/project/projectApp.css';

export function ProjectTasksPage() {
    const { t } = useTranslation();
    const { projectId } = useParams();

    const { user, projectName, projectMemberInfo } = useOutletContext();
    const members = Array.isArray(projectMemberInfo) ? projectMemberInfo : [];

    const [data, setData] = useState(null);
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        sort: 'asc',
        statut: ['1','2','3'],
        priorite: [],
        assignee: []
    });

    const [selectedDetailTask, setSelectedDetailTask] = useState(null);
    const [selectedModifyTask, setSelectedModifyTask] = useState(null);

    const fetchTasks = () => {
        if (!projectId) return;
        setLoading(true);

        fetch(`/api/loader/loadProject.php?project=${encodeURIComponent(projectId)}`, { credentials: 'include' })
            .then(res => res.json())
            .then(res => {
                if (!res.success) throw new Error(res.message || t('error loading data'));
                setData(res.data);
                setAllTasks(res.data.tasks || []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const handleApplyFilters = (filterParams) => {
        setActiveFilters(filterParams);
    };

    const filteredTasks = useMemo(() => {
        let result = [...allTasks];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(task => task.titre?.toLowerCase().includes(query));
        }

        if (activeFilters.statut && activeFilters.statut.length > 0) {
            result = result.filter(task => {
                const statutIdMap = { 'en_attente': '1', 'en_cours': '2', 'en_review': '3', 'termine': '4', 'finished': '4' };
                const currentStatutId = statutIdMap[task.statut] || String(task.statut);
                return activeFilters.statut.includes(currentStatutId);
            });
        }

        if (activeFilters.priorite && activeFilters.priorite.length > 0) {
            result = result.filter(task => {
                const prioMap = { 'basse': '1', 'normale': '2', 'haute': '3', 'critique': '4' };
                const currentPrioId = prioMap[task.priorite] || String(task.priorite);
                return activeFilters.priorite.includes(currentPrioId);
            });
        }

        if (activeFilters.assignee && activeFilters.assignee.length > 0) {
            result = result.filter(task => {
                if (!task.assignes || !Array.isArray(task.assignes)) return false;
                return task.assignes.some(assignee =>
                    activeFilters.assignee.includes(String(assignee.id || assignee.member_id))
                );
            });
        }

        if (activeFilters.sort === 'asc') {
            result.sort((a, b) => (a.titre || '').localeCompare(b.titre || ''));
        } else if (activeFilters.sort === 'desc') {
            result.sort((a, b) => (b.titre || '').localeCompare(a.titre || ''));
        }

        return result;
    }, [allTasks, searchQuery, activeFilters]);

    if (loading) return <div className="section-loading-center p-8"><LoadingSpinner caption={t('loading')} /></div>;
    if (error) return <div className="p-6"><ErrorState title={t('an error occurred while loading the data')} description={error} onRetry={fetchTasks} /></div>;

    return (
        <article className="w-full flex flex-col gap-4">
            <div className="zone-top px-8 pt-6">
                <h1 className="zone-title text-3xl text-[var(--color-second-secondary)] font-bold">{t('tasks')}</h1>
            </div>

            <div className="zone-top px-8 pt-4 flex flex-row justify-between">
                <div>
                    <button type="button" className="pro-btn items-center active"><i className="ti ti-list"></i>List</button>
                    <button type="button" className="pro-btn items-center"><i className="ti ti-layout-kanban"></i>Kanban</button>
                    <button type="button" className="pro-btn items-center"><i className="ti ti-calendar-month"></i>Calendar</button>
                </div>

                <div className="flex justify-end w-full">
                    <TaskFilterDropdown
                        membersList={data?.membersList || []}
                        initialFilters={activeFilters}
                        onApplyFilters={handleApplyFilters}
                    />

                    <div className="tk-search">
                        <i className="ti ti-search" aria-hidden="true"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search a task') + '...'}
                            className="task-search-input"
                        />
                    </div>

                    <button type="button" className="pro-btn items-center accent">
                        <i className="ti ti-plus" aria-hidden="true"></i>
                        <span>{t('add task')}</span>
                    </button>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="empty-state text-center p-8">
                    <i className="ti ti-filter-off text-4xl"/>
                    <h3>{t('no task found')}.</h3>
                    <p>{t('try modifying or resetting your search criteria')}.</p>
                </div>
            ) : (
                <ul className="tk-grid grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-[var(--space-lg)]" id="tasks-zone">
                    {filteredTasks.map(task => (
                        <ProjectTaskCard
                            key={task.id}
                            task={task}
                            membres={members}
                            onOpenModal={setSelectedDetailTask}
                            onOpenModify={setSelectedModifyTask}
                        />
                    ))}
                </ul>
            )}

            {selectedDetailTask && (
                <ProjectTaskDetailModal
                    task={selectedDetailTask}
                    onClose={() => setSelectedDetailTask(null)}
                />
            )}

            {selectedModifyTask && (
                <ProjectTaskModifyModal
                    task={selectedModifyTask}
                    membersList={data?.membersList || []}
                    labelsList={data?.labelsList || []}
                    onClose={() => setSelectedModifyTask(null)}
                    onSave={() => fetchTasks()}
                />
            )}
        </article>
    );
}