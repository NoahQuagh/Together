<?php
require_once __DIR__ . '/../includes/Session.php';
Session::start();
Session::requireLogin();
require_once __DIR__ . '/../config/lang_php.php';
require_once __DIR__ . '/../includes/defineTheme.php';
?>
<!DOCTYPE html>
<html lang="fr" data-theme="<?= $themeAttr ?>">
<head>
    <meta charset="UTF-8">
    <title>Home - Together</title>
    <link rel="stylesheet" href="../assets/style/paletteStyle.css">
    <link rel="stylesheet" href="../assets/style/tools/loader.css">
    <link rel="stylesheet" href="../assets/style/navigation/header.css">
    <link rel="stylesheet" href="../assets/style/tools/nonConnecterSection.css">
    <link rel="stylesheet" href="../assets/style/navigation/footer.css">
    <link rel="stylesheet" href="../assets/style/notification/myNotif.css">
    <link rel="stylesheet" href="../assets/style/tools/spinnerlogoScaled.css">
    <link rel="stylesheet" href="../assets/style/tools/errorloading+iconTop.css">
    <link rel="stylesheet" href="../assets/style/tools/toast-notification.css">
    <link rel="stylesheet" href="../assets/style/project/_resp_newProjectModal.css">
    <link rel="stylesheet" href="../assets/style/tools/modal-dialog.css">
    <link rel="stylesheet" href="../assets/style/tools/zone-travaux.css">
    <link rel="icon" type="image/png" href="../assets/logo/logoheader.png">
    <link rel="stylesheet" href="../assets/style/project/newProjectModal.css">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">
</head>
<body>

<?php require_once __DIR__ . "/../includes/navbar.php" ?>

