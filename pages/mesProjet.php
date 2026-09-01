<article class="dash-page">
  <div id="dashboard-container">
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
      <span class="demo-caption"><?= __tphp('we are looking for your projects... even the ones you had forgotten about') ?>.</span>
    </div>
  </div>
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
