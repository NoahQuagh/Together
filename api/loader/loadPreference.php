<?php
header('Content-Type: application/json; charset=utf-8');
try{
    require_once __DIR__ . '/../db.php';
    require_once __DIR__ . '/../../includes/Session.php';

    $db = getDB();

    $flash_succes = Session::hasFlash('succes_pref') ? Session::getFlash('succes_pref') : null;
    $flash_erreur = Session::hasFlash('erreur_pref') ? Session::getFlash('erreur_pref') : null;

    $req = $db->prepare('
    select tup_theme_id,rth_label,tup_langue,lang_code,lang_label,tup_notif_email,tup_notif_mention,tup_notif_assignation,tup_notif_commentaire
    from TOG_USER_PREFERENCES
    join TOG_REF_THEME on TOG_USER_PREFERENCES.tup_theme_id = TOG_REF_THEME.rth_id
    join TOG_LANGUE on TOG_USER_PREFERENCES.tup_langue = TOG_LANGUE.lang_id
    where tup_user_id=?
');
    $req->execute([Session::id()]);
    $pref = $req->fetch();

    if (!$pref) {
        $insertDefault = $db->prepare('INSERT INTO TOG_USER_PREFERENCES (tup_user_id,tup_theme_id,tup_notif_email,tup_notif_mention,tup_notif_assignation,tup_notif_commentaire,tup_langue) VALUES (?,2,1,1,1,1,1)');
        $insertDefault->execute([Session::id()]);

        $pref = [
            'theme_id' => 2,
            'theme' => 'sombre',
            'langue_id' => 1,
            'langue' => 'fr',
            'langue_label' => 'français',
            'notif_email' => 1,
            'notif_mention' => 1,
            'notif_assignation' => 1,
            'notif_commentaire' => 1,
        ];

        echo json_encode([
            'success' => true,
            'data'    => $pref
        ]);
    }else{
        $req = $db->prepare('select rth_id,rth_label from TOG_REF_THEME');
        $req->execute();
        $theme = $req->fetchAll();

        $formattedTheme = array_map(function($p) {
            return [
                'theme_id'           => $p['rth_id'],
                'theme'         => $p['rth_label'],
            ];
        }, $theme);

        $req = $db->prepare('select lang_id,lang_code,lang_label from TOG_LANGUE');
        $req->execute();
        $lang = $req->fetchAll();

        $formattedLang = array_map(function($p) {
            return [
                'lang_id'           => $p['lang_id'],
                'lang'         => $p['lang_code'],
                'lang_label'         => $p['lang_label'],
            ];
        }, $lang);

        $formattedPref = [
            'theme_id'          => $pref['tup_theme_id'],
            'theme'             => $pref['rth_label'],
            'langue_id'         => $pref['tup_langue'],
            'langue'            => $pref['lang_code'],
            'langue_label'      => $pref['lang_label'],
            'notif_email'       => $pref['tup_notif_email'],
            'notif_mention'     => $pref['tup_notif_mention'],
            'notif_assignation' => $pref['tup_notif_assignation'],
            'notif_commentaire' => $pref['tup_notif_commentaire'],
        ];

        echo json_encode([
            'success' => true,
            'data'    => $formattedPref,
            'themeList' => $formattedTheme,
            'langList' => $formattedLang
        ]);
    }
}catch (\Throwable $e) {
    error_log("[Preference Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de vos préférence.']);
    exit();
}