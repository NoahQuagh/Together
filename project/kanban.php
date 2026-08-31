<div class="zone-top">
  <h1 class="zone-title">Tâches</h1>
</div>
<?php require_once __DIR__ . '/../includes/sectionMenuTasks.php'?>
<div id="kanban-id">
  <div class="demo-item">
    <div class="tog-spinner">
      <div class="tog-bg"></div>
      <div class="tog-elements">
        <div class="tog-top">
          <div class="tog-bar-long"></div>
          <div class="tog-bar-short"></div>
        </div>
        <div class="tog-bottom">
          <div class="tog-block"></div>
          <div class="tog-block"></div>
        </div>
      </div>
    </div>
    <div class="tog-dots">
      <div class="tog-dot"></div>
      <div class="tog-dot"></div>
      <div class="tog-dot"></div>
    </div>
    <span class="demo-caption" id="wait">Nous recherchons votre projet.</span>
  </div>
<script>document.addEventListener("DOMContentLoaded", function() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectUuid = urlParams.get('key');
        fetch(`../../../api/loader/loadProject.php?project=${encodeURIComponent(projectUuid)}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    console.error(res.message);
                    return;
                }
                renderProjectKanban(res.data);
            })
            .catch(error => {
                console.error('Erreur:', error);
                const container = document.getElementById('main-zone');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>Oups ! Une erreur est survenue lors du chargement des données du tableau de bord.</p>
                        </div>
                    `;
                }
            });
    });</script>

