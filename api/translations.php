<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$lang = $_GET['lang'] ?? 'fr';

$file = __DIR__ . "/../lang/{$lang}.php";

if (file_exists($file)) {
    $translations = require $file;
    echo json_encode($translations);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Language not found']);
}