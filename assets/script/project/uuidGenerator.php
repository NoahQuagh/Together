<?php
header('Content-Type: application/json; charset=utf-8');
if (!function_exists('generateUuidV4')) {
    function generateUuidV4(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

$newProjectUuid = generateUuidV4();
$isLocalhost = (
    $_SERVER['HTTP_HOST'] === 'localhost' ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false ||
    strpos($_SERVER['HTTP_HOST'], 'localhost:') !== false
);

$basePath = $isLocalhost ? '/together' : '';
$scheme   = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";

$newProjectLink = $scheme . "://" . $_SERVER['HTTP_HOST'] . $basePath . '/app/project.php?key=' . $newProjectUuid;

echo json_encode([
    'exists'  => true,
    'pro_uuid' => $newProjectUuid ?? '',
    'pro_path' => $newProjectLink ?? 'Lien indisponible'
]);
?>
