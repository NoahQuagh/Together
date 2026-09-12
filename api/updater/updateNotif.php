<?php

require_once __DIR__ . '/../../db/connexion_together_db.php';
require_once __DIR__ . '/../../includes/Session.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$notifEmail       = isset($input['notif_email'])       ? (int)$input['notif_email']       : 0;
$notifMention     = isset($input['notif_mention'])     ? (int)$input['notif_mention']     : 0;
$notifAssignation = isset($input['notif_assignation']) ? (int)$input['notif_assignation'] : 0;
$notifCommentaire = isset($input['notif_commentaire']) ? (int)$input['notif_commentaire'] : 0;

try {
    $db = getDB();

    $update = $db->prepare('
        UPDATE TOG_USER_PREFERENCES
        SET tup_notif_email = ?,
            tup_notif_mention = ?,
            tup_notif_assignation = ?,
            tup_notif_commentaire = ?
        WHERE tup_user_id = ?
    ');

    $update->execute([
        $notifEmail,
        $notifMention,
        $notifAssignation,
        $notifCommentaire,
        Session::id()
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Préférences de notifications mises à jour.'
    ]);

} catch (\Throwable $e) {
    error_log('[Update Preferences Error] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la sauvegarde.']);
}