import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KpiCard } from "../../components/ui/KpiCard";
import { DashBlock } from "../../components/ui/DashBlock";
import {ErrorMessage} from "../../components/ui/ErrorMessage.jsx";
import {LoadingSpinner} from "../../components/ui/LoadingSpinner.jsx";
import './../../../assets/style/home/dashBoard.css';
import {useToolbox} from "../../hooks/useToolbox.js";

export function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { formatDate, prioriteBadge, prioriteIcon } = useToolbox();

    useEffect(() => {
        fetch("/api/loader/loadDashBoardData.php", { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur réseau");
                return res.json();
            })
            .then((res) => {
                if (!res.success) throw new Error(res.message);
                setData(res.data);
            })
            .catch((err) => setError(err.message || "Une erreur est survenue lors du chargement des données."))
            .finally(() => setLoading(false));
    }, []);


    if (loading) {
        return (
            <article className="dash-page">
                <LoadingSpinner
                    caption="On cherche où vous avez été le plus productif… les pauses café ne comptent pas, évidemment."
                />
            </article>
        );
    }

    if (error || !data) {
        return (
            <article className="dash-page">
                <ErrorMessage message={error} />
            </article>
        );
    }

    return (
        <article className="dash-page">
            <div id="dashboard-container" style={{ width: '100%' }}>
                <div className="dash-layout">
                    <div className="dash-kpi-grid">
                        <KpiCard
                            icon="ti ti-checklist"
                            colorClass="dash-kpi-icon--blue"
                            value={data.tasks_today?.length || 0}
                            label="Tâches à faire"
                        />
                        <KpiCard
                            icon="ti ti-alert-triangle"
                            colorClass="dash-kpi-icon--red"
                            value={data.tasks_late?.length || 0}
                            label="Tâches en retard"
                        />
                        <KpiCard
                            icon="ti ti-circle-check"
                            colorClass="dash-kpi-icon--green"
                            value={data.nb_done_month || 0}
                            label="Terminées ce mois"
                        />
                        <KpiCard
                            icon="ti ti-folder"
                            colorClass="dash-kpi-icon--yellow"
                            value={data.project_on?.length || 0}
                            label="Projets actifs"
                        />
                    </div>

                    <div className="dash-grid" id="tab">
                        <DashBlock
                            title="Mes tâches"
                            icon="ti ti-checklist"
                            colorClass="bleu"
                            count={data.tasks_today?.length}
                            emptyMessage="Aucune tâche assignée. C'est officiellement l'heure de la pause café."
                            emptyIcon="ti ti-coffee"
                        >
                            <ul className="dash-task-list">
                                {data.tasks_today?.map((t, idx) => (
                                    <li
                                        key={idx}
                                        className="dash-task-item"
                                        onClick={() => navigate(`/project/${t.projet_uuid}?tab=tasks&search=${encodeURIComponent(t.tache)}`)}
                                    >
                                        <div className="dash-task-top">
                                            <span className="dash-task-titre">{t.tache}</span>
                                            <span className={`badge ${prioriteBadge(t.priorite)}`}>{t.priorite}</span>
                                        </div>
                                        <div className="dash-task-meta">
                                            <span><i className="ti ti-folder" /> {t.projet}</span>
                                            <span><i className="ti ti-calendar" /> {formatDate(t.deadline,t)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </DashBlock>

                        <DashBlock
                            title="En retard"
                            icon="ti ti-alert-triangle"
                            colorClass="rouge"
                            count={data.tasks_late?.length}
                            emptyMessage="Aucune tâche en retard."
                            emptyIcon="ti ti-confetti"
                        >
                            <ul className="dash-task-list">
                                {data.tasks_late?.map((t, idx) => (
                                    <li
                                        key={idx}
                                        className="dash-task-item dash-task-item--late"
                                        onClick={() => navigate(`/project/${t.projet_uuid}?tab=tasks&search=${encodeURIComponent(t.tache)}`)}
                                    >
                                        <div className="dash-task-top">
                                            <span className="dash-task-titre">{t.tache}</span>
                                            <span className={`badge ${prioriteBadge(t.priorite)}`}>{t.priorite}</span>
                                        </div>
                                        <div className="dash-task-meta">
                                            <span><i className="ti ti-folder" /> {t.projet}</span>
                                            <span className="dash-late-date"><i className="ti ti-clock" /> Deadline : {formatDate(t.deadline)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </DashBlock>

                        <DashBlock
                            title="Sprints en cours"
                            icon="ti ti-run"
                            colorClass="gris"
                            count={data.sprint?.length}
                            emptyMessage="Aucun sprint actif pour le moment."
                        >
                            <ul className="dash-sprint-list">
                                {data.sprint?.map((s, idx) => (
                                    <li key={idx} className="dash-sprint-item">
                                        <div className="dash-sprint-top">
                                            <span className="dash-sprint-nom">{s.sprint}</span>
                                        </div>
                                        <div className="dash-task-meta">
                                            <span><i className="ti ti-folder" /> {s.projet}</span>
                                            <span><i className="ti ti-calendar" /> Fin : {formatDate(s.deadline)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </DashBlock>

                        <DashBlock
                            title="Projets actifs"
                            icon="ti ti-folders"
                            colorClass="jaune"
                            count={data.project_on?.length}
                            emptyMessage="Vous ne participez à aucun projet actif."
                        >
                            <ul className="dash-project-list">
                                {data.project_on?.map((p, idx) => (
                                    <li key={idx} className="dash-project-item" onClick={() => navigate(`/project/${p.projet_uuid}`)}>
                                        <span className="dash-project-nom">{p.nom}</span>
                                        <span className="badge badge-blue">{p.role}</span>
                                    </li>
                                ))}
                            </ul>
                        </DashBlock>

                        <DashBlock
                            title="Activité récente"
                            icon="ti ti-activity"
                            colorClass="vert"
                            count={data.activity_project?.length}
                            emptyMessage="Aucune activité récente sur vos projets."
                            isFull
                        >
                            <ul className="dash-activity-list">
                                {data.activity_project?.map((a, idx) => (
                                    <li key={idx} className="dash-activity-item" onClick={() => navigate(`/project/${a.uuid}`)}>
                                        <span className="dash-activity-dot" />
                                        <div className="dash-activity-content">
                                            <span className="dash-activity-desc">{a.description_log}</span>
                                            <div className="dash-task-meta">
                                                <span><i className="ti ti-folder" /> {a.projet}</span>
                                                <span><i className="ti ti-clock" /> {formatDate(a.cree_le)}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </DashBlock>
                    </div>
                </div>
            </div>
        </article>
    );
}