<?php
header('Content-Type: application/json; charset=utf-8');
try{
    require_once __DIR__ . '/../../includes/Session.php';
    require_once __DIR__ . '/../db.php';

    Session::init();
    $userId = Session::id();

    $input = json_decode(file_get_contents('php://input'), true);

    $langId = isset($input['langue_id']) ? (int) $input['langue_id'] : null;
    $langCode = isset($input['lang_code']) ? trim($input['lang_code']) : null;

    if (!$langId || !$langCode) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Paramètres manquants.']);
        exit();
    }

    $db = getDB();
    $stmt = $db->prepare('update TOG_USER_PREFERENCES set tup_langue=? where tup_user_id=?');
    $stmt->execute([$langId, $userId]);

    Session::Setlang($langCode);
    session_write_close();

    echo json_encode([
        'success' => true,
        'message' => 'Langue mises à jour avec succès.'
    ]);

}catch (\Throwable $e) {
    error_log("[Update Language Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour de la langue.']);
    exit();
}









if (isset($_GET['lang'])) {
    $lang = preg_replace('/[^a-z]/', '', strtolower($_GET['lang']));

    // Mise à jour de la langue en session

}
