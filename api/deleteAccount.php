<?php

require_once 'db.php';
require_once '../includes/Session.php';

$db = getDB();

$delete = $db->prepare("update TOG_USERS set use_mot_de_passe='0' where use_id=?");
$delete->execute([Session::id()]);

Session::logout();

echo json_encode(['success' => true]);