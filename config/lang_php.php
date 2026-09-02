<?php

$allowed_langs = ['fr', 'en'];
$default_lang  = 'fr';

// Démarrage de session de sécurité
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Si la langue n'est pas encore définie en session, détection navigateur
if (empty($_SESSION['lang'])) {
    $userBrowserLang = $default_lang;

    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $browserLang = strtolower(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2));
        if (in_array($browserLang, $allowed_langs)) {
            $userBrowserLang = $browserLang;
        }
    }

    $_SESSION['lang'] = $userBrowserLang;
}

$current_lang = $_SESSION['lang'];

// Vérification de sécurité
if (!in_array($current_lang, $allowed_langs)) {
    $current_lang = $default_lang;
}

// Chargement des traductions
$langFilePath = __DIR__ . "/../lang/$current_lang.php";
$translations = file_exists($langFilePath) ? require $langFilePath : [];

/**
 * Fonction de traduction PHP
 */
function __tphp(string $key): string {
    global $translations;
    return $translations[$key] ?? $key;
}