<?php
require_once __DIR__ . '/../../db/connexion_together_db.php';
require_once __DIR__ . '/../../includes/Session.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$input     = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$currentPW = trim($input['passW'] ?? '');
$newPW     = trim($input['newPassW'] ?? '');
$confirmPW = trim($input['confirmPassW'] ?? '');

$erreurs = [];

if (!$currentPW) $erreurs[] = 'Le mot de passe actuel est obligatoire.';
if (!$newPW)     $erreurs[] = 'Le nouveau mot de passe est obligatoire.';
if (!$confirmPW) $erreurs[] = 'La confirmation du nouveau mot de passe est obligatoire.';

if ($newPW && $confirmPW && $newPW !== $confirmPW) {
    $erreurs[] = 'Les nouveaux mots de passe ne correspondent pas.';
}

if ($newPW && strlen($newPW) < 8) {
    $erreurs[] = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
}

$db = getDB();

try {
    $req = $db->prepare('SELECT use_mot_de_passe FROM TOG_USERS WHERE use_id = ?');
    $req->execute([Session::id()]);
    $user = $req->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Utilisateur introuvable.']);
        exit;
    }

    if ($currentPW && !password_verify($currentPW, $user['use_password'])) {
        $erreurs[] = 'Le mot de passe actuel est incorrect.';
    }

    if (!empty($erreurs)) {
        echo json_encode([
            'success' => false,
            'message' => implode(' ', $erreurs)
        ]);
        exit;
    }

    $newHash = password_hash($newPW, PASSWORD_DEFAULT);

    $update = $db->prepare('
        UPDATE TOG_USERS
        SET use_mot_de_passe = ?
        WHERE use_id = ?
    ');
    $update->execute([$newHash, Session::id()]);

    echo json_encode([
        'success' => true,
        'message' => 'Votre mot de passe a été modifié avec succès.'
    ]);

} catch (\Throwable $e) {
    error_log('[Update Password Error] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la modification du mot de passe.'.$e]);
}