<?php
header('Content-Type: application/json; charset=utf-8');
try{
    require_once __DIR__ . '/../db.php';
    require_once __DIR__ . '/../../includes/Session.php';
    Session::start();
    Session::requireLogin();
    $projectId  = $_GET['project'] ?? null;

    $db=getDB();

    $project_info = $db->prepare('
    select pro_id,concat(use_nom," ",use_prenom) as manager ,use_id,pro_nom,pro_description 
    from TOG_PROJECTS
    join TOG_USERS on TOG_PROJECTS.pro_owner_id = TOG_USERS.use_id where pro_uuid=?');

    $project_tasks = $db->prepare('select tas_sprint_id,concat(a.use_prenom," ",a.use_nom) as assigner,concat(r.use_prenom," ",r.use_nom) as reporter,tas_titre,tas_description,rst_label as statut,
       rpr_label as priorite,tas_date_debut as date_debut,tas_date_fin as date_fin from TOG_TASKS
           join TOG_USERS a on TOG_TASKS.tas_assignee_id = a.use_id
           join TOG_USERS r on TOG_TASKS.tas_reporter_id = r.use_id
           join TOG_REF_STATUT_TACHE on TOG_TASKS.tas_statut_id = TOG_REF_STATUT_TACHE.rst_id
           join TOG_REF_PRIORITE on TOG_TASKS.tas_priorite_id = TOG_REF_PRIORITE.rpr_id
where tas_project_id=?');

    $project_info->execute([$projectId]);
    $proj = $project_info->fetch();

    if (!$proj) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Projet introuvable.']);
        exit;
    }

    $project_id=$proj['pro_id'];

    $project_tasks->execute([$project_id]);
    $task = $project_tasks->fetchAll();

    $formattedTasks = array_map(function($t) {
        return [
            'sprint_id'           => $t['tas_sprint_id'],
            'assigner'           => $t['assigner'],
            'reporter'           => $t['reporter'],
            'titre'           => $t['tas_titre'],
            'desc'           => $t['tas_description'],
            'statut'           => $t['statut'],
            'priorite'           => $t['priorite'],
            'date_debut'           => $t['date_debut'],
            'date_fin'           => $t['date_fin'],

        ];
    }, $task);

    echo json_encode([
        'success' => true,
        'data'    => [
            'titre'       => $proj['pro_nom'],
            'manager'     => $proj['manager'],
            'description' => $proj['pro_description'],
            'tasks'       => $formattedTasks
        ]
    ]);

} catch (\Throwable $e) {
    error_log("[Project Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur lors du chargement.'.$e]);
}


?>
