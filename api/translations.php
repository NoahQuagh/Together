<?php
header('Content-Type: application/json');

$lang = $_GET['lang'] ?? 'fr';

$file = __DIR__ . "/lang/{$lang}.php";

if (file_exists($file)) {
    $translations = require $file;
    echo json_encode($translations);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Language not found']);
}