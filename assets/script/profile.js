function supCompte(){
    fetch('../api/deleter/deleteAccount.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                showToast(__t('impossible action'), 'error');
                return;
            }else{
                window.location.href='../auth/login.php';
            }
        }).catch(() => showToast(__t('impossible action'), 'error'));
}