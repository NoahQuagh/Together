<?php
header('Content-Type: application/json; charset=utf-8');
try{
    require_once __DIR__ . '/../db.php';

    $db = getDB();

    $req = $db->prepare('select lang_id,lang_code,lang_label from TOG_LANGUE');
    $req->execute();
    $lang = $req->fetchAll();

    $formattedLang = array_map(function($p) {
        return [
            'lang_id'           => $p['lang_id'],
            'lang'         => $p['lang_code'],
            'lang_label'         => $p['lang_label'],
        ];
    }, $lang);

    echo json_encode([
        'success' => true,
        'data'    => $formattedLang
    ]);

}catch (\Throwable $e) {
    error_log("[Langue Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de la liste des langues.']);
    exit();
}





