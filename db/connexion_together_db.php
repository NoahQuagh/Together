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


    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

    return $pdo;
}
