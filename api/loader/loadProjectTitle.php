<?php

try{
    require_once __DIR__ . '/../db.php';
    require_once __DIR__ . '/../../includes/Session.php';

    Session::start();
    Session::requireLogin();

    $db=getDB();

    $project = $db->prepare('select pro_nom from TOG_PROJECTS where pro_uuid=?');

    $project->execute([$projectId]);
    $proj = $project->fetch();

    $title = $proj['pro_nom'];

} catch (\Throwable $e) {
    echo 'Inconnu';
}
?>
