function renderProfile(data){
    const container = document.getElementById('setting-zone');
    if(!container) return;
    const prenom = data.prenom || '';
    const nom = data.nom || '';
    const initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || 'U';

    let dateCreaFormatted = '';
    if (data.date_crea) {
        const dateObj = new Date(data.date_crea);
        dateCreaFormatted = dateObj.toLocaleDateString('fr-FR');
    }

    container.innerHTML = `
        <div class="profile-page">

            <div class="profile-header">
                <div class="profile-avatar">${initiales}</div>
                <div class="profile-header-info">
                    <h2>${prenom} ${nom}</h2>
                    <span class="profile-since">${__t(data.role)}</span>
                    ${dateCreaFormatted ? `<span class="profile-since">${__t('member since')} ${dateCreaFormatted}</span>` : ''}
                </div>
            </div>

            <div class="profile-block">
                <div class="profile-block-header">
                    <h3><i class="ti ti-user" aria-hidden="true"></i> ${__t('personal information')}</h3>
                </div>

                <form class="profile-form" method="POST" action="../updater/updateProfile.php">

                    <div class="profile-row-2">
                        <div class="profile-field">
                            <label for="prenom">${__t('first name')}</label>
                            <input type="text" id="prenom" name="prenom" value="${prenom}" required>
                        </div>
                        <div class="profile-field">
                            <label for="nom">${__t('name')}</label>
                            <input type="text" id="nom" name="nom" value="${nom}" required>
                        </div>
                    </div>

                    <div class="profile-field">
                        <label for="email">${__t('e-mail')}</label>
                        <input type="email" id="email" name="email" value="${data.email || ''}" required>
                    </div>

                    <button type="submit" class="profile-btn-save">
                        <i class="ti ti-device-floppy" aria-hidden="true"></i>
                        ${__t('save')}
                    </button>

                </form>
            </div>

        </div>
    `;
}