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
    select concat(use_nom," ",use_prenom) as manager ,use_id,pro_nom,pro_description 
    from TOG_PROJECTS
    join TOG_USERS on TOG_PROJECTS.pro_owner_id = TOG_USERS.use_id where pro_uuid=?;');

    $project_info->execute([$projectId]);

    $proj = $project_info->fetch();

    if (!$proj) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Projet introuvable.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data'    => [
            'titre'       => $proj['pro_nom'],
            'manager'     => $proj['manager'],
            'description' => $proj['pro_description']
        ]
    ]);

} catch (\Throwable $e) {
    error_log("[Project Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur lors du chargement.']);
}


?>
