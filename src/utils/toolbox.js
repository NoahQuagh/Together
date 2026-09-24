/* FORMAT DATE */
export function formatDate(dateInput, t) {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const rawLocale = t ? t('formatDate') : 'fr-FR';
    const locale = (rawLocale && rawLocale !== 'formatDate') ? rawLocale : 'fr-FR';

    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function formatDateTime(dateInput, t) {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const locale = t ? t('formatDate') : 'fr-FR';
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatForInput(dateStr) {
    if (!dateStr) return '';
    return dateStr.slice(0, 16).replace(' ', 'T');
}

export function initiales(nom) {
    if (!nom) return '';
    return nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

export function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* PRIORITÉ */
export function prioriteIcon(priorite) {
    const map = {
        critique: 'ti ti-alert-triangle',
        haute: 'ti ti-triangle',
        normale: 'ti ti-circle',
        basse: 'ti ti-triangle-inverted'
    };
    return map[priorite] ?? '';
}

export function prioriteColor(priorite) {
    const map = { critique: '#e04030', haute: '#d4901a', normale: '#5c90e8', basse: '#28b870' };
    return map[priorite] ?? '#7a7168';
}

export function prioriteBadge(prio) {
    const map = { critique: 'badge-red', haute: 'badge-yellow', normale: 'badge-blue' };
    return map[prio] || 'badge-green';
}

/* STATUT */
export function statutIcon(statut) {
    const map = {
        en_attente: 'ti ti-loader',
        en_cours: 'ti ti-circle-dashed',
        en_review: 'ti ti-telescope',
        termine: 'ti ti-circle-check'
    };
    return map[statut] ?? '';
}

export function statutBadge(statut) {
    switch (statut) {
        case 'actif':   return 'badge-green';
        case 'pause':   return 'badge-yellow';
        case 'termine': return 'badge-blue';
        default:        return 'badge-blue';
    }
}

/* NORMALISATION */
export function normalizeStatut(statut) {
    if (!statut) return '';
    const str = String(statut).toLowerCase().trim();

    if (str.includes('attente') || str.includes('todo') || str.includes('faire')) return 'attente';
    if (str.includes('cours') || str.includes('progress')) return 'encours';
    if (str.includes('review') || str.includes('revoir') || str.includes('verification')) return 'review';

    return str;
}

export function normalizePrio(prio) {
    if (!prio) return '';
    return String(prio).toLowerCase().trim();
}