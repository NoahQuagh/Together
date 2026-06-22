function supCompte(){
    fetch('../api/deleteAccount.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                showToast("Action impossible", 'error');
                return;
            }else{
                window.location.href='../auth/login.php';
            }
        }).catch(() => showToast("Action impossible", 'error'));
}