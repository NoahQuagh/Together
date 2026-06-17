<?php
require_once '../config.php';
$nom    = "Invité";
$prenom = "";
$email  = "";
$role   = "guest";

try{
require_once BASE_PATH.'/api/db.php';
require_once BASE_PATH.'/includes/Session.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


    $db = getDB();

    $req = $db->prepare('
select use_nom as nom,use_prenom as prenom,use_email as email,ru.rru_label as role from TOG_USERS
join TOG_REF_ROLE_USER ru on TOG_USERS.use_role_id = ru.rru_id
where use_id=?
');

    $req->execute([Session::id()]);

    $user = $req->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $nom    = $user['nom'];
        $prenom = $user['prenom'];
        $email  = $user['email'];
        $role   = $user['role'];
    } else {
        $nom    = "Invité";
        $prenom = "";
        $email  = "";
        $role   = "guest";
    }
}catch (Throwable $e){

}


?>
