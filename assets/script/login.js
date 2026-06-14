
function togglePwd(id, btn) {
    const inp  = document.getElementById(id);
    const icon = btn.querySelector('i');
    inp.type   = inp.type === 'password' ? 'text' : 'password';
    icon.className = inp.type === 'text' ? 'ti ti-eye-off' : 'ti ti-eye';
}

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
        { w:'25%',  cls:'str--1',  txt:'Faible' },
        { w:'50%',  cls:'str--2',  txt:'Correct' },
        { w:'75%',  cls:'str--3',  txt:'Bon' },
        { w:'100%', cls:'str--4',  txt:'Excellent' },
    ];
    bar.style.width  = cfg[s].w;
    bar.className    = 'str-bar ' + cfg[s].cls;
    lbl.textContent  = cfg[s].txt;
    lbl.className    = 'str-label ' + cfg[s].cls;
}

const stage   = document.getElementById('authStage');
const fLogin  = document.getElementById('fLogin');
const fReg    = document.getElementById('fRegister');

const initForm = window.__authInit || 'login';
if (initForm === 'register') {
    fReg.style.transform       = 'translateX(0)';
    fReg.style.opacity         = '1';
    fLogin.style.transform     = 'translateX(-60px)';
    fLogin.style.opacity       = '0';
    fLogin.style.pointerEvents = 'none';
    stage.dataset.active       = 'register';
} else {
    fReg.style.transform = 'translateX(60px)';
    fReg.style.opacity   = '0';
}

document.querySelectorAll('.auth-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target  = btn.dataset.target;
        const toReg   = target === 'register';
        const current = toReg ? fLogin  : fReg;
        const next    = toReg ? fReg    : fLogin;
        const outX    = toReg ? '-60px' : '60px';
        const inX     = toReg ? '60px'  : '-60px';

        current.style.transition = 'transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease';
        current.style.transform  = `translateX(${outX})`;
        current.style.opacity    = '0';
        current.style.pointerEvents = 'none';

        triggerGridPulse(toReg ? 'blue' : 'green');

        /* -- Entrée du suivant -- */
        next.style.transition = 'none';
        next.style.transform  = `translateX(${inX})`;
        next.style.opacity    = '0';
        next.classList.remove('auth-form-wrap--off');

        requestAnimationFrame(() => requestAnimationFrame(() => {
            next.style.transition   = 'transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease';
            next.style.transform    = 'translateX(0)';
            next.style.opacity      = '1';
            next.style.pointerEvents = '';
        }));

        stage.dataset.active = target;
    });
});

function triggerGridPulse(color) {
    const el = document.getElementById('gridPulse');
    el.className = 'grid-pulse grid-pulse--' + color;
    el.style.animation = 'none';
    requestAnimationFrame(() => {
        el.style.animation = '';
        el.classList.add('grid-pulse--active');
    });
    setTimeout(() => el.classList.remove('grid-pulse--active'), 900);
}

const gridEl = document.querySelector('.grid-lines');
const COLS = 14, ROWS = 10;
let html = '';
for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const delay = ((r * COLS + c) * 37 % 1800) + 'ms';
        html += `<span class="gdot" style="--d:${delay}"></span>`;
    }
}
gridEl.innerHTML = html;