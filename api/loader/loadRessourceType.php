<?php
header('Content-Type: application/json; charset=utf-8');
try {
    require_once __DIR__ . '/../../db/connexion_together_db.php';

    $db = getDB();

    $req = $db->prepare("select ttr_id,ttr_nom,ttr_icon from TOG_TYPE_RESSOURCE");

    $req->execute();

    $ressourceType = $req->fetchAll();

    $formattedRessource = array_map(function($p) {
        return [
            'typeResId'           => $p['ttr_id'],
            'typeResNom'           => $p['ttr_nom'],
            'typeResIcon'           => $p['ttr_icon']
        ];
    }, $ressourceType);

    echo json_encode([
        'success' => true,
        'data'    => $formattedRessource
    ]);

} catch (\Throwable $e) {
    error_log("[Ressource Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des types de ressources.']);
    exit();
}
?>


