<?php
try {
  require_once 'db.php';
  require_once '../includes/Session.php';

  $db = getDB();

  $req1 = $db->prepare('
    SELECT tas_titre AS tache, rpr_label AS priorite, tas_date_fin AS deadline, pro_nom AS projet
    FROM TOG_USERS u
    JOIN TOG_TASKS t  ON u.use_id = t.tas_assignee_id
    JOIN TOG_PROJECTS p ON t.tas_project_id = p.pro_id
    JOIN TOG_REF_PRIORITE rp ON t.tas_priorite_id = rp.rpr_id
    WHERE u.use_id = ? AND t.tas_statut_id = 1
    ORDER BY t.tas_priorite_id DESC
');

  $req2 = $db->prepare('
    SELECT tas_titre AS tache, rpr_label AS priorite, tas_date_fin AS deadline, pro_nom AS projet
    FROM TOG_USERS u
    JOIN TOG_TASKS t  ON u.use_id = t.tas_assignee_id
    JOIN TOG_PROJECTS p ON t.tas_project_id = p.pro_id
    JOIN TOG_REF_PRIORITE rp ON t.tas_priorite_id = rp.rpr_id
    WHERE u.use_id = ? AND t.tas_statut_id = 1 AND t.tas_date_fin < NOW()
    ORDER BY t.tas_priorite_id DESC
');

  $req3 = $db->prepare('
    SELECT pro_nom AS nom, rrp_label AS role
    FROM TOG_PROJECT_MEMBERS pm
    JOIN TOG_PROJECTS p ON pm.tpm_project_id = p.pro_id
    JOIN TOG_REF_ROLE_PROJET rp ON pm.tpm_role_id = rp.rrp_id
    WHERE pm.tpm_user_id = ? AND p.pro_statut_id = 1
');

  $req4 = $db->prepare('
    SELECT COUNT(*) AS nombre
    FROM TOG_ACTIVITY_LOG l
    JOIN TOG_USERS u ON l.act_user_id = u.use_id
    WHERE l.act_type_id = 3
    AND u.use_id = ?
    AND DATE_FORMAT(l.act_created_at, "%Y-%m") = DATE_FORMAT(NOW(), "%Y-%m")
');

  $req5 = $db->prepare('
    SELECT p.pro_nom AS projet, l.act_description AS description_log, l.act_created_at AS cree_le
    FROM TOG_PROJECTS p
    JOIN TOG_ACTIVITY_LOG l ON p.pro_id = l.act_project_id
    WHERE p.pro_owner_id = ?
    ORDER BY l.act_created_at DESC
    LIMIT 10
');

  $req6 = $db->prepare('
    SELECT p.pro_nom AS projet, s.spr_nom AS sprint, s.spr_date_fin AS deadline
    FROM TOG_SPRINTS s
    JOIN TOG_REF_STATUT_SPRINT rss ON s.spr_statut_id = rss.rss_id
    JOIN TOG_PROJECTS p            ON s.spr_project_id = p.pro_id
    JOIN TOG_PROJECT_MEMBERS tpm   ON tpm.tpm_project_id = p.pro_id
    WHERE rss.rss_id = 2
    AND tpm.tpm_user_id = ?
');

  $req7 = $db->prepare('
    SELECT not_message AS message, not_lien AS lien, not_created_at AS date
    FROM TOG_NOTIFICATIONS
    WHERE not_user_id = ? AND not_lu = 0
    ORDER BY not_created_at DESC
');

  $req1->execute([Session::id()]);
  $req2->execute([Session::id()]);
  $req3->execute([Session::id()]);
  $req4->execute([Session::id()]);
  $req5->execute([Session::id()]);
  $req6->execute([Session::id()]);
  $req7->execute([Session::id()]);

  $tasks_today = $req1->fetchAll();
  $tasks_late = $req2->fetchAll();
  $project_on = $req3->fetchAll();
  $nb_done_month = $req4->fetchColumn();
  $activity_project = $req5->fetchAll();
  $sprint = $req6->fetchAll();
  $notification = $req7->fetchAll();
}catch (\Throwable $e){
  error_log("[Dashboard Error] " . $e->getMessage());

  http_response_code(500);

  echo "Erreur interne du serveur.";
  exit();
}

function prioriteBadge(string $priorite): string {
    switch ($priorite) {
        case 'critique': return 'badge-red';
        case 'haute':    return 'badge-yellow';
        case 'normale':  return 'badge-blue';
        default:         return 'badge-green';
    }
}

function dateRelative(string $date): string {
    $diff = (new DateTime())->diff(new DateTime($date));
    if ($diff->days === 0) return 'Aujourd\'hui';
    if ($diff->days === 1) return 'Hier';
    return 'Il y a ' . $diff->days . ' jours';
}

?>
<div class="dash-layout">
<div class="dash-kpi-grid">

    <div class="dash-kpi-card">
        <div class="dash-kpi-icon dash-kpi-icon--blue">
            <i class="ti ti-checklist" aria-hidden="true"></i>
        </div>
        <div class="dash-kpi-info">
            <span class="dash-kpi-value"><?= count($tasks_today) ?></span>
            <span class="dash-kpi-label">Tâches à faire</span>
        </div>
    </div>

    <div class="dash-kpi-card">
        <div class="dash-kpi-icon dash-kpi-icon--red">
            <i class="ti ti-alert-triangle" aria-hidden="true"></i>
        </div>
        <div class="dash-kpi-info">
            <span class="dash-kpi-value"><?= count($tasks_late) ?></span>
            <span class="dash-kpi-label">Tâches en retard</span>
        </div>
    </div>

    <div class="dash-kpi-card">
        <div class="dash-kpi-icon dash-kpi-icon--green">
            <i class="ti ti-circle-check" aria-hidden="true"></i>
        </div>
        <div class="dash-kpi-info">
            <span class="dash-kpi-value"><?= $nb_done_month ?></span>
            <span class="dash-kpi-label">Terminées ce mois</span>
        </div>
    </div>

    <div class="dash-kpi-card">
        <div class="dash-kpi-icon dash-kpi-icon--yellow">
            <i class="ti ti-folder" aria-hidden="true"></i>
        </div>
        <div class="dash-kpi-info">
            <span class="dash-kpi-value"><?= count($project_on) ?></span>
            <span class="dash-kpi-label">Projets actifs</span>
        </div>
    </div>

</div>


<div class="dash-grid" id="tab">

    <div class="dash-block">
        <div class="dash-block-header bleu">
            <h3><i class="ti ti-checklist" aria-hidden="true"></i> Mes tâches</h3>
            <span class="dash-block-count"><?= count($tasks_today) ?></span>
        </div>

        <?php if (empty($tasks_today)): ?>
            <p class="dash-empty"><i class="ti ti-coffee"></i>Aucune tâche attribuée. C'est officiellement l'heure de la pause café.</p>
        <?php else: ?>
            <ul class="dash-task-list">
                <?php foreach ($tasks_today as $task): ?>
                    <li class="dash-task-item">
                        <div class="dash-task-top">
                            <span class="dash-task-titre"><?= htmlspecialchars($task['tache']) ?></span>
                            <span class="badge <?= prioriteBadge($task['priorite']) ?>">
                            <?= htmlspecialchars($task['priorite']) ?>
                        </span>
                        </div>
                        <div class="dash-task-meta">
                            <span><i class="ti ti-folder" aria-hidden="true"></i> <?= htmlspecialchars($task['projet']) ?></span>
                            <span><i class="ti ti-calendar" aria-hidden="true"></i> <?= htmlspecialchars(date('d/m/Y', strtotime($task['deadline']))) ?></span>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>

    <div class="dash-block">
        <div class="dash-block-header rouge">
            <h3><i class="ti ti-alert-triangle" aria-hidden="true"></i> En retard</h3>
            <span class="dash-block-count dash-block-count--red"><?= count($tasks_late) ?></span>
        </div>

        <?php if (empty($tasks_late)): ?>
            <p class="dash-empty"><i class="ti ti-confetti"></i>Youpi ! Aucune tâche en retard.</p>
        <?php else: ?>
            <ul class="dash-task-list">
                <?php foreach ($tasks_late as $task): ?>
                    <li class="dash-task-item dash-task-item--late">
                        <div class="dash-task-top">
                            <span class="dash-task-titre"><?= htmlspecialchars($task['tache']) ?></span>
                            <span class="badge <?= prioriteBadge($task['priorite']) ?>">
                            <?= htmlspecialchars($task['priorite']) ?>
                        </span>
                        </div>
                        <div class="dash-task-meta">
                            <span><i class="ti ti-folder" aria-hidden="true"></i> <?= htmlspecialchars($task['projet']) ?></span>
                            <span class="dash-late-date">
                            <i class="ti ti-clock" aria-hidden="true"></i>
                            Deadline : <?= htmlspecialchars(date('d/m/Y', strtotime($task['deadline']))) ?>
                        </span>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>

    <div class="dash-block">
        <div class="dash-block-header gris">
            <h3><i class="ti ti-run" aria-hidden="true"></i> Sprints en cours</h3>
            <span class="dash-block-count"><?= count($sprint) ?></span>
        </div>

        <?php if (empty($sprint)): ?>
            <p class="dash-empty">Aucun sprint actif en ce moment.</p>
        <?php else: ?>
            <ul class="dash-sprint-list">
                <?php foreach ($sprint as $s): ?>
                    <li class="dash-sprint-item">
                        <div class="dash-sprint-top">
                            <span class="dash-sprint-nom"><?= htmlspecialchars($s['sprint']) ?></span>
                        </div>
                        <div class="dash-task-meta">
                            <span><i class="ti ti-folder" aria-hidden="true"></i> <?= htmlspecialchars($s['projet']) ?></span>
                            <span><i class="ti ti-calendar" aria-hidden="true"></i> Fin : <?= htmlspecialchars(date('d/m/Y', strtotime($s['deadline']))) ?></span>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>

    <div class="dash-block">
        <div class="dash-block-header jaune">
            <h3><i class="ti ti-folder" aria-hidden="true"></i> Projets actifs</h3>
            <span class="dash-block-count"><?= count($project_on) ?></span>
        </div>

        <?php if (empty($project_on)): ?>
            <p class="dash-empty">Vous ne participez à aucun projet actif.</p>
        <?php else: ?>
            <ul class="dash-project-list">
                <?php foreach ($project_on as $proj): ?>
                    <li class="dash-project-item">
                        <span class="dash-project-nom"><?= htmlspecialchars($proj['nom']) ?></span>
                        <span class="badge badge-blue"><?= htmlspecialchars($proj['role']) ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>

    <div class="dash-block dash-block--full">
        <div class="dash-block-header vert">
            <h3><i class="ti ti-activity" aria-hidden="true"></i> Activité récente</h3>
        </div>

        <?php if (empty($activity_project)): ?>
            <p class="dash-empty">Aucune activité récente sur vos projets.</p>
        <?php else: ?>
            <ul class="dash-activity-list">
                <?php foreach ($activity_project as $act): ?>
                    <li class="dash-activity-item">
                        <span class="dash-activity-dot"></span>
                        <div class="dash-activity-content">
                            <span class="dash-activity-desc"><?= htmlspecialchars($act['description_log']) ?></span>
                            <div class="dash-task-meta">
                                <span><i class="ti ti-folder" aria-hidden="true"></i> <?= htmlspecialchars($act['projet']) ?></span>
                                <span><i class="ti ti-clock" aria-hidden="true"></i> <?= dateRelative($act['cree_le']) ?></span>
                            </div>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>
</div>
</div>