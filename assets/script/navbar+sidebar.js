document.addEventListener("DOMContentLoaded", function () {
    const trigger = document.getElementById("account-menu-trigger");
    const dropdown = document.getElementById("account-dropdown");

    if (trigger && dropdown) {
        // 1. Clic sur l'icône : On affiche/cache le menu
        trigger.addEventListener("click", function (event) {
            // Empêche de fermer immédiatement si on clique sur le déclencheur lui-même
            event.stopPropagation();
            dropdown.classList.toggle("active");
        });

        // 2. Empêcher la fermeture si on clique à l'intérieur du menu déroulant
        dropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        // 3. Fermer le menu si on clique n'importe où ailleurs sur la page
        document.addEventListener("click", function () {
            dropdown.classList.remove("active");
        });
    }
});