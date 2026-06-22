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
      <span class="demo-caption">Nous recherchons vos projets... même ceux que vous aviez oubliés.</span>
    </div>
  </div>
  <div id="supProjet" class="modal-overlay" style="display: none;">
    <div class="modal-box">

      <div class="modal-header">
        <h3>Suprimer le projet ?</h3>
        <button class="modal-close-btn" onclick="closeModal('supProjet')">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <p>Êtes-vous sûr de vouloir suprimer ce projet ? Cette action est irréversible.</p>
      </div>

      <div class="modal-footer">
        <button class="modal-btn btn-cancel" onclick="closeModal('supProjet')">Annuler</button>
        <button class="modal-btn btn-confirm risk" onclick="supprimerProjetconfirmer()">Confirmer</button>
      </div>

    </div>
  </div>
</article>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../api/loadMyProject.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur serveur : " + response.status);
                }
                return response.text();
            })
            .then(html => {
                const container = document.getElementById('dashboard-container');
                if (container) {
                    container.innerHTML = html;
                }
                projet()
            })
            .catch(error => {
                console.error('Erreur:', error);
                const container = document.getElementById('dashboard-container');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>Oups ! Une erreur est survenue lors du chargement de vos projets.</p>
                        </div>
                    `;
                }
            });
    });
</script>
