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
            'id'    => Session::get('id'),
            'nom'   => Session::get('nom'),
            'role'  => Session::get('role'),
            'lang'  => Session::get('lang'),
            'theme' => Session::get('theme'),
            'avatar' => Session::get('avatar'),
        ]
    ], JSON_UNESCAPED_UNICODE);

} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Non authentifié'
    ]);
}