function renderNotification(data){
    document.getElementById('setting-zone').innerHTML = `
        <div class="profile-page">

            <form id="form-notifications" method="POST" action="../../../api/updater/updatePreferences.php">

                <div class="profile-block">
                    <div class="profile-block-header">
                        <h3><i class="ti ti-bell" aria-hidden="true"></i> ${__t('notifications')}</h3>
                    </div>

                    <div class="profile-form pref-toggle-list">

                        <label class="pref-toggle-row">
                            <div class="pref-toggle-text">
                                <span class="pref-toggle-title">${__t('email notifications')}</span>
                                <span class="pref-toggle-desc">${__t('receive a summary by email')}</span>
                            </div>
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_email" value="1" ${Number(data.notif_email) === 1 ? 'checked' : ''}>
                                <span class="pref-switch-slider"></span>
                            </span>
                        </label>

                        <label class="pref-toggle-row">
                            <div class="pref-toggle-text">
                                <span class="pref-toggle-title">${__t('mentions')}</span>
                                <span class="pref-toggle-desc">${__t('get notified when someone mentions you')}</span>
                            </div>
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_mention" value="1" ${Number(data.notif_mention) === 1 ? 'checked' : ''}>
                                <span class="pref-switch-slider"></span>
                            </span>
                        </label>

                        <label class="pref-toggle-row">
                            <div class="pref-toggle-text">
                                <span class="pref-toggle-title">${__t('assignments')}</span>
                                <span class="pref-toggle-desc">${__t('get notified when a task is assigned to you')}</span>
                            </div>
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_assignation" value="1" ${Number(data.notif_assignation) === 1 ? 'checked' : ''}>
                                <span class="pref-switch-slider"></span>
                            </span>
                        </label>

                        <label class="pref-toggle-row">
                            <div class="pref-toggle-text">
                                <span class="pref-toggle-title">${__t('comments')}</span>
                                <span class="pref-toggle-desc">${__t('get notified of new comments on your tasks')}</span>
                            </div>
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_commentaire" value="1" ${Number(data.notif_commentaire) === 1 ? 'checked' : ''}>
                                <span class="pref-switch-slider"></span>
                            </span>
                        </label>

                    </div>
                </div>

                <button type="submit" class="profile-btn-save">
                    <i class="ti ti-device-floppy" aria-hidden="true"></i>
                    ${__t('save')}
                </button>
            </form>
        </div>
    `;
}
function renderAppearance(res) {
    const container = document.getElementById('setting-zone');
    if (!container) return;

    let themeList;

    if (!res || !res.themeList) {
        themeList = [{ theme_id: 2, theme: __t('sombre') }];
    } else {
        themeList = res.themeList;
    }

    /* data est un objet direct (fetch PHP) — sécurité si tableau reçu */
    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    const currentThemeId = data?.theme_id ?? null;
    const currentTheme   = data?.theme    ?? '';

    container.innerHTML = `
    <div class="profile-page">
        <form id="form-appearance" method="POST" action="../../../api/updater/updatePreferences.php">
            <div class="profile-block">
                <div class="profile-block-header">
                    <h3><i class="ti ti-palette" aria-hidden="true"></i> ${__t('appearance')}</h3>
                </div>
 
                <div class="profile-form">
                    <div class="profile-field">
                        <label>${__t('interface theme')}</label>
                        <div class="pref-theme-options">
                            <div class="theme-picker">
                        
                                <label class="theme-option">
                                    <input type="radio" name="theme" value="1" ${currentTheme === 'clair' ? 'checked' : ''}>
                                    <div class="theme-window win-light">
                                        <div class="w-bar"><div class="w-dot"></div><div class="w-dot"></div><div class="w-dot"></div></div>
                                        <div class="w-body">
                                            <div class="w-side">
                                                <div class="w-nav-item active"></div>
                                                <div class="w-nav-item"></div>
                                                <div class="w-nav-item"></div>
                                            </div>
                                            <div class="w-content">
                                                <div class="w-card"><div class="w-line accent"></div><div class="w-line short"></div></div>
                                                <div class="w-card"><div class="w-line"></div><div class="w-line short"></div></div>
                                                <div class="w-card"><div class="w-line"></div><div class="w-line short"></div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="theme-check"></div>
                                    <span class="theme-label">${__t('light')}</span>
                                </label>
                        
                                <label class="theme-option">
                                    <input type="radio" name="theme" value="2" ${currentTheme === 'sombre' ? 'checked' : ''}>
                                    <div class="theme-window win-dark">
                                        <div class="w-bar"><div class="w-dot"></div><div class="w-dot"></div><div class="w-dot"></div></div>
                                        <div class="w-body">
                                            <div class="w-side">
                                                <div class="w-nav-item active"></div>
                                                <div class="w-nav-item"></div>
                                                <div class="w-nav-item"></div>
                                            </div>
                                            <div class="w-content">
                                                <div class="w-card"><div class="w-line accent"></div><div class="w-line short"></div></div>
                                                <div class="w-card"><div class="w-line"></div><div class="w-line short"></div></div>
                                                <div class="w-card"><div class="w-line"></div><div class="w-line short"></div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="theme-check"></div>
                                    <span class="theme-label">${__t('dark')}</span>
                                </label>
                        
                                <label class="theme-option">
                                    <input type="radio" name="theme" value="3" ${currentTheme === 'systeme' ? 'checked' : ''}>
                                    <div class="theme-window win-system">
                                        <div class="w-bar"><div class="w-dot"></div><div class="w-dot"></div><div class="w-dot"></div></div>
                                        <div class="w-body">
                                            <div class="w-side">
                                                <div class="w-nav-item active"></div>
                                                <div class="w-nav-item"></div>
                                                <div class="w-nav-item"></div>
                                            </div>
                                            <div class="w-content">
                                                <div class="w-card"><div class="w-line accent"></div><div class="w-line short"></div></div>
                                                <div class="w-card"><div class="w-line"></div><div class="w-line short"></div></div>
                                                <div class="w-card"><div class="w-line"></div><div class="w-line short"></div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="theme-check"></div>
                                    <span class="theme-label">${__t('system')}</span>
                                </label>
                        
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    `;
}
function renderLanguage(res){
    const container = document.getElementById('setting-zone');
    if (!container) return;

    let langList;

    if (!res || !res.langList) {
        langList = [{ lang_id: 1, lang: 'fr', lang_label: 'Français' }];
    } else {
        langList = res.langList;
    }

    const currentLangId = res.data?.langue_id ?? res.data?.tup_langue ?? 1;

    const optionsHtml = langList.map(l => {
        const id = l.lang_id ?? 1;
        const code = l.lang ?? 'fr';
        const label = l.lang_label ?? l.lang ?? 'Français';
        const isSelected = Number(currentLangId) === Number(id);

        return `<option value="${id}" data-code="${code}" ${isSelected ? 'selected' : ''}>
            ${label.charAt(0).toUpperCase() + label.slice(1)}
        </option>`;
    }).join('');

    container.innerHTML = `
    <div class="profile-page">
        <form id="form-language" method="POST" action="../../../api/updater/updatePreferences.php">
            <div class="profile-block">
                <div class="profile-block-header">
                    <h3><i class="ti ti-language" aria-hidden="true"></i> ${__t('language')}</h3>
                </div>

                <div class="profile-form">
                    <div class="profile-field">
                        <label for="langue">${__t('interface language')}</label>
                        <select id="langue" name="tup_langue">
                            ${optionsHtml}
                        </select>
                    </div>
                </div>
            </div>

            <button type="submit" class="profile-btn-save">
                <i class="ti ti-device-floppy" aria-hidden="true"></i>
                ${__t('save')}
            </button>
        </form>
    </div>
    `;

    const form = document.getElementById('form-language');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const select = document.getElementById('langue');
        const selectedOption = select.options[select.selectedIndex];
        const langId = select.value;
        const langCode = selectedOption.getAttribute('data-code') || 'fr';

        try {
            const response = await fetch('../../../api/updater/updateLang.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    langue_id: langId,
                    lang_code: langCode
                })
            });

            const json = await response.json();

            if (json.success) {
                window.location.href = window.location.pathname + '?tab=language&t=' + Date.now();
            } else {
                //openToastNotif
            }
        } catch (err) {
            //openToastNotif
        }
    });
}