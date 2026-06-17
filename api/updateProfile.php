<?php
require_once 'db.php';
require_once '../includes/Session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../settings/profile.php?tab=profile');
    exit;
}

$prenom = trim($_POST['prenom'] ?? '');
$nom    = trim($_POST['nom'] ?? '');
$email  = trim($_POST['email'] ?? '');

$erreurs = [];

if (!$prenom) $erreurs[] = 'Le prénom est obligatoire.';
if (!$nom) $erreurs[] = 'Le nom est obligatoire.';
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs[] = 'Adresse e-mail invalide.';
}

$db = getDB();

$reqCheck = $db->prepare('SELECT use_id FROM TOG_USERS WHERE use_email = ? AND use_id != ?');
$reqCheck->execute([$email, Session::id()]);

if ($reqCheck->fetch()) {
    $erreurs[] = 'Cette adresse e-mail est déjà utilisée par un autre compte.';
}

if (!empty($erreurs)) {
    Session::setFlash('erreur_profil', implode(' ', $erreurs));
    header('Location: ../settings/profile.php?tab=profile');
    exit;
}

$update = $db->prepare('
    UPDATE TOG_USERS
    SET use_prenom = ?, use_nom = ?, use_email = ?
    WHERE use_id = ?
');
$update->execute([$prenom, $nom, $email, Session::id()]);

Session::login([
    'id'    => Session::id(),
    'nom'   => $nom,
    'role'  => Session::role(),
]);

Session::setFlash('succes_profil', 'Vos informations ont été mises à jour avec succès.');
header('Location: ../settings/profile.php?tab=profile');
exit;