<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/../../db/connexion_together_db.php';

$email = trim($_GET['email'] ?? $_POST['email'] ?? '');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['exists' => false, 'error' => 'invalid_email']);
    exit;
}

try {
    $pdo= getDB();
    $stmt = $pdo->prepare('SELECT use_id,use_email FROM TOG_USERS WHERE use_email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            'exists'  => true,
            'user_id' => $user['use_id'],
        ]);
    } else {
        echo json_encode([
            'exists'  => false,
            'message' => "Cet utilisateur n'a pas de compte",
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['exists' => false, 'error' => 'server_error']);
}