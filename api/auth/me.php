<?php
require_once __DIR__ . '/../../includes/Session.php';
Session::start();

header('Content-Type: application/json; charset=utf-8');

if (Session::estConnecte()) {
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $_SESSION['user_id'] ?? null,
            'nom' => $_SESSION['user_nom'] ?? '',
            'role'  => $_SESSION['use_role_id'],
            'lang'  => $_SESSION['use_lang'] ?? 'fr',
            'theme' => $_SESSION['tup_theme_id'] ?? '2'
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Non authentifié'
    ]);
}
