<?php
header('Content-Type: application/json; charset=utf-8');
try{
    require_once __DIR__ . '/../db.php';

    $db = getDB();

    $req = $db->prepare('select rth_id,rth_label from TOG_REF_THEME');
    $req->execute();
    $theme = $req->fetchAll();

    $formattedTheme = array_map(function($p) {
        return [
            'theme_id'           => $p['rth_id'],
            'theme'         => $p['rth_label'],
        ];
    }, $theme);

    echo json_encode([
        'success' => true,
        'data'    => $formattedTheme
    ]);

}catch (\Throwable $e) {
    error_log("[Theme Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de la liste des themes.']);
    exit();
}




