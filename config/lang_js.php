<?php
header('Content-Type: application/javascript; charset=utf-8');
require_once __DIR__ . '/../includes/Session.php';
session_start();


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

/*
 *utilisation vue html php
 *<?= __t('save') ?>
 *
 *selecteur html
 *<div class="lang-switcher">
    <a href="?lang=fr" class="<?= $current_lang === 'fr' ? 'active' : '' ?>">FR</a> |
    <a href="?lang=en" class="<?= $current_lang === 'en' ? 'active' : '' ?>">EN</a>
</div>
 *
 * */
?>

window.translations = <?= json_encode($translations ?? [], JSON_UNESCAPED_UNICODE); ?>;

function __t(key) {
return window.translations[key] || key;
}
