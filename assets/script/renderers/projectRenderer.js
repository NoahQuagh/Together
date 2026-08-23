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
});

function renderProject(data){
    document.getElementById('main-zone').innerHTML=`
        <p style="height: 10rem">${data.titre} ${data.manager} ${data.description}</p>
        <table>
          <tbody>
          ${data.tasks.map(t => `
            <tr>
              
              <th style="text-align: left;padding-left: 20px;">${t.sprint_id}</th>
              <th style="text-align: left;padding-left: 20px;">${t.assigner}</th>
              <th style="text-align: left;padding-left: 20px;">${t.reporter}</th>
              <th style="text-align: left;padding-left: 20px;">${t.titre}</th>
              <th style="text-align: left;padding-left: 20px;">${t.desc}</th>
              <th style="text-align: left;padding-left: 20px;">${t.statut}</th>
              <th style="text-align: left;padding-left: 20px;">${t.priorite}</th>
              <th style="text-align: left;padding-left: 20px;">${t.date_debut}</th>
              <th style="text-align: left;padding-left: 20px;">${t.date_fin}</th>
            </tr>`).join('')}
          </tbody>
        </table>  
    `;
}
