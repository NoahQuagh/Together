document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectUuid = urlParams.get('key');
    fetch(`../../../api/loader/loadProject.php?project=${encodeURIComponent(projectUuid)}`)
        .then(res => res.json())
        .then(res => {
            if (!res.success) {
                console.error(res.message);
                return;
            }
            renderProject(res.data);
        })
        .catch(error => {
            console.error('Erreur:', error);
            //const container = document.getElementById('dashboard-container');
            //if (container) {
                //container.innerHTML = `
                        //<div class="dash-error-msg">
                            //<i class="ti ti-face-id-error"></i>
                            //<p>Oups ! Une erreur est survenue lors du chargement des données du tableau de bord.</p>
                        //</div>
                    //`;
            //}
        });
});

function renderProject(data){
        document.getElementById('main-zone').innerHTML=`
            <p style="height: 10rem">${data.titre} ${data.manager} ${data.description}</p>
        `;
}
