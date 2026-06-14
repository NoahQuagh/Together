<?php
require_once '../api/db.php';
require_once '../includes/Session.php';

$db=getDB();
$array="";

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    header('Location: ../login.php');
    exit;
}

$email = trim($_POST['email'] ?? '');
$mdp   = $_POST['mot_de_passe'] ?? '';

if (!$email || !$mdp) {
    Session::setFlash('erreur', 'Veuillez remplir tous les champs.');
    header('Location: ../login.php');
    exit;
}

$req = $db->prepare('SELECT id, nom, role, mot_de_passe FROM users WHERE email = ? LIMIT 1');
$req->execute([$email]);
$user = $req->fetch();



if ($user && password_verify($mdp, $user['mot_de_passe'])) {
    Session::login([
        'id'   => $user['id'],
        'nom'  => $user['nom'],
        'role' => $user['role'],
    ]);

    header('Location: ../index.php');
    exit;
}

Session::setFlash('erreur', 'Email ou mot de passe incorrect.');
header('Location: ../login.php');
exit;
?>

