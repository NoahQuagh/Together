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

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
}

document.getElementById('menuBtn').addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});