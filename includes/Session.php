<?php

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
            header('Location: /together/index.php');
            exit;
        }
    }

    public static function requireRole(string $role): void {
        self::requireLogin();
        if (self::get('role') !== $role) {
            header('Location: /together/index.php?error=acces_refuse');
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
}
