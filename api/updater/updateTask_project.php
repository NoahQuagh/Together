<?php
require_once __DIR__.'/../../db/connexion_together_db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$tkID         = trim($data['tk_id'] ?? '');
$tk_title     = trim($data['tk_title'] ?? '');
$tk_desc      = trim($data['tk_desc'] ?? '');
$tk_date_start= trim($data['tk_date_start'] ?? '');
$tk_date_end  = trim($data['tk_date_end'] ?? '');
$tk_prio      = trim($data['tk_prio'] ?? '');
$tk_status    = trim($data['tk_status'] ?? '');
$assignes     = $data['assignes'] ?? [];
$etiquettes   = $data['etiquettes'] ?? [];

if (empty($tkID) || empty($tk_title)) {
    echo json_encode(['success' => false, 'message' => 'Informations manquantes']);
    exit;
}

try {
    $pdo = getDB();
    $pdo->beginTransaction();

    $stmtUpdate = $pdo->prepare("UPDATE TOG_TASKS
        SET tas_titre = ?,
            tas_description = ?,
            tas_date_debut = ?,
            tas_date_fin = ?,
            tas_priorite_id = ?,
            tas_statut_id = ?
        WHERE tas_id = ?");

    $stmtUpdate->execute([
        $tk_title,
        $tk_desc,
        empty($tk_date_start) ? null : $tk_date_start,
        empty($tk_date_end) ? null : $tk_date_end,
        $tk_prio,
        $tk_status,
        $tkID
    ]);

    $stmtDeleteMembers = $pdo->prepare("DELETE FROM TOG_TASK_ASSIGNEES WHERE tta_task_id = ?");
    $stmtDeleteMembers->execute([$tkID]);

    if (!empty($assignes) && is_array($assignes)) {
        $stmtInsertMember = $pdo->prepare("INSERT INTO TOG_TASK_ASSIGNEES (tta_task_id, tta_user_id) VALUES (?, ?)");
        foreach ($assignes as $userId) {
            $userId = trim($userId);
            if (!empty($userId)) {
                $stmtInsertMember->execute([$tkID, $userId]);
            }
        }
    }

    $stmtDeleteLabels = $pdo->prepare("DELETE FROM TOG_TASK_ETIQUETTES WHERE tte_task_id = ?");
    $stmtDeleteLabels->execute([$tkID]);

    if (!empty($etiquettes) && is_array($etiquettes)) {
        $stmtInsertLabel = $pdo->prepare("INSERT INTO TOG_TASK_ETIQUETTES (tte_task_id, tte_eti_id) VALUES (?, ?)");
        foreach ($etiquettes as $etiId) {
            $etiId = trim($etiId);
            if (!empty($etiId)) {
                $stmtInsertLabel->execute([$tkID, $etiId]);
            }
        }
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Tâche mise à jour avec succès']);
    exit;

} catch (\Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("[Update Task Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de mise à jour de la tâche'.$e->getMessage()]);
}
