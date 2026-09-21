/**
 * Affiche le mot de passe
 * @param id
 * @param btn
 */
function togglePwd(id, btn) {
    const inp  = document.getElementById(id);
    const icon = btn.querySelector('i');
    inp.type   = inp.type === 'password' ? 'text' : 'password';
    icon.className = inp.type === 'text' ? 'ti ti-eye-off' : 'ti ti-eye';
}

/**
 * Affiche la complexiter du mot de passe
 * @param v mot de passe saissi
 */
function updateStrength(v) {
    const bar   = document.getElementById('strBar');
    const lbl   = document.getElementById('strLabel');
    if (!bar) return;
    let s = 0;
    if (v.length >= 8)           s++;
    if (/[A-Z]/.test(v))         s++;
    if (/[0-9]/.test(v))         s++;
    if (/[^A-Za-z0-9]/.test(v))  s++;
    const cfg = [
        { w:'0%',   cls:'',        txt:'' },
        { w:'25%',  cls:'str--1',  txt:__t('weak') },
        { w:'50%',  cls:'str--2',  txt:__t('correct') },
        { w:'75%',  cls:'str--3',  txt:__t('good') },
        { w:'100%', cls:'str--4',  txt:__t('excellent') },
    ];
    bar.style.width  = cfg[s].w;
    bar.className    = 'str-bar ' + cfg[s].cls;
    lbl.textContent  = cfg[s].txt;
    lbl.className    = 'str-label ' + cfg[s].cls;
}


