import React, { useState, useEffect } from 'react';
import {useOutletContext, useParams} from 'react-router-dom';
import { useTranslation } from '@/context/LanguageContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import {
    OverviewCard,
    ProgressBar,
    SprintItem,
    MemberItem,
    ResourceItem
} from '@/components/ui/OverviewCards';

import '@/../assets/style/project/projectOverview.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

export function ProjectOverviewPage() {
    const { t } = useTranslation();
    const { projectId } = useParams();
    const { user, projectName, projectMemberInfo } = useOutletContext();
    const members = Array.isArray(projectMemberInfo) ? projectMemberInfo : [];

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        if (!projectId) return;

        fetch(`/api/loader/loadOverviewProjectData.php?project=${encodeURIComponent(projectId)}`, {
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((res) => {
                if (!isMounted) return;
                if (!res.success) throw new Error(res.message || t('error loading data'));
                setData(res);
            })
            .catch((err) => {
                if (isMounted) setError(err.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [projectId]);

    if (loading) {
        return (
            <div className="section-loading-center p-8 flex items-center justify-center">
                <LoadingSpinner caption={t('loading')} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6">
                <ErrorState
                    title={t('an error occurred while loading the data')}
                    description={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    const tasks = data.tasksKN?.[0] ?? {};
    const sprints = data.sprintKN?.[0] ?? {};
    const membersKN = data.membersKN ?? [];
    const sprintAvance = data.sprintAvance ?? [];
    const ressources = data.ressourceList ?? [];

    const todo = Number(tasks.nb_tas_wait ?? 0);
    const inProgress = Number(tasks.nb_tas_progress ?? 0);
    const review = Number(tasks.nb_tas_review ?? 0);
    const done = Number(tasks.nb_tas_terminer ?? 0);
    const late = Number(tasks.nb_tas_late ?? 0);
    const total = todo + inProgress + review + done;

    const sprintsDone = Number(sprints.nb_spr_terminer ?? 0);
    const sprintsTotal = sprintAvance.length;

    const pctSprints = sprintsTotal ? Math.round((sprintsDone / sprintsTotal) * 100) : 0;
    const pctTasks = total ? Math.round((done / total) * 100) : 0;
    const pctLate = total ? Math.round((late / total) * 100) : 0;

    const prioBasse = Number(tasks.nb_tas_basse ?? 0);
    const prioNormale = Number(tasks.nb_tas_normale ?? 0);
    const prioHaute = Number(tasks.nb_tas_haute ?? 0);
    const prioCritique = Number(tasks.nb_tas_critique ?? 0);

    const colGreen = '#1baf7a';
    const colBlue = '#2a78d6';
    const colYellow = '#eda100';
    const colOrange = '#eb6834';
    const colRed = '#e34948';
    const colMuted = '#7a7168';

    const kpiDonutData = {
        labels: [t('À faire'), t('En cours'), t('Review'), t('Terminées')],
        datasets: [{
            data: [todo, inProgress, review, done],
            backgroundColor: [colMuted, colYellow, colOrange, colGreen],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const kpiDonutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
    };

    const prioBarData = {
        labels: [t('Basse'), t('Normale'), t('Haute'), t('Critique')],
        datasets: [{
            label: t('Nombre de tâches'),
            data: [prioBasse, prioNormale, prioHaute, prioCritique],
            backgroundColor: [colBlue, colGreen, colYellow, colRed],
            borderRadius: 4,
            borderWidth: 0
        }]
    };

    const prioBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: colMuted, font: { size: 11 } }, grid: { display: false }, border: { display: false } },
            y: { ticks: { color: colMuted, font: { size: 11 }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } }
        }
    };

    const memberBarData = {
        labels: membersKN.map((m) => m.membre || 'Membre'),
        datasets: [
            { label: t('Terminées'), data: membersKN.map((m) => Number(m.nb_terminer ?? 0)), backgroundColor: colGreen, borderRadius: 3, stack: 's' },
            { label: t('En cours'), data: membersKN.map((m) => Number(m.nb_en_cours ?? 0)), backgroundColor: colYellow, borderRadius: 3, stack: 's' },
            { label: t('Review'), data: membersKN.map((m) => Number(m.nb_en_revue ?? 0)), backgroundColor: colOrange, borderRadius: 3, stack: 's' },
            { label: t('À faire'), data: membersKN.map((m) => Number(m.nb_a_faire ?? 0)), backgroundColor: colBlue, borderRadius: 3, stack: 's' }
        ]
    };

    const memberBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
            x: { stacked: true, ticks: { color: colMuted, font: { size: 11 } }, grid: { display: false }, border: { display: false } },
            y: { stacked: true, ticks: { color: colMuted, font: { size: 11 }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } }
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="zone-top px-8 pt-6">
                <h1 className="zone-title text-3xl text-[var(--color-second-secondary)] font-bold">{t('overview')}</h1>
            </div>

            <div id="overview-zone">
                <div id="avancer-layout">
                    <OverviewCard title={t('Avancement général')} icon="ti-trending-up">
                        <ProgressBar
                            label={t('Sprints terminés')}
                            valueText={`${sprintsDone} / ${sprintsTotal}`}
                            percent={pctSprints}
                            variant="sprint"
                        />
                        <ProgressBar
                            label={t('Tâches terminées')}
                            valueText={`${done} / ${total}`}
                            percent={pctTasks}
                            variant="tasks"
                        />
                        <ProgressBar
                            label={t('Tâches en retard')}
                            valueText={`${late} / ${total}`}
                            percent={pctLate}
                            variant="late"
                        />
                    </OverviewCard>
                </div>

                <div id="totTache-layout">
                    <OverviewCard title={t('Statut des tâches')} icon="ti-checklist">
                        <div className="kpi-donut-container relative h-[160px] my-2">
                            <Doughnut data={kpiDonutData} options={kpiDonutOptions} />
                        </div>

                        <div className="kpi-row">
                            <div className="kpi-item"><span className="kpi-dot kpi-dot--mute" /><span className="kpi-name">{t('À faire')}</span><span className="kpi-count">{todo}</span></div>
                            <div className="kpi-item"><span className="kpi-dot kpi-dot--progress" /><span className="kpi-name">{t('En cours')}</span><span className="kpi-count">{inProgress}</span></div>
                            <div className="kpi-item"><span className="kpi-dot kpi-dot--review" /><span className="kpi-name">{t('Review')}</span><span className="kpi-count">{review}</span></div>
                            <div className="kpi-item"><span className="kpi-dot kpi-dot--done" /><span className="kpi-name">{t('Terminées')}</span><span className="kpi-count">{done}</span></div>
                        </div>
                    </OverviewCard>
                </div>

                <div id="graph-layout">
                    <OverviewCard title={t('Répartition des tâches')} icon="ti-chart-donut">
                        <div className="ov-donut-wrap">
                            <div className="ov-donut-canvas-wrap">
                                <Bar data={prioBarData} options={prioBarOptions} />
                            </div>
                            <div className="ov-donut-legend">
                                <span className="ov-legend-row"><span className="ov-legend-dot ov-legend-dot--done" /><span className="ov-legend-name">{t('Terminées')}</span><strong className="ov-legend-count">{done}</strong></span>
                                <span className="ov-legend-row"><span className="ov-legend-dot ov-legend-dot--todo" /><span className="ov-legend-name">{t('À faire')}</span><strong className="ov-legend-count">{todo}</strong></span>
                                <span className="ov-legend-row"><span className="ov-legend-dot ov-legend-dot--progress" /><span className="ov-legend-name">{t('En cours')}</span><strong className="ov-legend-count">{inProgress}</strong></span>
                                <span className="ov-legend-row"><span className="ov-legend-dot ov-legend-dot--late" /><span className="ov-legend-name">{t('En retard')}</span><strong className="ov-legend-count">{late}</strong></span>
                            </div>
                        </div>

                        <div className="ov-label mt-4">
                            <i className="ti ti-chart-bar" aria-hidden="true" />
                            {t('Charge par membre')}
                        </div>
                        <div className="ov-bar-wrap">
                            <Bar data={memberBarData} options={memberBarOptions} />
                        </div>
                    </OverviewCard>
                </div>

                <div id="ressource-layout">
                    <OverviewCard title={t('Ressources')} icon="ti-paperclip">
                        <ul className="res-list">
                            {ressources.length ? (
                                ressources.map((r, i) => <ResourceItem key={r.res_id || i} resource={r} />)
                            ) : (
                                <li className="res-empty">{t('Aucune ressource ajoutée.')}</li>
                            )}
                        </ul>
                    </OverviewCard>
                </div>

                <div id="sprint-layout">
                    <OverviewCard title={t('Sprints')} icon="ti-run">
                        <ul className="sp-list">
                            {sprintAvance.length ? (
                                sprintAvance.map((sp, i) => <SprintItem key={sp.sprint_id || i} sprint={sp} />)
                            ) : (
                                <li className="sp-empty">{t('Aucun sprint.')}</li>
                            )}
                        </ul>
                    </OverviewCard>
                </div>

                <div id="membre-layout">
                    <OverviewCard title={t('Membres')} className={"flex flex-col gap-3"} icon="ti-users">
                        <ul className="mb-list flex flex-col gap-4">
                            {members.map((member) => (
                                <MemberItem
                                    key={member.member_id}
                                    member={member}
                                />
                            ))}
                        </ul>
                    </OverviewCard>
                </div>
            </div>
        </div>
    );
}