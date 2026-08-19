<?php
$isLocal = ($_SERVER['SERVER_NAME'] ?? '') === 'localhost';

define('DB_HOST', '127.0.0.1');
define('DB_PORT', $isLocal ? '3306' : '3307');
define('DB_USER', 'together_admin');
define('DB_PASS', '2007,MAri');
define('DB_NAME', 'together');
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,  // requêtes préparées réelles
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log('[DB Error] ' . $e->getMessage());
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Impossible de se connecter à la base de données.'
        ]);
        exit;
    }

    return $pdo;
}
