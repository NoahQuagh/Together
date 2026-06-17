<?php
try {
  require_once 'db.php';
  require_once '../includes/Session.php';

  $db = getDB();

  $req = $db->prepare('
        SELECT p.pro_id, p.pro_nom, p.pro_description, p.pro_date_debut, p.pro_date_fin,
               sp.rsp_id AS statut_id, sp.rsp_label AS statut_label
        FROM TOG_PROJECTS p
        JOIN TOG_REF_STATUT_PROJET sp ON p.pro_statut_id = sp.rsp_id
        WHERE p.pro_owner_id = ?
        and p.pro_statut_id !=4
        ORDER BY p.pro_date_fin asc
    ');

  $req->execute([Session::id()]);

  $myProject = $req->fetchAll();

} catch (\Throwable $e) {
  error_log("[Project Error] " . $e->getMessage());
  http_response_code(500);
  echo "Erreur interne du serveur.";
  exit();
}

function statutBadge(string $statut): string {
  switch ($statut) {
    case 'actif':   return 'badge-green';
    case 'pause':    return 'badge-yellow';
    case 'termine': return 'badge-blue';
    default:         return 'badge-blue';
  }
}

?>

<div class="proj-page">

  <div class="proj-filters">
    <button class="proj-filter-btn active" data-filter="tout"><i class="ti ti-layout-grid"></i>Tout</button>
    <button class="proj-filter-btn" data-filter="actif"><i class="ti ti-activity"></i>Actif</button>
    <button class="proj-filter-btn" data-filter="pause"><i class="ti ti-player-pause"></i>Pause</button>
    <button class="proj-filter-btn" data-filter="termine"><i class="ti ti-check"></i>Terminé</button>
  </div>

  <?php if (empty($myProject)): ?>

    <div class="dash-empty proj-empty-global">
      <i class="ti ti-folder-off" aria-hidden="true"></i>
      <p>Vous n'avez encore créé aucun projet.</p>
      <div>
        <button class="proj-create-btn" onclick="window.location.href='home.php?tab=mesProjets&action=creer'">
          <i class="ti ti-plus"></i>
          Créer mon premier projet
        </button>
      </div>
    </div>

  <?php else: ?>

    <div class="dash-project-list proj-list" id="projectList">
      <?php foreach ($myProject as $proj): ?>
        <li class="dash-project-item proj-item"
            data-statut="<?= htmlspecialchars($proj['statut_label']) ?>"
            data-id="<?= (int)$proj['pro_id'] ?>">

          <div class="proj-item-main">
                        <span class="dash-project-nom">
                            <i class="ti ti-folder"></i>
                            <?= htmlspecialchars($proj['pro_nom']) ?>
                            <span class="badge <?= statutBadge($proj['statut_label']) ?> proj-statut-badge">
                                <?= htmlspecialchars($proj['statut_label']) ?>
                            </span>
                        </span>

            <?php if ($proj['pro_description']): ?>
              <span class="proj-desc"><?= htmlspecialchars($proj['pro_description']) ?></span>
            <?php endif; ?>

            <div class="proj-item-meta">
              <?php if ($proj['pro_date_fin']): ?>
                <span class="proj-date">
                                    <i class="ti ti-calendar" aria-hidden="true"></i>
                                    <?= htmlspecialchars(date('d/m/Y', strtotime($proj['pro_date_fin']))) ?>
                                </span>
              <?php endif; ?>
            </div>
          </div>

          <div class="optionProject">
            <!-- Éditer -->
            <button class="option-btn option-vert btn-edit"
                    data-id="<?= (int)$proj['pro_id'] ?>"
                    title="Modifier le projet">
              <i class="ti ti-pencil"></i>
            </button>

            <!-- Changer le statut -->
            <div class="more-wrapper">
              <button class="option-btn option-blanc btn-more"
                      data-id="<?= (int)$proj['pro_id'] ?>"
                      title="Changer le statut">
                <i class="ti ti-dots"></i>
              </button>
              <div class="more-dropdown">
                <a href="#" class="more-dropdown-item" data-statut="actif">
                  <i class="ti ti-activity"></i>Actif
                </a>
                <a href="#" class="more-dropdown-item" data-statut="pause">
                  <i class="ti ti-player-pause"></i>Pause
                </a>
                <a href="#" class="more-dropdown-item" data-statut="termine">
                  <i class="ti ti-check"></i>Terminé
                </a>
              </div>
            </div>

            <!-- Supprimer -->
            <button class="option-btn option-red btn-delete"
                    data-id="<?= (int)$proj['pro_id'] ?>"
                    data-nom="<?= htmlspecialchars($proj['pro_nom']) ?>"
                    title="Supprimer le projet">
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </li>
      <?php endforeach; ?>
    </div>

    <div class="dash-empty proj-empty-filtered" id="emptyFiltered" style="display:none;">
      <i class="ti ti-filter-off" aria-hidden="true"></i>
      <p>Aucun projet ne correspond à ce filtre.</p>
    </div>

  <?php endif; ?>

</div>