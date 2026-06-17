<?php
require_once 'db.php';
require_once '../includes/Session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$proId  = isset($data['pro_id'])  ? (int)$data['pro_id'] : 0;
$statut = isset($data['statut'])  ? trim($data['statut']) : '';

$statutsValides = ['actif', 'pause', 'termine'];

if (!$proId || !in_array($statut, $statutsValides)) {
    echo json_encode(['success' => false, 'message' => 'Données invalides.']);
    exit;
}

$db = getDB();

$check = $db->prepare('SELECT pro_id FROM TOG_PROJECTS WHERE pro_id = ? AND pro_owner_id = ?');
$check->execute([$proId, Session::id()]);

if (!$check->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Projet introuvable ou accès refusé.']);
    exit;
}

$refStatut = $db->prepare('SELECT rsp_id FROM TOG_REF_STATUT_PROJET WHERE rsp_label = ?');
$refStatut->execute([$statut]);
$row = $refStatut->fetch();

if (!$row) {
    echo json_encode(['success' => false, 'message' => 'Statut inconnu.']);
    exit;
}

$update = $db->prepare('UPDATE TOG_PROJECTS SET pro_statut_id = ? WHERE pro_id = ?');
$update->execute([$row['rsp_id'], $proId]);

echo json_encode(['success' => true]);
