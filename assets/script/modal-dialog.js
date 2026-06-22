// Ouvre la modale
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Ferme la modale
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Optionnel : Fermer la modale si on clique à l'extérieur de la boite (sur le fond sombre)
window.addEventListener('click', function(event) {
    const overlay = document.querySelector('.modal-overlay');
    if (event.target === overlay) {
        overlay.style.display = 'none';
    }
});

/* Fonction test liée au bouton de confirmation
function actionConfirmee() {
    closeModal('myModal');
    showToast('Action confirmée avec succès !', 'success');
}*/