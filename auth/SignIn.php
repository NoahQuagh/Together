<?php
require_once '../api/db.php';
require_once '../includes/Session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /together/login.php');
    exit;
}

$prenom  = trim($_POST['prenom'] ?? '');
$nom     = trim($_POST['nom'] ?? '');
$email   = trim($_POST['email'] ?? '');
$mdp     = $_POST['mot_de_passe'] ?? '';
$mdp2    = $_POST['mot_de_passe_confirm'] ?? '';
$cgu     = isset($_POST['cgu']);

$erreurs = [];

if (!$prenom) $erreurs[] = 'Le prénom est obligatoire.';
if (!$nom) $erreurs[] = 'Le nom est obligatoire.';
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL))
    $erreurs[] = 'Adresse e-mail invalide.';
if (strlen($mdp) < 8) $erreurs[] = 'Le mot de passe doit faire au moins 8 caractères.';
if ($mdp !== $mdp2) $erreurs[] = 'Les mots de passe ne correspondent pas.';
if (!$cgu) $erreurs[] = 'Vous devez accepter les CGU.';

if (!empty($erreurs)) {
    Session::setFlash('erreur_register', implode(' ', $erreurs));
    header('Location: /together/login.php');
    exit;
}

$db  = getDB();
$req = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$req->execute([$email]);

if ($req->fetch()) {
    Session::setFlash('erreur_register', 'Cette adresse e-mail est déjà utilisée.');
    header('Location: /together/login.php');
    exit;
}

$hash = password_hash($mdp, PASSWORD_BCRYPT);

$insert = $db->prepare('
    INSERT INTO users (prenom, nom, email, mot_de_passe, role, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
');

$insert->execute([$prenom, $nom, $email, $hash, 'member']);

$newId = (int) $db->lastInsertId();

Session::login([
    'id'   => $newId,
    'nom'  => $nom,
    'role' => 'member',
]);

Session::setFlash('succes', 'Bienvenue ' . htmlspecialchars($prenom) . ' ! Votre compte a été créé.');
header('Location: /together/index.php');
exit;
