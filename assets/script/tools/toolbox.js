const travaux = `
    <div class="wip-block block-trav">
        <div class="wip-icon-wrap">
            <i class="ti ti-crane" aria-hidden="true"></i>
            <span class="wip-badge">!</span>
        </div>
        <p class="wip-title">${__t('section under construction')}</p>
        <p class="wip-desc">${__t('this section is being developed and will be available soon')}</p>
        <div class="wip-dots">
            <div class="wip-dot"></div>
            <div class="wip-dot"></div>
            <div class="wip-dot"></div>
        </div>
    </div>`;


/*FORMAT DATE*/
function formatDate(dateInput) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';


    return date.toLocaleDateString(__t('formatDate'), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatDateTime(dateInput) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';


    return date.toLocaleDateString(__t('formatDate'), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatForInput(dateStr) {
    if (!dateStr) return '';
    return dateStr.slice(0, 16).replace(' ', 'T');
}



function initiales(nom) {
    return nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


/*PRIORITE*/
function prioriteIcon(priorite) {
    const map = { 'critique': '<i class="ti ti-alert-triangle"></i>', 'haute': '<i class="ti ti-triangle"></i>', 'normale': '<i class="ti ti-circle"></i>', 'basse': '<i class="ti ti-triangle-inverted"></i>' };
    return map[priorite] ?? '';
}

function prioriteColor(priorite) {
    const map = { 'critique': '#e04030', 'haute': '#d4901a', 'normale': '#5c90e8', 'basse': '#28b870' };
    return map[priorite] ?? '#7a7168';
}

function prioriteBadge(prio) {
    const map = { critique: 'badge-red', haute: 'badge-yellow', normale: 'badge-blue' };
    return map[prio] || 'badge-green';
}


/*STATUT*/
function statutIcon(priorite) {
    const map = { 'en_attente': '<i class="ti ti-loader"></i>', 'en_cours': '<i class="ti ti-circle-dashed"></i>', 'en_review': '<i class="ti ti-telescope"></i>', 'termine': '<i class="ti ti-circle-check"></i>' };
    return map[priorite] ?? '';
}

function statutBadge(statut) {
    switch (statut) {
        case 'actif':   return 'badge-green';
        case 'pause':   return 'badge-yellow';
        case 'termine': return 'badge-blue';
        default:        return 'badge-blue';
    }
}


/*NORMALISATION*/
function normalizeStatut(statut) {
    if (!statut) return '';
    const str = String(statut).toLowerCase().trim();

    if (str.includes('attente') || str.includes('todo') || str.includes('faire')) return 'attente';
    if (str.includes('cours') || str.includes('progress')) return 'encours';
    if (str.includes('review') || str.includes('revoir') || str.includes('verification')) return 'review';

    return str;
}

function normalizePrio(prio) {
    if (!prio) return '';
    return String(prio).toLowerCase().trim();
}



function checkTacheRetard(menuElement) {
    fetch('../api/loader/loadUserInfo.php')
        .then(res => res.json())
        .then(res => {
            if (res.success && Number(res.data.userTasksLate) === 1) {
                menuElement.classList.add('alert');
            } else {
                menuElement.classList.remove('alert');
            }
        })
}
