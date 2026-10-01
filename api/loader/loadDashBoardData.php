<?php
try {
    header('Content-Type: application/json; charset=utf-8');
    require_once __DIR__ . '/../../db/connexion_together_db.php';
    require_once __DIR__ . '/../../includes/Session.php';

    $db = getDB();

    $req1 = $db->prepare('
    SELECT t.tas_titre AS tache, rpr.rpr_label AS priorite, t.tas_date_fin AS deadline, p.pro_nom as projet,p.pro_uuid AS projet_uuid
FROM TOG_TASK_ASSIGNEES tta
         JOIN TOG_TASKS t        ON tta.tta_task_id      = t.tas_id
         JOIN TOG_PROJECTS p     ON t.tas_project_id     = p.pro_id
         JOIN TOG_REF_PRIORITE rpr ON t.tas_priorite_id  = rpr.rpr_id
WHERE tta.tta_user_id = ? AND t.tas_statut_id = 1
ORDER BY t.tas_priorite_id DESC
');

    $req2 = $db->prepare('
    SELECT t.tas_titre AS tache, rpr.rpr_label AS priorite, t.tas_date_fin AS deadline, p.pro_nom as projet,p.pro_uuid AS projet_uuid
    FROM TOG_TASK_ASSIGNEES tta
    JOIN TOG_TASKS t        ON tta.tta_task_id      = t.tas_id
    JOIN TOG_PROJECTS p     ON t.tas_project_id     = p.pro_id
    JOIN TOG_REF_PRIORITE rpr ON t.tas_priorite_id  = rpr.rpr_id
    WHERE tta.tta_user_id = ? and t.tas_statut_id between 1 and 2 AND t.tas_date_fin < NOW()
    ORDER BY t.tas_priorite_id DESC
');

    $req3 = $db->prepare('
    SELECT pro_nom AS nom, rrp_label AS role,pro_uuid as projet_uuid
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
    SELECT p.pro_uuid as uuid,p.pro_nom AS projet, l.act_description AS description_log, l.act_created_at AS cree_le
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

    $req8 = $db->prepare('
        SELECT
            COUNT(t.tas_id) AS nb_en_cour
        FROM TOG_USERS u
                 LEFT JOIN TOG_TASK_ASSIGNEES ta ON ta.tta_user_id = u.use_id
                 LEFT JOIN TOG_TASKS t ON t.tas_id = ta.tta_task_id AND t.tas_statut_id = 2
        where u.use_id=?
    ');


    $stat1 = $db->prepare('SELECT
    ROUND(COUNT(t.tas_id) / 4, 2) AS moyenne_a_faire_par_semaine
FROM TOG_USERS u
         JOIN TOG_TASK_ASSIGNEES ta ON ta.tta_user_id = u.use_id
         JOIN TOG_TASKS t ON t.tas_id = ta.tta_task_id
where u.use_id=? AND t.tas_statut_id = 1 AND ta.tta_assignee_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)');

    $stat2 = $db->prepare('SELECT
    ROUND(COUNT(t.tas_id) / 4, 2) AS moyenne_a_faire_par_semaine
FROM TOG_USERS u
         JOIN TOG_TASK_ASSIGNEES ta ON ta.tta_user_id = u.use_id
         JOIN TOG_TASKS t ON t.tas_id = ta.tta_task_id
where u.use_id=? AND t.tas_statut_id = 2 AND ta.tta_assignee_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)');

    $stat3 = $db->prepare("SELECT
    nvl(ROUND(
                       COUNT(CASE WHEN t.tas_date_fin < NOW() AND t.tas_statut_id = 1 or t.tas_statut_id = 2 THEN 1 END)
                           / NULLIF(COUNT(CASE WHEN t.tas_statut_id = 1 or t.tas_statut_id = 2 THEN 1 END), 0) * 100, 1
               ),0 ) AS taux_retard_pct
FROM TOG_USERS u
         LEFT JOIN TOG_TASK_ASSIGNEES ta ON ta.tta_user_id = u.use_id
         LEFT JOIN TOG_TASKS t ON t.tas_id = ta.tta_task_id
where u.use_id=?");

    $stat4 = $db->prepare("SELECT
    nvl(ROUND(
                       COUNT(CASE WHEN t.tas_statut_id = 4
                           AND DATE_FORMAT(t.tas_updated_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
                                      THEN 1 END)
                           / NULLIF(COUNT(CASE WHEN DATE_FORMAT(t.tas_date_fin, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
                                                   THEN 1 END), 0) * 100, 1
               ),0) AS taux_realisation_pct
FROM TOG_USERS u
         LEFT JOIN TOG_TASK_ASSIGNEES ta ON ta.tta_user_id = u.use_id
         LEFT JOIN TOG_TASKS t ON t.tas_id = ta.tta_task_id
where u.use_id=?");

    $stat5 = $db->prepare("SELECT
    COUNT(DISTINCT CASE WHEN DATE_FORMAT(pm.tpm_joined_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m') THEN p.pro_id END) AS nouveaux_ce_mois
FROM TOG_PROJECT_MEMBERS pm
         JOIN TOG_PROJECTS p ON pm.tpm_project_id = p.pro_id
WHERE pm.tpm_user_id = ? AND p.pro_statut_id = 1");



    $idUser = Session::id();

    $req1->execute([$idUser]);
    $req2->execute([$idUser]);
    $req3->execute([$idUser]);
    $req4->execute([$idUser]);
    $req5->execute([$idUser]);
    $req6->execute([$idUser]);
    $req7->execute([$idUser]);
    $req8->execute([$idUser]);

    $stat1->execute([$idUser]);
    $stat2->execute([$idUser]);
    $stat3->execute([$idUser]);
    $stat4->execute([$idUser]);
    $stat5->execute([$idUser]);



    echo json_encode([
        'success' => true,
        'data' => [
            'tasks_today'          => $req1->fetchAll(),
            'tasks_today_progress' => (float) $req8->fetchColumn(),
            'tasks_late'           => $req2->fetchAll(),
            'project_on'           => $req3->fetchAll(),
            'nb_done_month'        => (int) $req4->fetchColumn(),
            'activity_project'     => $req5->fetchAll(),
            'sprint'               => $req6->fetchAll(),
            'notification'         => $req7->fetchAll(),
            'stat_nb_faire'        => (float) $stat1->fetchColumn(),
            'stat_nb_en_cour'      => (float) $stat2->fetchColumn(),
            'stat_nb_retard'       => (float) $stat3->fetchColumn(),
            'taux_achevement'      => (float) $stat4->fetchColumn(),
            'stat_projet'          => (int) $stat5->fetchColumn()
        ]
    ]);
} catch (\Throwable $e) {
    error_log("[Dashboard Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération du tableau de bord.']);
}