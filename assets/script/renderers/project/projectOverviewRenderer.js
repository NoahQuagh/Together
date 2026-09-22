function renderProjectOverview(data) {
    try {
        const content = document.getElementById('overview-zone');
        if (!content) return;

        const t = data.tasksKN?.[0] ?? {};
        const s = data.sprintKN?.[0] ?? {};
        const membersKN    = data.membersKN ?? [];
        const sprintAvance = data.sprintAvance ?? [];
        const ressources   = data.ressourceList ?? [];

        const todo       = Number(t.nb_tas_wait     ?? 0);
        const inProgress = Number(t.nb_tas_progress ?? 0);
        const review     = Number(t.nb_tas_review   ?? 0);
        const done       = Number(t.nb_tas_terminer ?? 0);
        const late       = Number(t.nb_tas_late     ?? 0);
        const total      = todo + inProgress + review + done;


        const sprintsDone  = Number(s.nb_spr_terminer ?? 0);
        const sprintsTotal = sprintAvance.length;

        const pctSprints = sprintsTotal ? Math.round(sprintsDone / sprintsTotal * 100) : 0;
        const pctTasks   = total ? Math.round(done / total * 100) : 0;
        const pctLate    = total ? Math.round(late / total * 100) : 0;

        const chargeLabels = membersKN.map(m => m.membre);
        const chargeDone   = membersKN.map(m => Number(m.nb_terminer  ?? 0));
        const chargeInProg = membersKN.map(m => Number(m.nb_en_cours  ?? 0));
        const chargeReview = membersKN.map(m => Number(m.nb_en_revue  ?? 0));
        const chargeTodo   = membersKN.map(m => Number(m.nb_a_faire   ?? 0));

        const prioBasse    = Number(t.nb_tas_basse   ?? 0);
        const prioNormale  = Number(t.nb_tas_normale ?? 0);
        const prioHaute    = Number(t.nb_tas_haute   ?? 0);
        const prioCritique = Number(t.nb_tas_critique ?? 0);


        function statutSprintFromPct(pct, totalTasks) {
            if (totalTasks === 0) return '<span class="sp-badge sp-badge--plan">Planifié</span>';
            if (pct === 100)      return '<span class="sp-badge sp-badge--done">Terminé</span>';
            return '<span class="sp-badge sp-badge--active">En cours</span>';
        }

        function sprintHtml(sp) {
            const totalTasks = Number(sp.totalTasks     ?? 0);
            const doneTasks  = Number(sp.tasks_terminer ?? 0);
            const pct        = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0;
            const modifier   = pct === 100 ? 'prog-bar--tasks' : 'prog-bar--sprint';

            return `<li class="sp-item-row">
                <div class="sp-head">
                    <span class="sp-name">${sp.sprint_nom}</span>
                    ${statutSprintFromPct(pct, totalTasks)}
                </div>
                <div class="prog-track"><div class="prog-bar ${modifier}" style="width:${pct}%"></div></div>
            </li>`;
        }

        function membreHtml(m) {
            // 1. Sécurisation du nom du membre
            const nomMembre = m.membre || 'Membre';

            // 2. Extrait les initiales sans risquer de plancher sur un élément vide
            const initiales = nomMembre
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map(p => p[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || '??';

            const totalMembre = Number(m.nb_a_faire ?? 0) + Number(m.nb_en_cours ?? 0)
                + Number(m.nb_en_revue ?? 0) + Number(m.nb_terminer ?? 0);

            return `<li class="mb-item">
                        <div class="mb-avatar">${initiales}</div>
                        <div class="mb-info">
                            <div class="mb-name">${nomMembre}</div>
                            <div class="mb-role">${totalMembre} tâche${totalMembre > 1 ? 's' : ''}</div>
                        </div>
                        <span class="mb-badge">${m.nb_terminer ?? 0} terminées</span>
                    </li>
            `;
        }

        function ressourceHtml(r) {
            const icon = r.icon_ressource ? r.icon_ressource.replace(/^ti\s+/, '') : 'ti-link';
            return `<li>
                        <a href="${r.link ?? '#'}" class="res-item" target="_blank" rel="noopener">
                            <i class="ti ti-${icon}" aria-hidden="true"></i>
                            <span class="res-name">${r.nom_ressource}</span>
                            <i class="ti ti-external-link res-ext" aria-hidden="true"></i>
                        </a>
                    </li>`;
        }

        content.innerHTML = `
            <!-- Avancement général -->
            <div id="avancer-layout">
                <div class="ov-card">
                    <div class="ov-label"><i class="ti ti-trending-up" aria-hidden="true"></i> Avancement général</div>
                    <div class="prog-row">
                        <div class="prog-head">
                            <span class="prog-title">Sprints terminés</span>
                            <span class="prog-val">${sprintsDone} / ${sprintsTotal}</span>
                        </div>
                        <div class="prog-track"><div class="prog-bar prog-bar--sprint" style="width:${pctSprints}%"></div></div>
                    </div>
                    <div class="prog-row">
                        <div class="prog-head">
                            <span class="prog-title">Tâches terminées</span>
                            <span class="prog-val">${done} / ${total}</span>
                        </div>
                        <div class="prog-track"><div class="prog-bar prog-bar--tasks" style="width:${pctTasks}%"></div></div>
                    </div>
                    <div class="prog-row">
                        <div class="prog-head">
                            <span class="prog-title">Tâches en retard</span>
                            <span class="prog-val prog-val--late">${late} / ${total}</span>
                        </div>
                        <div class="prog-track"><div class="prog-bar prog-bar--late" style="width:${pctLate}%"></div></div>
                    </div>
                </div>
            </div>
    
            <!-- KPI tâches -->
            <div id="totTache-layout">
                <div class="ov-card">
                    <div class="ov-label"><i class="ti ti-checklist" aria-hidden="true"></i> Statut des tâches</div>
                    
                    <div class="kpi-donut-container" style="position: relative; height: 160px; margin: 10px 0;">
                        <canvas id="kpi-statut-donut"></canvas>
                    </div>
            
                    <div class="kpi-row">
                        <div class="kpi-item"><span class="kpi-dot kpi-dot--mute"></span><span class="kpi-name">À faire</span><span class="kpi-count">${todo}</span></div>
                        <div class="kpi-item"><span class="kpi-dot kpi-dot--progress"></span><span class="kpi-name">En cours</span><span class="kpi-count">${inProgress}</span></div>
                        <div class="kpi-item"><span class="kpi-dot kpi-dot--review"></span><span class="kpi-name">Review</span><span class="kpi-count">${review}</span></div>
                        <div class="kpi-item"><span class="kpi-dot kpi-dot--done"></span><span class="kpi-name">Terminées</span><span class="kpi-count">${done}</span></div>
                    </div>
                </div>
            </div>
    
            <!-- Graphiques -->
            <div id="graph-layout">
                <div class="ov-card">
                    <div class="ov-label"><i class="ti ti-chart-donut" aria-hidden="true"></i> Répartition des tâches</div>
                    <div class="ov-donut-wrap">
                        <div class="ov-donut-canvas-wrap">
                            <canvas id="ov-donut" role="img" aria-label="Répartition des tâches par statut">${done} terminées, ${todo} à faire, ${inProgress} en cours, ${late} en retard.</canvas>
                        </div>
                        <div class="ov-donut-legend">
                            <span class="ov-legend-row"><span class="ov-legend-dot ov-legend-dot--done"></span><span class="ov-legend-name">Terminées</span><strong class="ov-legend-count">${done}</strong></span>
                            <span class="ov-legend-row"><span class="ov-legend-dot ov-legend-dot--todo"></span><span class="ov-legend-name">À faire</span><strong class="ov-legend-count">${todo}</strong></span>
                            <span class="ov-legend-row"><span class="ov-legend-dot ov-legend-dot--progress"></span><span class="ov-legend-name">En cours</span><strong class="ov-legend-count">${inProgress}</strong></span>
                            <span class="ov-legend-row"><span class="ov-legend-dot ov-legend-dot--late"></span><span class="ov-legend-name">En retard</span><strong class="ov-legend-count">${late}</strong></span>
                        </div>
                    </div>
                    <div class="ov-label"><i class="ti ti-chart-bar" aria-hidden="true"></i> Charge par membre</div>
                    <div class="ov-bar-wrap">
                        <canvas id="ov-bar" role="img" aria-label="Répartition des tâches par membre"></canvas>
                    </div>
                </div>
            </div>
    
            <!-- Ressources -->
            <div id="ressource-layout">
                <div class="ov-card">
                    <div class="ov-label"><i class="ti ti-paperclip" aria-hidden="true"></i> Ressources</div>
                    <ul class="res-list">${ressources.length ? ressources.map(ressourceHtml).join('') : '' +
                        '<li class="res-empty">Aucune ressource ajoutée.</li>'
                    }</ul>
                </div>
            </div>
    
            <!-- Sprints -->
            <div id="sprint-layout">
                <div class="ov-card">
                    <div class="ov-label"><i class="ti ti-run" aria-hidden="true"></i> Sprints</div>
                    <ul class="sp-list">${sprintAvance.length ? sprintAvance.map(sprintHtml).join('') : '<li class="sp-empty">Aucun sprint.</li>'}</ul>
                </div>
            </div>
    
            <!-- Membres -->
            <div id="membre-layout">
                <div class="ov-card">
                    <div class="ov-label"><i class="ti ti-users" aria-hidden="true"></i> Membres</div>
                    <ul class="mb-list">${membersKN.length ? membersKN.map(membreHtml).join('') : '<li class="mb-empty">Aucun membre.</li>'}</ul>
                </div>
            </div>
        `;

        if (typeof Chart === 'undefined') return;

        const oldDonut = Chart.getChart('ov-donut');
        if (oldDonut) oldDonut.destroy();

        const oldBar = Chart.getChart('ov-bar');
        if (oldBar) oldBar.destroy();


        const rootStyles = getComputedStyle(document.documentElement);
        const colGreen  = rootStyles.getPropertyValue('--badge-col-green').trim()  || '#1baf7a';
        const colBlue   = rootStyles.getPropertyValue('--badge-col-blue').trim()   || '#2a78d6';
        const colYellow = rootStyles.getPropertyValue('--badge-col-yellow').trim() || '#eda100';
        const colOrange = '#eb6834';
        const colRed    = rootStyles.getPropertyValue('--badge-col-red').trim()   || '#e34948';
        const colMuted  = rootStyles.getPropertyValue('--color-second-tertiary').trim() || '#7a7168';

        const donutCanvas = document.getElementById('ov-donut');
        if (donutCanvas) {
            const oldChart = Chart.getChart(donutCanvas);
            if (oldChart) oldChart.destroy();

            new Chart(donutCanvas, {
                type: 'bar',
                data: {
                    labels: ['Basse', 'Normale', 'Haute', 'Critique'],
                    datasets: [{
                        label: 'Nombre de tâches',
                        data: [prioBasse, prioNormale, prioHaute, prioCritique],
                        backgroundColor: [colBlue, colGreen, colYellow, colRed],
                        borderRadius: 4,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: { color: colMuted, font: { size: 11 } },
                            grid: { display: false },
                            border: { display: false }
                        },
                        y: {
                            ticks: { color: colMuted, font: { size: 11 }, stepSize: 1 },
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            border: { display: false }
                        }
                    }
                }
            });
        }

        const kpiDonutCanvas = document.getElementById('kpi-statut-donut');
        if (kpiDonutCanvas) {
            const oldKpiChart = Chart.getChart(kpiDonutCanvas);
            if (oldKpiChart) oldKpiChart.destroy();

            new Chart(kpiDonutCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['À faire', 'En cours', 'Review', 'Terminées'],
                    datasets: [{
                        data: [todo, inProgress, review, done,],
                        backgroundColor: [colMuted, colYellow, colOrange, colGreen],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        if (chargeLabels.length) {
            new Chart(document.getElementById('ov-bar'), {
                type: 'bar',
                data: {
                    labels: chargeLabels,
                    datasets: [
                        { label: 'Terminées', data: chargeDone,   backgroundColor: colGreen,  borderRadius: 3, stack: 's' },
                        { label: 'En cours',  data: chargeInProg, backgroundColor: colYellow, borderRadius: 3, stack: 's' },
                        { label: 'Review',    data: chargeReview, backgroundColor: colOrange, borderRadius: 3, stack: 's' },
                        { label: 'À faire',   data: chargeTodo,   backgroundColor: colBlue,   borderRadius: 3, stack: 's' },
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                    scales: {
                        x: { stacked: true, ticks: { color: colMuted, font: { size: 11 } }, grid: { display: false }, border: { display: false } },
                        y: { stacked: true, ticks: { color: colMuted, font: { size: 11 }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } }
                    }
                }
            });
        }

    } catch (err) {
        console.error("Erreur dans renderProjectOverview :", err);
    }
}