<?php

header('Content-Type: application/json; charset=utf-8');

try{
    require_once __DIR__ . '/../api/db.php';
    require_once __DIR__ . '/../includes/Session.php';
    require_once __DIR__ . '/../config/lang_php.php';

    $db=getDB();
    $array="";

    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        header('Location: login.php');
        exit;
    }

    $email = trim($_POST['email'] ?? '');
    $mdp   = $_POST['mot_de_passe'] ?? '';

    if (!$email || !$mdp) {
        Session::setFlash('erreur', __tphp('please fill in all fields').'.');
        header('Location: login.php');
        exit;
    }

    $req = $db->prepare('SELECT use_id, use_nom, use_role_id, use_mot_de_passe, tup_langue as use_lang
                               FROM TOG_USERS
                               join TOG_USER_PREFERENCES on TOG_USERS.use_id = TOG_USER_PREFERENCES.tup_user_id
                               WHERE use_email = ?
                               LIMIT 1');
    $req->execute([$email]);
    $user = $req->fetch();



    if ($user && password_verify($mdp, $user['use_mot_de_passe'])) {
        Session::login([
            'id'   => $user['use_id'],
            'nom'  => $user['use_nom'],
            'role' => $user['use_role_id'],
            'lang' => $user['use_lang'],
        ]);

        header('Location: ../app/home.php');
        exit;
    }

    Session::setFlash('erreur', __tphp('incorrect email or password').'.');
    header('Location: login.php');
    exit;
}catch (Exception $e){
    Session::setFlash('erreur', __tphp('an error occurred. Please try again later').'.');
    header('Location: login.php');
    exit;
}

?>

