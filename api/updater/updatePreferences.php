<?php
session_start();
require_once __DIR__.'/../../db/connexion_together_db.php';
require_once __DIR__.'/../../includes/Session.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$inputData = json_decode(file_get_contents('php://input'), true);
$theme = trim($inputData['theme'] ?? $_POST['theme'] ?? '');
$accent = trim($inputData['accent_color'] ?? $_POST['accent_color'] ?? '');
$tkAlert = trim($inputData['tasks_alert'] ?? $_POST['tasks_alert'] ?? '');

if (empty($theme)) {
    echo json_encode(['success' => false, 'message' => 'Theme manquant']);
    exit;
}

try {
    $pdo = getDB();

    $stmt = $pdo->prepare("UPDATE TOG_USER_PREFERENCES SET tup_theme_id = ?,tup_accent_color =?,tup_tasks_alert=? WHERE tup_user_id = ?");
    $stmt->execute([$theme,$accent,$tkAlert, Session::id()]);

    echo json_encode(['success' => true, 'message' => 'Mise à jour du thème réussie']);
    exit;

} catch (\Throwable $e) {
    error_log("[Update Theme Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de mise à jour du thème'.$e]);
}