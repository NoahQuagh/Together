<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

require_once __DIR__ . '/../includes/Session.php';

$current_lang = Session::getLang();

$allowed_langs = ['fr', 'en'];
if (!in_array($current_lang, $allowed_langs)) {
  $current_lang = 'fr';
}

$file = __DIR__ . "/../lang/$current_lang.php";
$translations = file_exists($file) ? require $file : [];
?>

window.translations = <?= json_encode($translations, JSON_UNESCAPED_UNICODE); ?>;

function __t(key) {
if (window.translations && window.translations[key]) {
return window.translations[key];
}
return key;
}