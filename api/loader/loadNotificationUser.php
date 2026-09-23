<?php
try {
    header('Content-Type: application/json; charset=utf-8');

    require_once __DIR__ . '/../../db/connexion_together_db.php';
    require_once __DIR__ . '/../../includes/Session.php';

    $db = getDB();

    $req = $db->prepare("
        select not_user_id,concat(use_prenom,' ',use_nom) as origine,rtn_label,ton_label,not_nom_objet,not_lien,not_lu,not_created_at from TOG_NOTIFICATIONS
        join TOG_REF_TYPE_NOTIF on TOG_NOTIFICATIONS.not_type_id = TOG_REF_TYPE_NOTIF.rtn_id
        join TOG_TYPE_OBJ_NOTIF on TOG_NOTIFICATIONS.not_objet_id = TOG_TYPE_OBJ_NOTIF.ton_id
        join TOG_USERS on TOG_NOTIFICATIONS.not_user_origin_id = TOG_USERS.use_id
        where not_user_id=?
    ");

    $req->execute([Session::id()]);

    $notif = $req->fetchAll();

    $formattedNotif = array_map(function($p) {
        return [
            'userOrigin'           => $p['origine'],
            'typeAction'           => $p['rtn_label'],
            'objetAction'           => $p['ton_label'],
            'nomObjet'           => $p['not_nom_objet'],
            'lien'           => $p['not_lien'],
            'lu'           => $p['not_lu'],
            'dataCrea'           => $p['not_created_at'],
        ];
    }, $notif);

    echo json_encode([
        'success' => true,
        'data'    => $formattedNotif
    ]);

} catch (\Throwable $e) {
    error_log("[Notification Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de vos notifications.']);
    exit();
}
?>



