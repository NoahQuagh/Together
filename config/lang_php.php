<?php

$allowed_langs = ['fr', 'en'];
$default_lang  = 'fr';

if (isset($_GET['lang']) && in_array($_GET['lang'], $allowed_langs)) {
    $_SESSION['lang'] = $_GET['lang'];
}

if (!isset($_SESSION['lang'])) {
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

$translations = require __DIR__ . "/../lang/$current_lang.php";

function __tphp(string $key): string {
    global $translations;
    return $translations[$key] ?? $key;
}
