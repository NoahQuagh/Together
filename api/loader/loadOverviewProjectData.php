<?php
try {
    header('Content-Type: application/json; charset=utf-8');

    require_once __DIR__ . '/../../db/connexion_together_db.php';
    require_once __DIR__ . '/../../includes/Session.php';
    Session::start();
    Session::requireLogin();

    $projectUuid = $_GET['project'] ?? null;
    if (!$projectUuid) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Paramètre pages manquant.']);
        exit;
    }

    $db = getDB();

    /*sprint key number*/
    $req = $db->prepare('
        SELECT
            COUNT(CASE WHEN s.spr_statut_id = 2 THEN 1 END) AS spr_actif,
            COUNT(CASE WHEN s.spr_statut_id = 3 THEN 1 END) AS spr_terminer
        FROM TOG_SPRINTS s
                 JOIN TOG_PROJECTS p ON s.spr_project_id = p.pro_id
        WHERE p.pro_uuid = ?
    ');
    $req->execute([$projectUuid]);
    $sprintKeyNum = $req->fetchAll();
    $formattedSprintKeyNum = array_map(function($p) {
        return [
            'nb_spr_actif'           => $p['spr_actif'],
            'nb_spr_terminer'           => $p['spr_terminer']
        ];
    }, $sprintKeyNum);

    /*tache key number*/
    $req = $db->prepare('
       SELECT
            COUNT(*) AS tas_total,
            COUNT(CASE WHEN t.tas_statut_id = 1 THEN 1 END) AS tas_wait,
            COUNT(CASE WHEN t.tas_statut_id = 2 THEN 1 END) AS tas_progress,
            COUNT(CASE WHEN t.tas_statut_id = 3 THEN 1 END) AS tas_review,
            COUNT(CASE WHEN t.tas_statut_id = 4 THEN 1 END) AS tas_terminer,
            COUNT(CASE WHEN t.tas_date_fin < NOW() AND t.tas_statut_id != 4 THEN 1 END) AS tas_late,
            COUNT(CASE WHEN t.tas_priorite_id = 1 THEN 1 END) AS tas_basse,
            COUNT(CASE WHEN t.tas_priorite_id = 2 THEN 1 END) AS tas_normale,
            COUNT(CASE WHEN t.tas_priorite_id = 3 THEN 1 END) AS tas_haute,
            COUNT(CASE WHEN t.tas_priorite_id = 4 THEN 1 END) AS tas_critique
        FROM TOG_TASKS t
                 JOIN TOG_PROJECTS p ON t.tas_project_id = p.pro_id
        WHERE p.pro_uuid = ?
    ');
    $req->execute([$projectUuid]);
    $tasksKeyNum = $req->fetchAll();
    $formattedTasksKeyNum = array_map(function($p) {
        return [
            'nb_tas_wait'           => $p['tas_wait'],
            'nb_tas_progress'           => $p['tas_progress'],
            'nb_tas_review'           => $p['tas_review'],
            'nb_tas_terminer'           => $p['tas_terminer'],
            'nb_tas_late'           => $p['tas_late'],
            'nb_tas_basse'           => $p['tas_basse'],
            'nb_tas_normale'           => $p['tas_normale'],
            'nb_tas_haute'           => $p['tas_haute'],
            'nb_tas_critique'           => $p['tas_critique']
        ];
    }, $tasksKeyNum);

    /*key number de statut tache par membre*/
    $req = $db->prepare("
        SELECT
            u.use_id as memberId,
            CONCAT(u.use_prenom, ' ', u.use_nom) AS membre,
            COUNT(CASE WHEN t.tas_statut_id = 1 THEN 1 END) AS a_faire,
            COUNT(CASE WHEN t.tas_statut_id = 2 THEN 1 END) AS en_cours,
            COUNT(CASE WHEN t.tas_statut_id = 3 THEN 1 END) AS en_revue,
            COUNT(CASE WHEN t.tas_statut_id = 4 THEN 1 END) AS terminer
        FROM TOG_PROJECT_MEMBERS pm
                 JOIN TOG_PROJECTS p ON pm.tpm_project_id = p.pro_id
                 JOIN TOG_USERS u ON pm.tpm_user_id = u.use_id
                 LEFT JOIN TOG_TASK_ASSIGNEES ta ON u.use_id = ta.tta_user_id
                 LEFT JOIN TOG_TASKS t ON ta.tta_task_id = t.tas_id AND t.tas_project_id = p.pro_id
        WHERE p.pro_uuid = ?
        GROUP BY u.use_id, u.use_prenom, u.use_nom
    ");
    $req->execute([$projectUuid]);
    $membersKeyNum = $req->fetchAll();
    $formattedMembersKeyNum = array_map(function($p) {
        return [
            'membreId'           => $p['memberId'],
            'membre'           => $p['membre'],
            'nb_a_faire'           => $p['a_faire'],
            'nb_en_cours'           => $p['en_cours'],
            'nb_en_revue'           => $p['en_revue'],
            'nb_terminer'           => $p['terminer'],
        ];
    }, $membersKeyNum);

    /*avancement sprint*/
    $req = $db->prepare("
        SELECT
            s.spr_id,
            s.spr_nom,
            COUNT(t.tas_id) AS total_taches,
            COUNT(CASE WHEN t.tas_statut_id = 4 THEN 1 END) AS taches_terminer
        FROM TOG_SPRINTS s
                 JOIN TOG_PROJECTS p ON s.spr_project_id = p.pro_id
                 LEFT JOIN TOG_TASKS t ON s.spr_id = t.tas_sprint_id
        WHERE p.pro_uuid = ?
        GROUP BY s.spr_id, s.spr_nom
    ");
    $req->execute([$projectUuid]);
    $sprintAvancement = $req->fetchAll();
    $formattedSprintAvancement = array_map(function($p) {
        return [
            'sprintId'           => $p['spr_id'],
            'sprint_nom'           => $p['spr_nom'],
            'totalTasks'           => $p['total_taches'],
            'tasks_terminer'           => $p['taches_terminer']
        ];
    }, $sprintAvancement);

    /*avancement sprint*/
    $req = $db->prepare("
        select res_nom,ttr_icon,res_link from TOG_PROJECT_RESSOURCES
            join TOG_PROJECTS on TOG_PROJECT_RESSOURCES.res_project_id = TOG_PROJECTS.pro_id
            join TOG_TYPE_RESSOURCE on TOG_PROJECT_RESSOURCES.res_type_id = TOG_TYPE_RESSOURCE.ttr_id
        where pro_uuid=?
    ");
    $req->execute([$projectUuid]);
    $ressource = $req->fetchAll();
    $formattedRessource = array_map(function($p) {
        return [
            'nom_ressource'           => $p['res_nom'],
            'icon_ressource'           => $p['ttr_icon'],
            'link'           => $p['res_link']
        ];
    }, $ressource);

    echo json_encode([
        'success' => true,
        'sprintKN'    => $formattedSprintKeyNum,
        'tasksKN'    => $formattedTasksKeyNum,
        'membersKN' => $formattedMembersKeyNum,
        'sprintAvance' => $formattedSprintAvancement,
        'ressourceList' => $formattedRessource
    ]);

} catch (\Throwable $e) {
    error_log("[Project Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des statistique et info du projets.']);
    exit();
}
?>


