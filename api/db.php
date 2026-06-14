<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'together');
define('DB_USER', 'together_admin');
define('DB_PASS', '2007,MAri');

function getDB(): PDO {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,  // requêtes préparées réelles
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log('[DB] Connexion échouée : ' . $e->getMessage());
        http_response_code(500);
        exit('Erreur de connexion à la base de données.'.$e->getMessage());
    }

    return $pdo;
}