<main id="notif-page">

    <?php
    /* ── Fausses données de test ── */
    $notifications = [
            [
                    'origine' => 'Sophie Martin',
                    'rtn_label' => 'assignation',
                    'ton_label' => 'tache',
                    'not_nom_objet' => 'Page login — formulaire connexion',
                    'not_lien' => '/together/pages/app.php?key=abc&tab=tasks',
                    'not_lu' => 0,
                    'not_created_at' => '2025-03-10 09:05:00',
            ],
            [
                    'origine' => 'Thomas Leroy',
                    'rtn_label' => 'commentaire',
                    'ton_label' => 'tache',
                    'not_nom_objet' => 'Système d\'authentification JWT',
                    'not_lien' => '/together/pages/app.php?key=abc&tab=tasks',
                    'not_lu' => 0,
                    'not_created_at' => '2025-03-09 14:30:00',
            ],
            [
                    'origine' => 'Clara Bernard',
                    'rtn_label' => 'mention',
                    'ton_label' => 'tache',
                    'not_nom_objet' => 'Animation de transition entre formulaires',
                    'not_lien' => '/together/pages/app.php?key=abc&tab=tasks',
                    'not_lu' => 0,
                    'not_created_at' => '2025-03-08 11:00:00',
            ],
            [
                    'origine' => 'Maxime Dubois',
                    'rtn_label' => 'commentaire',
                    'ton_label' => 'sprint',
                    'not_nom_objet' => 'Sprint 3 — Auth & Login',
                    'not_lien' => '/together/pages/app.php?key=abc&tab=sprints',
                    'not_lu' => 1,
                    'not_created_at' => '2025-03-07 16:45:00',
            ],
            [
                    'origine' => 'Sophie Martin',
                    'rtn_label' => 'invitation',
                    'ton_label' => 'projet',
                    'not_nom_objet' => 'API REST v2',
                    'not_lien' => '/together/pages/app.php?key=def&tab=overview',
                    'not_lu' => 1,
                    'not_created_at' => '2025-03-05 09:00:00',
            ],
            [
                    'origine' => 'Léa Moreau',
                    'rtn_label' => 'mention',
                    'ton_label' => 'tache',
                    'not_nom_objet' => 'Page login — formulaire inscription',
                    'not_lien' => '/together/pages/app.php?key=abc&tab=tasks',
                    'not_lu' => 1,
                    'not_created_at' => '2025-03-04 10:15:00',
            ],
            [
                    'origine' => 'Thomas Leroy',
                    'rtn_label' => 'assignation',
                    'ton_label' => 'tache',
                    'not_nom_objet' => 'Endpoint GET /users',
                    'not_lien' => '/together/pages/app.php?key=def&tab=tasks',
                    'not_lu' => 1,
                    'not_created_at' => '2025-03-03 08:30:00',
            ]
    ];

    /* ── Helpers ── */
    function notifIcon(string $type): string
    {
        $icons = [
                'commentaire' => 'ti-message',
                'mention' => 'ti-at',
                'assignation' => 'ti-user-check',
                'invitation' => 'ti-user-plus',
        ];
        return $icons[$type] ?? 'ti-bell';
    }

    function notifIconColor(string $type): string
    {
        $colors = [
                'commentaire' => 'notif-icon--blue',
                'mention' => 'notif-icon--yellow',
                'assignation' => 'notif-icon--green',
                'invitation' => 'notif-icon--purple',
        ];
        return $colors[$type] ?? 'notif-icon--gray';
    }

    function notifMessage(array $n): string {
        $o   = htmlspecialchars($n['origine']);
        $obj = '<strong>' . htmlspecialchars($n['not_nom_objet']) . '</strong>';
        $ton = strtolower(trim($n['ton_label']));
        $rtn = strtolower(trim($n['rtn_label']));

        $objetsGrammaire = [
                'tache'  => ['genre' => 'f', 'nom' => 'tâche'],
                'sprint' => ['genre' => 'm', 'nom' => 'sprint'],
                'projet' => ['genre' => 'm', 'nom' => 'projet'],
        ];

        $infoObjet = $objetsGrammaire[$ton] ?? ['genre' => 'm', 'nom' => $ton];
        $estFeminin = ($infoObjet['genre'] === 'f');
        $nomObjetFormatted = $infoObjet['nom'];

        switch ($rtn) {
            case 'commentaire':
                $prep = $estFeminin ? "sur la $nomObjetFormatted" : "sur le $nomObjetFormatted";
                return "$o a commenté $prep $obj";

            case 'mention':
                $prep = $estFeminin ? "dans la $nomObjetFormatted" : "dans le $nomObjetFormatted";
                return "$o vous a mentionné dans $prep $obj";

            case 'assignation':
                $prep = $estFeminin ? "à la $nomObjetFormatted" : "au $nomObjetFormatted";
                return "$o vous a assigné $prep $obj";

            case 'invitation':
                $prep = $estFeminin ? "sur la $nomObjetFormatted" : "sur le $nomObjetFormatted";
                return "$o vous a invité $prep $obj";

            default:
                $prep = $estFeminin ? "sur la $nomObjetFormatted" : "sur le $nomObjetFormatted";
                return "$o a interagi $prep $obj";
        }
    }

    function notifDate(string $date): string
    {
        $diff = (new DateTime())->diff(new DateTime($date));
        if ($diff->days === 0) {
            if ($diff->h === 0) return 'Il y a ' . max(1, $diff->i) . ' min';
            return 'Il y a ' . $diff->h . ' h';
        }
        if ($diff->days === 1) return 'Hier';
        if ($diff->days < 7) return 'Il y a ' . $diff->days . ' jours';
        return (new DateTime($date))->format('d/m/Y');
    }

    function initiales(string $nom): string
    {
        $parts = explode(' ', $nom);
        $sliced = array_slice($parts, 0, 2);
        $mapped = array_map(function ($p) {
            return $p[0] ?? '';
        }, $sliced);

        return strtoupper(implode('', $mapped));
    }

    $nonLues = array_filter($notifications, function ($n) {
        return $n['not_lu'] == 0;
    });

    $lues = array_filter($notifications, function ($n) {
        return $n['not_lu'] == 1;
    });
    ?>

    <link rel="stylesheet" href="../assets/style/notification/myNotif.css">

    <div class="notif-layout">

        <!-- En-tête -->
        <div class="notif-header">
            <div class="notif-header-left">
                <h1 class="notif-title"><?= __tphp('notifications') ?></h1>
                <?php if (count($nonLues)): ?>
                    <span class="notif-count-badge"><?= count($nonLues) ?></span>
                <?php endif; ?>
            </div>
            <div class="notif-header-actions">
                <button class="notif-btn-ghost" id="btn-mark-all">
                    <i class="ti ti-checks" aria-hidden="true"></i>
                    <?= __tphp('mark all as read') ?>
                </button>
            </div>
        </div>

        <!-- Filtres -->
        <div class="notif-filters">
            <button class="notif-filter active" data-filter="all"><?= __tphp('all') ?></button>
            <button class="notif-filter" data-filter="commentaire">
                <i class="ti ti-message" aria-hidden="true"></i><?= __tphp('comments') ?>
            </button>
            <button class="notif-filter" data-filter="mention">
                <i class="ti ti-at" aria-hidden="true"></i><?= __tphp('mentions') ?>
            </button>
            <button class="notif-filter" data-filter="assignation">
                <i class="ti ti-user-check" aria-hidden="true"></i><?= __tphp('assignments') ?>
            </button>
        </div>

        <!-- Liste des notifications -->
        <div class="notif-list" id="notif-list">

            <?php if (count($nonLues)): ?>
                <div class="notif-section-label"><?= __tphp('unread') ?></div>
                <?php foreach ($nonLues as $n): ?>
                    <a href="<?= htmlspecialchars($n['not_lien']) ?>"
                       class="notif-item notif-item--unread"
                       data-type="<?= htmlspecialchars($n['rtn_label']) ?>">
                        <div class="notif-avatar">
                            <span class="notif-avatar-initials"><?= initiales($n['origine']) ?></span>
                            <span class="notif-type-icon <?= notifIconColor($n['rtn_label']) ?>">
                    <i class="ti <?= notifIcon($n['rtn_label']) ?>" aria-hidden="true"></i>
                </span>
                        </div>
                        <div class="notif-body">
                            <p class="notif-message"><?= notifMessage($n) ?></p>
                            <div class="notif-meta">
                    <span class="notif-obj-type">
                        <i class="ti <?= $n['ton_label'] === 'tache' ? 'ti-checkbox' : ($n['ton_label'] === 'sprint' ? 'ti-run' : 'ti-folder') ?>"
                           aria-hidden="true"></i>
                        <?= htmlspecialchars(ucfirst($n['ton_label'])) ?>
                    </span>
                                <span class="notif-dot-sep">·</span>
                                <span class="notif-date"><?= notifDate($n['not_created_at']) ?></span>
                            </div>
                        </div>
                        <div class="notif-unread-dot" aria-label="Non lue"></div>
                    </a>
                <?php endforeach; ?>
            <?php endif; ?>

            <?php if (count($lues)): ?>
                <div class="notif-section-label"><?= __tphp('read') ?></div>
                <?php foreach ($lues as $n): ?>
                    <a href="<?= htmlspecialchars($n['not_lien']) ?>"
                       class="notif-item"
                       data-type="<?= htmlspecialchars($n['rtn_label']) ?>">
                        <div class="notif-avatar">
                            <span class="notif-avatar-initials"><?= initiales($n['origine']) ?></span>
                            <span class="notif-type-icon <?= notifIconColor($n['rtn_label']) ?>">
                    <i class="ti <?= notifIcon($n['rtn_label']) ?>" aria-hidden="true"></i>
                </span>
                        </div>
                        <div class="notif-body">
                            <p class="notif-message"><?= notifMessage($n) ?></p>
                            <div class="notif-meta">
                    <span class="notif-obj-type">
                        <i class="ti <?= $n['ton_label'] === 'tache' ? 'ti-checkbox' : ($n['ton_label'] === 'sprint' ? 'ti-run' : 'ti-folder') ?>"
                           aria-hidden="true"></i>
                        <?= htmlspecialchars(ucfirst($n['ton_label'])) ?>
                    </span>
                                <span class="notif-dot-sep">·</span>
                                <span class="notif-date"><?= notifDate($n['not_created_at']) ?></span>
                            </div>
                        </div>
                    </a>
                <?php endforeach; ?>
            <?php endif; ?>

            <?php if (!count($notifications)): ?>
                <div class="notif-empty">
                    <i class="ti ti-bell-off" aria-hidden="true"></i>
                    <p><?= __tphp('no notifications') ?></p>
                </div>
            <?php endif; ?>

        </div>

    </div>

    <script>
        /* ── Filtres ── */
        document.querySelectorAll('.notif-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.notif-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                document.querySelectorAll('#notif-list .notif-item').forEach(item => {
                    item.style.display = (filter === 'all' || item.dataset.type === filter) ? '' : 'none';
                });
            });
        });

        /* ── Tout marquer comme lu ── */
        document.getElementById('btn-mark-all')?.addEventListener('click', () => {
            document.querySelectorAll('.notif-item--unread').forEach(item => {
                item.classList.remove('notif-item--unread');
                item.querySelector('.notif-unread-dot')?.remove();
            });
            document.querySelector('.notif-count-badge')?.remove();
            /* TODO : appel API pour persister */
        });
    </script>

</main>

<?php require_once __DIR__ . "/../includes/footer.php" ?>
<script>
    window.translations = <?= json_encode($translations ?? [], JSON_UNESCAPED_UNICODE); ?>;

    window.__t = function (key) {
        if (window.translations && window.translations[key]) {
            return window.translations[key];
        }
        return key;
    };
</script>
<script src="../assets/script/navigation/navbar+sidebar.js"></script>
<script src="../assets/script/tools/toast-notification.js"></script>
<script src="../assets/script/tools/modal-dialog.js"></script>
<script src="../assets/script/tools/theme.js"></script>
<script src="../assets/script/project/newProject.js"></script>
<script src="../assets/script/renderers/project/modalNewProjectRenderer.js"></script>
<script src="../assets/script/tools/toolbox.js"></script>
<div id="toast-container" class="toast-container"></div><!--zone notif-->
</body>
</html>
