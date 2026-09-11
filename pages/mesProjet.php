<article class="dash-page">
  <div id="dashboard-container">
    <article class="section-loading-center">
      <div class="sp-wrap">

        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <div class="sp-stage lg">
            <div class="sp-card sp-card-1"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
            <div class="sp-card sp-card-2"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
            <div class="sp-card sp-card-3"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
          </div>
        </div>

      </div>
      <span class="demo-caption"><?= __tphp('we are looking for your projects... even the ones you had forgotten about') ?>.</span>
    </article>
  <div id="supProjet" class="modal-overlay" style="display: none;">
    <div class="modal-box">

      <div class="modal-header">
        <h3><?= __tphp('delete the project') ?> ?</h3>
        <button class="modal-close-btn" onclick="closeModal('supProjet')">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <p><?= __tphp('are you sure you want to delete this project ? This action is irreversible') ?>.</p>
      </div>

      <div class="modal-footer">
        <button class="modal-btn btn-cancel" onclick="closeModal('supProjet')"><?= __tphp('cancel') ?></button>
        <button class="modal-btn btn-confirm risk" onclick="supprimerProjetconfirmer()"><?= __tphp('confirm') ?></button>
      </div>

    </div>
  </div>
</article>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../api/loader/loadMyProject.php')
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                renderMyProject(res.data);
            })
            .catch(error => {
                const container = document.getElementById('dashboard-container');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>${__t('an error occurred while loading your projects')}.</p>
                        </div>
                    `;
                }
            });
    });
</script>
