<?php
try {
    header('Content-Type: application/json; charset=utf-8');
    require_once __DIR__ . '/../db.php';
    require_once __DIR__ . '/../../includes/Session.php';

    $db = getDB();

    $req1 = $db->prepare('
    SELECT t.tas_titre AS tache, rpr.rpr_label AS priorite, t.tas_date_fin AS deadline, p.pro_nom AS projet
    FROM TOG_TASK_ASSIGNEES tta
    JOIN TOG_TASKS t        ON tta.tta_task_id      = t.tas_id
    JOIN TOG_PROJECTS p     ON t.tas_project_id     = p.pro_id
    JOIN TOG_REF_PRIORITE rpr ON t.tas_priorite_id  = rpr.rpr_id
    WHERE tta.tta_user_id = ? AND t.tas_statut_id = 1
    ORDER BY t.tas_priorite_id DESC
');

    $req2 = $db->prepare('
    SELECT t.tas_titre AS tache, rpr.rpr_label AS priorite, t.tas_date_fin AS deadline, p.pro_nom AS projet
    FROM TOG_TASK_ASSIGNEES tta
    JOIN TOG_TASKS t        ON tta.tta_task_id      = t.tas_id
    JOIN TOG_PROJECTS p     ON t.tas_project_id     = p.pro_id
    JOIN TOG_REF_PRIORITE rpr ON t.tas_priorite_id  = rpr.rpr_id
    WHERE tta.tta_user_id = ? AND t.tas_statut_id = 1 AND t.tas_date_fin < NOW()
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

    echo json_encode([
        'success' => true,
        'data' => [
            'tasks_today'      => $req1->fetchAll(),
            'tasks_late'       => $req2->fetchAll(),
            'project_on'       => $req3->fetchAll(),
            'nb_done_month'    => (int) $req4->fetchColumn(),
            'activity_project' => $req5->fetchAll(),
            'sprint'           => $req6->fetchAll(),
            'notification'     => $req7->fetchAll()
        ]
    ]);
} catch (\Throwable $e) {
    error_log("[Dashboard Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération du tableau de bord.']);
}