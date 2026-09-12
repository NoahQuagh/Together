function renderNotification(data){
    document.getElementById('setting-zone').innerHTML = `
    <div class="profile-page">

        <form id="form-notifications" method="POST" action="../api/updater/updatePreferences.php">

            <div class="profile-block">
                <div class="profile-block-header">
                    <h3><i class="ti ti-bell" aria-hidden="true"></i> ${__t('notifications')}</h3>
                </div>

                <div class="profile-form pref-toggle-list">

                    <label class="pref-toggle-card">
                        <div class="pref-card-header">
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_email" value="1" ${Number(data.notif_email) === 1 ? 'checked' : ''}>
                            </span>
                            <span class="pref-toggle-title">${__t('email notifications')}</span>
                        </div>
                        <p class="pref-toggle-desc">${__t('receive a summary by email')}</p>
                    </label>

                    <label class="pref-toggle-card">
                        <div class="pref-card-header">
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_mention" value="1" ${Number(data.notif_mention) === 1 ? 'checked' : ''}>
                            </span>
                            <span class="pref-toggle-title">${__t('mentions')}</span>
                        </div>
                        <p class="pref-toggle-desc">${__t('get notified when someone mentions you')}</p>
                    </label>

                    <label class="pref-toggle-card">
                        <div class="pref-card-header">
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_assignation" value="1" ${Number(data.notif_assignation) === 1 ? 'checked' : ''}>
                            </span>
                            <span class="pref-toggle-title">${__t('assignments')}</span>
                        </div>
                        <p class="pref-toggle-desc">${__t('get notified when a task is assigned to you')}</p>
                    </label>

                    <label class="pref-toggle-card">
                        <div class="pref-card-header">
                            <span class="pref-switch">
                                <input type="checkbox" name="notif_commentaire" value="1" ${Number(data.notif_commentaire) === 1 ? 'checked' : ''}>
                            </span>
                            <span class="pref-toggle-title">${__t('comments')}</span>
                        </div>
                        <p class="pref-toggle-desc">${__t('get notified of new comments on your tasks')}</p>
                    </label>
                    
                    <button type="submit" class="profile-btn-save">
                        <i class="ti ti-device-floppy" aria-hidden="true"></i>
                        ${__t('save')}
                    </button>
                </div>
            </div>
        </form>
    </div>
`;
    bindNotificationForm();
}
function renderAppearance(res) {
    const container = document.getElementById('setting-zone');
    if (!container) return;

    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    const currentTheme = data?.theme?.toLowerCase() ?? '';

    let initialTheme = '3';
    if (currentTheme === 'clair' || currentTheme === '1') initialTheme = '1';
    else if (currentTheme === 'sombre' || currentTheme === '2') initialTheme = '2';

    const initialValues = {
        theme: initialTheme,
        accent_color: String(data?.accent_color ?? ''),
        tasks_alert: Number(data?.tasks_alert) === 1
    };

    container.innerHTML = `
    <div class="profile-page">
        <form id="form-appearance" method="POST">
            <div class="profile-block">
                <div class="profile-block-header">
                    <h3><i class="ti ti-palette" aria-hidden="true"></i> ${__t('appearance')}</h3>
                </div>
 
                <div class="profile-form theme">
                
                    <div class="profile-field theme-selec">
                      <div class="theme-layout">
                        <div class="theme-title">
                            <label>${__t('interface theme')}</label>
                            <p>${__t('customize your application appereance')}</p>
                        </div>
                        <div class="pref-theme-options">
                            <div class="theme-picker">
                                <label class="theme-option">
                                    <input type="radio" name="theme" value="1" ${initialValues.theme === '1' ? 'checked' : ''}>
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
                                    <input type="radio" name="theme" value="2" ${initialValues.theme === '2' ? 'checked' : ''}>
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
                                    <input type="radio" name="theme" value="3" ${initialValues.theme === '3' ? 'checked' : ''}>
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
                    
                    <span class="separator-form"></span>
                    
                    <div class="profile-field">
                        <div class="theme-layout row">
                            <div class="theme-title">
                                <label>${__t('accent color')}</label>
                                <p>${__t('pick your platform\'s main color')}</p>
                            </div>
                            <div class="accent-color-picker">
                                ${res.accentList.map(c => `
                                    <label class="color-circle-option" title="${c.accent_color_label}">
                                        <input type="radio" name="accent_color" value="${c.accent_color_id}" ${Number(data.accent_color) === Number(c.accent_color_id) ? 'checked' : ''}>
                                        <span class="color-circle" style="background-color: ${c.accent_color};"></span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <span class="separator-form"></span>
                    
                    <div class="profile-field">
                        <div class="theme-layout row">
                            <div class="theme-title">
                                <label>${__t('Tâches en retard')}</label>
                                <p>${__t('Surbrillance de vos tâches en retard')}</p>
                            </div>
                            <input class="tk-alert" type="hidden" name="checkbox-tasks-alert" value="${initialValues.tasks_alert ? '1' : '0'}">
                            <span class="slider ${initialValues.tasks_alert ? 'active' : ''}"></span>
                        </div>
                    </div>
                    
                    <span class="separator-form"></span>
                    
                    <button type="submit" class="profile-btn-save apply-theme" disabled>
                        <i class="ti ti-brush" aria-hidden="true"></i>
                        ${__t('apply')}
                    </button> 
                </div>
            </div>
        </form>
    </div>
    `;

    bindPreferenceAcnt(initialValues);
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
        <form id="form-language" method="POST" action="../api/updater/updatePreferences.php">
            <div class="profile-block">
                <div class="profile-block-header">
                    <h3><i class="ti ti-language" aria-hidden="true"></i> ${__t('language')}</h3>
                </div>

                <div class="profile-form">
                
                    <div class="profile-field">
                        <div class="theme-layout row">
                            <div class="theme-title">
                                <label for="langue">${__t('interface language')}</label>
                                <p>${__t('select the language of the platform')}</p>
                            </div>
                            <select id="langue" name="tup_langue">
                                ${optionsHtml}
                            </select>
                        </div>    
                    </div>
                    
                     <button type="submit" class="profile-btn-save">
                        <i class="ti ti-device-floppy" aria-hidden="true"></i>
                        ${__t('save')}
                    </button>    
                       
                </div>
            </div>
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
            const response = await fetch('../api/updater/updateLang.php', {
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