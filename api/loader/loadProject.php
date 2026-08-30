<?php
header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/../db.php';
    require_once __DIR__ . '/../../includes/Session.php';
    Session::start();
    Session::requireLogin();

    $projectUuid = $_GET['project'] ?? null;
    if (!$projectUuid) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Paramètre project manquant.']);
        exit;
    }

    $db = getDB();

    $stmtInfo = $db->prepare('
        SELECT pro_id,
               pro_nom,
               pro_description,
               CONCAT(use_prenom, " ", use_nom) AS manager,
               use_id                           AS manager_id
        FROM TOG_PROJECTS
        JOIN TOG_USERS ON TOG_PROJECTS.pro_owner_id = TOG_USERS.use_id
        WHERE pro_uuid = ?
    ');
    $stmtInfo->execute([$projectUuid]);
    $proj = $stmtInfo->fetch();

    if (!$proj) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Projet introuvable.']);
        exit;
    }

    $projectId = (int) $proj['pro_id'];

    $stmtTasks = $db->prepare('
        SELECT t.tas_id,
               t.tas_sprint_id,
               CONCAT(r.use_prenom, " ", r.use_nom) AS reporter,
               t.tas_titre,
               t.tas_description,
               rst.rst_label                         AS statut,
               rpr.rpr_label                         AS priorite,
               t.tas_date_debut                      AS date_debut,
               t.tas_date_fin                        AS date_fin,
               t.tas_color                           AS couleur
        FROM TOG_TASKS t
        JOIN TOG_USERS r              ON t.tas_reporter_id  = r.use_id
        JOIN TOG_REF_STATUT_TACHE rst ON t.tas_statut_id    = rst.rst_id
        JOIN TOG_REF_PRIORITE rpr     ON t.tas_priorite_id  = rpr.rpr_id
        WHERE t.tas_project_id = ?
        ORDER BY t.tas_priorite_id DESC, t.tas_date_fin ASC
    ');
    $stmtTasks->execute([$projectId]);
    $tasks = $stmtTasks->fetchAll();

    if (empty($tasks)) {
        echo json_encode([
            'success' => true,
            'data'    => [
                'titre'       => $proj['pro_nom'],
                'manager'     => $proj['manager'],
                'manager_id'  => $proj['manager_id'],
                'description' => $proj['pro_description'],
                'tasks'       => []
            ]
        ]);
        exit;
    }

    $taskIds = array_column($tasks, 'tas_id');
    $inParams = implode(',', array_fill(0, count($taskIds), '?'));

    $stmtAssignees = $db->prepare("
        SELECT tta.tta_task_id                         AS task_id,
               u.use_id                               AS id,
               CONCAT(u.use_prenom, ' ', u.use_nom)   AS nom
        FROM TOG_TASK_ASSIGNEES tta
        JOIN TOG_USERS u ON tta.tta_user_id = u.use_id
        WHERE tta.tta_task_id IN ($inParams)
    ");
    $stmtAssignees->execute($taskIds);
    $assigneesRaw = $stmtAssignees->fetchAll();

    $assigneesByTask = [];
    foreach ($assigneesRaw as $row) {
        $assigneesByTask[$row['task_id']][] = [
            'id'  => $row['id'],
            'nom' => $row['nom'],
        ];
    }

    $stmtEti = $db->prepare("
        SELECT tte.tte_task_id,
               e.eti_id,
               e.eti_label,
               e.eti_couleur
        FROM TOG_TASK_ETIQUETTES tte
        JOIN TOG_ETIQUETTES e ON tte.tte_eti_id = e.eti_id
        WHERE tte.tte_task_id IN ($inParams)
    ");
    $stmtEti->execute($taskIds);
    $etiquettesRaw = $stmtEti->fetchAll();

    /* Indexer par task_id → tableau d'étiquettes */
    $etiquettesByTask = [];
    foreach ($etiquettesRaw as $row) {
        $etiquettesByTask[$row['tte_task_id']][] = [
            'id'      => $row['eti_id'],
            'label'   => $row['eti_label'],
            'couleur' => $row['eti_couleur'],
        ];
    }

    $formattedTasks = array_map(function ($t) use ($assigneesByTask, $etiquettesByTask) {
        $id = $t['tas_id'];
        return [
            'id'         => $id,
            'sprint_id'  => $t['tas_sprint_id'],
            'reporter'   => $t['reporter'],
            'assignes'   => $assigneesByTask[$id]   ?? [],
            'etiquettes' => $etiquettesByTask[$id]  ?? [],
            'titre'      => $t['tas_titre'],
            'desc'       => $t['tas_description'],
            'statut'     => $t['statut'],
            'priorite'   => $t['priorite'],
            'date_debut' => $t['date_debut'],
            'date_fin'   => $t['date_fin'],
            'couleur'    => $t['couleur'],
        ];
    }, $tasks);

    echo json_encode([
        'success' => true,
        'data'    => [
            'titre'       => $proj['pro_nom'],
            'manager'     => $proj['manager'],
            'manager_id'  => $proj['manager_id'],
            'description' => $proj['pro_description'],
            'tasks'       => $formattedTasks
        ]
    ]);

} catch (\Throwable $e) {
    error_log('[loadProject Error] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}