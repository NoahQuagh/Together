<?php
require_once __DIR__ . '/../../includes/Session.php';
Session::start();

ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

if (Session::estConnecte()) {
    echo json_encode([
        'success' => true,
        'user' => [
            'id'    => $_SESSION['user_id'] ?? null,
            'nom'   => $_SESSION['user_nom'] ?? '',
            'role'  => $_SESSION['role'] ?? 'user',
            'lang'  => $_SESSION['lang'] ?? 'fr',
            'theme' => $_SESSION['theme'] ?? '1'
        ]
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Non authentifié'
    ]);
}