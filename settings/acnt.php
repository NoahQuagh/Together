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
            <span class="demo-caption" id="wait">Chargement de votre profil... nous vérifions que vous êtes bien vous.</span>
        </div>
    </div>
</article>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../api/loadProfile.php')
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
                            <p>Oups ! Une erreur est survenue lors du chargement de votre profile.</p>
                        </div>
                    `;
                }
            });
    });
</script>
