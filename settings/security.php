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
            <span class="demo-caption" id="wait">Nous préparons vos données de sécurité... le nombre café reste confidentiel.</span>
        </div>
    </div>
  <div id="supCompte" class="modal-overlay" style="display: none;">
    <div class="modal-box">

      <div class="modal-header">
        <h3>Confirmer l'action</h3>
        <button class="modal-close-btn" onclick="closeModal('supCompte')">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
      </div>

      <div class="modal-footer">
        <button class="modal-btn btn-cancel" onclick="closeModal('supCompte')">Annuler</button>
        <button class="modal-btn btn-confirm risk" onclick="supCompte()">Confirmer</button>
      </div>

    </div>
  </div>
</article>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../api/loadSecurity.php')
            .then(response => {
                // Si le serveur renvoie une erreur (ex: code 500), on force le passage dans le .catch()
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
            })
            .catch(error => {
                console.error('Erreur:', error);
                const container = document.getElementById('dashboard-container');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>Oups ! Une erreur est survenue lors du chargement des données de sécurités.</p>
                        </div>
                    `;
                }
            });
    });
</script>
