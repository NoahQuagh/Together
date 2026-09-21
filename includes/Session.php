<?php
require_once __DIR__ . '/../db/connexion_together_db.php';
class Session {

    // DÉMARRAGE

    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    // CONNEXION / DÉCONNEXION

    public static function login(array $user): void {
        self::start();
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id'       => $user['id'],
            'nom'      => $user['nom'],
            'role'     => $user['role'],
            'lang'     => $user['lang'],
        ];
        $_SESSION['connecte'] = true;
        $_SESSION['login_at'] = time();
    }

    public static function logout(): void {
        self::start();
        $_SESSION = [];
        session_destroy();
    }

    // VÉRIFICATIONS

    public static function estConnecte(): bool {
        self::start();
        return isset($_SESSION['connecte']) && $_SESSION['connecte'] === true;
    }

    public static function requireLogin(): void {
        if (!self::estConnecte()) {
            header('Location: '.__DIR__.'/../auth/login.php');
            exit;
        }
    }

    public static function requireRole(string $role): void {
        self::requireLogin();
        if (self::get('role') !== $role) {
            header('Location: /together/pages.php?error=acces_refuse');
            exit;
        }
    }

    // GETTERS

    public static function user(): ?array {
        self::start();
        return $_SESSION['user'] ?? null;
    }

    public static function get(string $key): mixed {
        self::start();
        return $_SESSION['user'][$key] ?? null;
    }

    public static function id(): ?int {
        return self::get('id');
    }

    public static function nom(): ?string {
        return self::get('nom');
    }

    public static function role(): ?string {
        return self::get('role');
    }

    public static function init(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function Setlang(string $lang): void {
        self::init();
        $clean = preg_replace('/[^a-z]/', '', strtolower($lang));
        if (!empty($clean)) {
            $_SESSION['lang'] = $clean;
        }
    }

    public static function lang(): string {
        self::init();
        return $_SESSION['lang'] ?? 'fr';
    }

    // FLASH MESSAGES

    public static function setFlash(string $type, string $message): void {
        self::start();
        $_SESSION['flash'][$type] = $message;
    }

    public static function getFlash(string $type): ?string {
        self::start();
        if (isset($_SESSION['flash'][$type])) {
            $msg = $_SESSION['flash'][$type];
            unset($_SESSION['flash'][$type]);
            return $msg;
        }
        return null;
    }

    public static function hasFlash(string $type): bool {
        self::start();
        return isset($_SESSION['flash'][$type]);
    }

    public static function isProjectOwner(string $projectIdentifier): bool {
        $userId = self::id();
        $db = getDB();

        if (!$db) {
            self::handleDbError();
            return false;
        }

        if (!$userId) {
            return false;
        }
        try{
            $stmt = $db->prepare("SELECT pro_owner_id FROM TOG_PROJECTS WHERE pro_uuid = ?");
            $stmt->execute([$projectIdentifier]);

            return (bool) $stmt->fetchColumn();
        }catch (PDOException $e){
            return false;
        }


    }

    private static function handleDbError()
    {
        // Redirige vers une page d'erreur dédiée s'il n'y a pas déjà eu de rendu
        if (!headers_sent()) {
            header('Location: ../includes/error_db.php');
            exit;
        }

        // Sinon, affiche un message d'erreur
        die('
        <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #131313; color: #fff;">
            <h2>Service indisponible</h2>
            <p>Impossible de se connecter à la base de données pour le moment. Veuillez réessayer plus tard.</p>
        </div>
    ');
    }
}
