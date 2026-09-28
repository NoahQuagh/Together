<?php
try {
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Content-Type: application/json; charset=UTF-8");

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
  }

  session_start();

  require_once __DIR__ . '/../../db/connexion_together_db.php';
  require_once __DIR__ . '/../../includes/Session.php';

  $db = getDB();

  $req = $db->prepare('
        SELECT p.pro_id,p.pro_uuid, p.pro_nom, p.pro_description, p.pro_date_debut, p.pro_date_fin,
               sp.rsp_id AS statut_id, sp.rsp_label AS statut_label
        FROM TOG_PROJECTS p
        JOIN TOG_REF_STATUT_PROJET sp ON p.pro_statut_id = sp.rsp_id
        WHERE p.pro_owner_id = ?
        and p.pro_statut_id !=4
        ORDER BY p.pro_date_fin asc
    ');

  $req->execute([Session::id()]);

  $projects = $req->fetchAll();

  $formattedProjects = array_map(function($p) {
    return [
            'project_id'           => $p['pro_id'],
            'project_uuid'         => $p['pro_uuid'],
            'project_nom'          => $p['pro_nom'],
            'project_description'  => $p['pro_description'],
            'project_debut'        => $p['pro_date_debut'],
            'project_fin'          => $p['pro_date_fin'],
            'project_statut_id'    => $p['statut_id'],
            'project_statut_label' => $p['statut_label']
    ];
  }, $projects);

  echo json_encode([
          'success' => true,
          'data'    => $formattedProjects
  ]);

} catch (\Throwable $e) {
  error_log("[Project Error] " . $e->getMessage());
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de vos projets.'.$e]);
  exit();
}
?>

