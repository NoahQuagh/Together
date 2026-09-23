<?php
$isLocal = ($_SERVER['SERVER_NAME'] ?? '') === 'localhost';
//ssh -L 3307:127.0.0.1:3306 noah@servdell.noahquagh.com -N

define('DB_HOST', '127.0.0.1');
define('DB_PORT', $isLocal ? '3306' : '3307');
define('DB_USER', 'together_admin');
define('DB_PASS', '2007,MAri');
define('DB_NAME', 'together');
define('DB_CHARSET', 'utf8mb4');

/**
 * Retourne l'instance PDO active ou null en cas d'échec de connexion.
 *
 * @return PDO|null
 */
function getDB(): ?PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        try {
            $pdo->query('SELECT 1');
            return $pdo;
        } catch (PDOException $e) {
            $pdo = null;
        }
    }

    try {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 3,
        ];

        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

        return $pdo;
    } catch (PDOException $e) {
        error_log("Erreur de connexion DB : " . $e->getMessage());
        return null;
    }
}