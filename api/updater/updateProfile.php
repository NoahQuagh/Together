<?php
require_once __DIR__ . '/../../db/connexion_together_db.php';
require_once __DIR__ . '/../../includes/Session.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$input  = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$prenom = trim($input['prenom'] ?? '');
$nom    =trim($input['nom'] ?? '');
$email  = trim($input['email'] ?? '');

$erreurs = [];

if (!$prenom) $erreurs[] = 'Le prénom est obligatoire.';
if (!$nom) $erreurs[] = 'Le nom est obligatoire.';
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs[] = 'Adresse e-mail invalide.';
}

$db = getDB();

$reqCheck = $db->prepare('SELECT use_id FROM TOG_USERS WHERE use_email = ? AND use_id != ?');
$reqCheck->execute([$email, Session::id()]);

if ($reqCheck->fetch()) {
    $erreurs[] = 'Adresse e-mail invalide, réessayer';
}

if (!empty($erreurs)) {
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $erreurs)
    ]);
    exit;
}

try {
    $update = $db->prepare('
        UPDATE TOG_USERS
        SET use_prenom = ?, use_nom = ?, use_email = ?
        WHERE use_id = ?
    ');
    $update->execute([$prenom, $nom, $email, Session::id()]);

    Session::login([
        'id'   => Session::id(),
        'nom'  => $nom,
        'role' => Session::role(),
        'lang' => Session::lang()
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Vos informations ont été mises à jour avec succès.'
    ]);
} catch (\Throwable $e) {
    error_log('[Update Profile Error] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la mise à jour.']);
}