<?php
header('Content-Type: application/json; charset=utf-8');
try {
    require_once __DIR__ . '/../../db/connexion_together_db.php';
    require_once __DIR__ . '/../../includes/Session.php';

    $db = getDB();

    $req = $db->prepare("select pro_nom,pro_uuid,COALESCE(spr_nom,'Aucun sprint rataché à la tâche') as sprint,concat(use_prenom,' ',use_nom) as reporter,tas_titre,tas_description,rst_label as statut,rpr_label as priorite,tas_date_debut,tas_date_fin
from TOG_TASKS
         left join TOG_TASK_ASSIGNEES
                   on TOG_TASKS.tas_id = TOG_TASK_ASSIGNEES.tta_task_id
         left join TOG_PROJECTS
                   on TOG_TASKS.tas_project_id = TOG_PROJECTS.pro_id
         left join TOG_USERS
                   on TOG_TASKS.tas_reporter_id = TOG_USERS.use_id
         left join TOG_SPRINTS
                   on TOG_TASKS.tas_sprint_id = TOG_SPRINTS.spr_id
         left join TOG_REF_PRIORITE
                   on TOG_TASKS.tas_priorite_id = TOG_REF_PRIORITE.rpr_id
         left join TOG_REF_STATUT_TACHE
                   on TOG_TASKS.tas_statut_id = TOG_REF_STATUT_TACHE.rst_id
where tta_user_id=? and rst_id != 4
");

    $req->execute([Session::id()]);

    $projects = $req->fetchAll();

    $formattedTasks = array_map(function($p) {
        return [
            'projet_nom'           => $p['pro_nom'],
            'projet_uuid'           => $p['pro_uuid'],
            'sprint_nom'           => $p['sprint'],
            'reporter'           => $p['reporter'],
            'titre_tache'           => $p['tas_titre'],
            'desc_tache'           => $p['tas_description'],
            'statut'           => $p['statut'],
            'prio'           => $p['priorite'],
            'date_debut'           => $p['tas_date_debut'],
            'date_fin'           => $p['tas_date_fin'],
        ];
    }, $projects);

    echo json_encode([
        'success' => true,
        'data'    => $formattedTasks
    ]);

} catch (\Throwable $e) {
    error_log("[Tasks Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de vos taches.']);
    exit();
}
?>


