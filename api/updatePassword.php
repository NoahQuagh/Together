<?php
require_once 'db.php';
require_once '../includes/Session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../settings/profile.php?tab=profile');
    exit;
}

$mdpActuel  = $_POST['mdp_actuel'] ?? '';
$mdpNouveau = $_POST['mdp_nouveau'] ?? '';
$mdpConfirm = $_POST['mdp_confirm'] ?? '';

$erreurs = [];

if (strlen($mdpNouveau) < 8) {
    $erreurs[] = 'Le nouveau mot de passe doit faire au moins 8 caractères.';
}
if ($mdpNouveau !== $mdpConfirm) {
    $erreurs[] = 'Les mots de passe ne correspondent pas.';
}

$db = getDB();

$req = $db->prepare('SELECT use_mot_de_passe FROM TOG_USERS WHERE use_id = ?');
$req->execute([Session::id()]);
$user = $req->fetch();

if (!$user || !password_verify($mdpActuel, $user['use_mot_de_passe'])) {
    $erreurs[] = 'Le mot de passe actuel est incorrect.';
}

if (!empty($erreurs)) {
    Session::setFlash('erreur_profil', implode(' ', $erreurs));
    header('Location: ../settings/profile.php?tab=profile');
    exit;
}

$hash = password_hash($mdpNouveau, PASSWORD_BCRYPT);

$update = $db->prepare('UPDATE TOG_USERS SET use_mot_de_passe = ? WHERE use_id = ?');
$update->execute([$hash, Session::id()]);

Session::setFlash('succes_profil', 'Votre mot de passe a été mis à jour avec succès.');
header('Location: ../settings/profile.php?tab=profile');
exit;