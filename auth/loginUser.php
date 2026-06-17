<?php

try{
    require_once '../api/db.php';
    require_once '../includes/Session.php';

    $db=getDB();
    $array="";

    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        header('Location: login.php');
        exit;
    }

    $email = trim($_POST['email'] ?? '');
    $mdp   = $_POST['mot_de_passe'] ?? '';

    if (!$email || !$mdp) {
        Session::setFlash('erreur', 'Veuillez remplir tous les champs.');
        header('Location: login.php');
        exit;
    }

    $req = $db->prepare('SELECT use_id, use_nom, use_role_id, use_mot_de_passe FROM TOG_USERS WHERE use_email = ? LIMIT 1');
    $req->execute([$email]);
    $user = $req->fetch();



    if ($user && password_verify($mdp, $user['use_mot_de_passe'])) {
        Session::login([
            'id'   => $user['use_id'],
            'nom'  => $user['use_nom'],
            'role' => $user['use_role_id'],
        ]);

        header('Location: ../home/home.php');
        exit;
    }

    Session::setFlash('erreur', 'Email ou mot de passe incorrect.');
    header('Location: login.php');
    exit;
}catch (Exception $e){
    Session::setFlash('erreur', 'Une erreur est survenu.');
    header('Location: login.php');
    exit;
}

?>

