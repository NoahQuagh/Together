function supprimerCompte() {
    fetch('../api/deleteAccount.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                alert('Erreur : ' + (data.message || 'Impossible de supprimer le compte.'));
                return;
            }else{
                window.location.href='../auth/login.php';
            }
        }).catch(() => alert('Erreur réseau. Réessayez.'));
}