<?php
require_once __DIR__ . '/../api/db.php';
require_once __DIR__ . '/../includes/Session.php';
require_once __DIR__ . '/../config/lang_php.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.php');
    exit;
}

$prenom  = trim($_POST['prenom'] ?? '');
$nom     = trim($_POST['nom'] ?? '');
$email   = trim($_POST['email'] ?? '');
$mdp     = $_POST['mot_de_passe'] ?? '';
$mdp2    = $_POST['mot_de_passe_confirm'] ?? '';
$cgu     = isset($_POST['cgu']);

$erreurs = [];

if (!$prenom) $erreurs[] = __tphp('the first name is mandatory').'.';
if (!$nom) $erreurs[] = __tphp('the name is mandatory').'.';
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL))
    $erreurs[] = __tphp('invalid email address').'.';
if (strlen($mdp) < 8) $erreurs[] = __tphp('the password must be at least 8 characters long').'.';
if ($mdp !== $mdp2) $erreurs[] = __tphp('the passwords do not match').'.';
if (!$cgu) $erreurs[] = __tphp('you must accept the Terms of Use').'.';

if (!empty($erreurs)) {
    Session::setFlash('erreur_register', implode(' ', $erreurs));
    header('Location: login.php');
    exit;
}

$db  = getDB();
$req = $db->prepare('SELECT use_id FROM TOG_USERS WHERE use_email = ? LIMIT 1');
$req->execute([$email]);

if ($req->fetch()) {
    Session::setFlash('erreur_register', __tphp('this email address is already in use').'.');
    header('Location: login.php');
    exit;
}

$hash = password_hash($mdp, PASSWORD_BCRYPT);

$insert = $db->prepare('
    INSERT INTO TOG_USERS (use_prenom, use_nom, use_email, use_mot_de_passe)
    VALUES (?, ?, ?, ?)
');

$insert->execute([$prenom, $nom, $email, $hash]);

$newId = (int) $db->lastInsertId();

Session::login([
    'id'   => $newId,
    'nom'  => $nom,
    'role' => 2,
]);

Session::setFlash('succes', __tphp('welcome').' ' . htmlspecialchars($prenom) . ' ! '.__tphp('your account has been created').'.');
header('Location: ../app/pages.php');
exit;
