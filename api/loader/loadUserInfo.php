<?php
try {
    header('Content-Type: application/json; charset=utf-8');

    require_once __DIR__ . '/../../db/connexion_together_db.php';
    require_once __DIR__ . '/../../includes/Session.php';

    $db = getDB();

    $req = $db->prepare('SELECT
    COALESCE(MAX(
                     CASE
                         WHEN TOG_TASKS.tas_date_fin < NOW() THEN 1
                         ELSE 0
                         END
             ), 0) AS late
FROM TOG_TASKS
         LEFT JOIN TOG_TASK_ASSIGNEES
                   ON TOG_TASKS.tas_id = TOG_TASK_ASSIGNEES.tta_task_id
         LEFT JOIN TOG_REF_STATUT_TACHE
                   ON TOG_TASKS.tas_statut_id = TOG_REF_STATUT_TACHE.rst_id
WHERE tta_user_id = ?
  AND rst_id != 4;');

    $req->execute([Session::id()]);

    // fetch() au lieu de fetchAll()
    $result = $req->fetch();

    echo json_encode([
        'success' => true,
        'data'    => [
            'userTasksLate' => (int) $result['late']
        ]
    ]);

} catch (\Throwable $e) {
    error_log("[User info Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des infos du compte.']);
    exit();
}
?>


