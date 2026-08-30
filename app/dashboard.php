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
      <span class="demo-caption" id="wait">Nous recherchons où vous avez été le plus productif… les pauses café ne comptent pas, bien sûr.</span>
    </div>

  </div>
</article>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../api/loader/loadDashBoardData.php')
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message || 'Échec du chargement des données');
                }
                renderDashboard(res.data);
            })
            .catch(error => {
                console.error('Erreur:', error);
                const container = document.getElementById('dashboard-container');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>Oups ! Une erreur est survenue lors du chargement des données du tableau de bord.</p>
                        </div>
                    `;
                }
            });
    });
</script>
