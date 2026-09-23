<?php
header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/../../db/connexion_together_db.php';
    require_once __DIR__ . '/../../includes/Session.php';
    require_once __DIR__ . '/../../config/lang_php.php';

    $db = getDB();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $email = trim($input['email'] ?? '');
    $mdp   = trim($input['mot_de_passe'] ?? '');

    if (!$email || !$mdp) {
        echo json_encode([
            'success' => false,
            'message' => 'Veuillez remplir tous les champs.'
        ]);
        exit;
    }

    $req = $db->prepare('SELECT u.use_id, u.use_nom, u.use_role_id, u.use_mot_de_passe, 
                                p.tup_langue as use_lang, p.tup_theme_id
                        FROM TOG_USERS u
                        LEFT JOIN TOG_USER_PREFERENCES p ON u.use_id = p.tup_user_id
                        WHERE u.use_email = ?
                        LIMIT 1');
    $req->execute([$email]);
    $user = $req->fetch();

    if ($user && password_verify($mdp, $user['use_mot_de_passe'])) {
        Session::login([
            'id'    => $user['use_id'],
            'nom'   => $user['use_nom'],
            'role'  => $user['use_role_id'],
            'lang'  => $user['use_lang'] ?? 'fr',
            'theme' => $user['tup_theme_id'] ?? '2'
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id'   => $user['use_id'],
                'nom'  => $user['use_nom'],
                'role' => $user['use_role_id']
            ]
        ]);
        exit;
    }

    echo json_encode([
        'success' => false,
        'message' => 'Adresse email ou mot de passe incorrect.'
    ]);
    exit;

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur : ' . $e->getMessage()
    ]);
    exit;
}