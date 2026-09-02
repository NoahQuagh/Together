<?php
header('Content-Type: application/json; charset=utf-8');
try{
  require_once __DIR__ . '/../db.php';
  require_once __DIR__ . '/../../includes/Session.php';

  $db = getDB();

  $flash_succes = Session::hasFlash('succes_profil') ? Session::getFlash('succes_profil') : null;
  $flash_erreur = Session::hasFlash('erreur_profil') ? Session::getFlash('erreur_profil') : null;

  $req = $db->prepare('
    SELECT u.use_id, u.use_nom, u.use_prenom, u.use_email, u.use_created_at, r.rru_label AS role
    FROM TOG_USERS u
    JOIN TOG_REF_ROLE_USER r ON u.use_role_id = r.rru_id
    WHERE u.use_id = ?
');
  $req->execute([Session::id()]);
  $user = $req->fetch(PDO::FETCH_ASSOC);

  $userData = [
          'user_id'   => $user['use_id'],
          'nom'       => $user['use_nom'],
          'prenom'    => $user['use_prenom'],
          'email'     => $user['use_email'],
          'date_crea' => $user['use_created_at'],
          'role'      => $user['role']
  ];

  echo json_encode([
          'success' => true,
          'data'    => $userData
  ]);

}catch (\Throwable $e){
  error_log("[Profile Error] " . $e->getMessage());
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de votre profile.']);
  exit();
}
?>

