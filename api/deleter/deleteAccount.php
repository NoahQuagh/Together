<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../includes/Session.php';

$db = getDB();
try{
    $delete_user = $db->prepare("update TOG_USERS set use_mot_de_passe='0',use_role_id=3,use_email='Utilisateur supprimé' where use_id=?");
    $delete_user->execute([Session::id()]);
    Session::logout();
    echo json_encode(['success' => true, 'message' => 'Compte supprimé avec succès']);
} catch (PDOException $e) {
    error_log('[Archive User Error] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Impossible de supprimer le compte']);
}


