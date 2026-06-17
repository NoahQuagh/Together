<?php
require_once 'db.php';
require_once '../includes/Session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$data  = json_decode(file_get_contents('php://input'), true);
$proId = isset($data['pro_id']) ? (int)$data['pro_id'] : 0;

if (!$proId) {
    echo json_encode(['success' => false, 'message' => 'ID invalide.']);
    exit;
}

$db = getDB();

$check = $db->prepare('SELECT pro_id FROM TOG_PROJECTS WHERE pro_id = ? AND pro_owner_id = ?');
$check->execute([$proId, Session::id()]);

if (!$check->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Projet introuvable ou accès refusé.']);
    exit;
}


$delete = $db->prepare('UPDATE TOG_PROJECTS SET pro_statut_id = 4 WHERE pro_id = ?');
$delete->execute([Session::id()]);

echo json_encode(['success' => true]);