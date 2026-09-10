/**
 * Affiche une notification Toast.
 * @param {string} titre - Le titre du toast
 * @param {'success' | 'error' | 'warning' | 'info' | 'neutral'} [type='info'] - Le type de notification
 * @param {string} [desc=''] - La description optionnelle
 */
function showToast(titre, type = 'info', desc = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ti-info-circle';

    switch (type) {
        case 'success':
            icon = 'ti-check';
            break;
        case 'error':
            icon = 'ti-alert-circle';
            break;
        case 'warning':
            icon = 'ti-alert-triangle';
            break;
        case 'info':
            icon = 'ti-info-square-rounded';
            break;
        default:
            icon = 'ti-bell';
    }

    if(desc === undefined){
        toast.innerHTML = `
        <div class="toast-icon">
            <i class="ti ${icon}"></i>
        </div>
        <div class="toast-content">
            <span class="toast-title">${titre}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.classList.add('hide')">
            <i class="ti ti-x"></i>
        </button>
    `;
    }else{
        toast.innerHTML = `
        <div class="toast-icon">
            <i class="ti ${icon}"></i>
        </div>
        <div class="toast-content">
            <span class="toast-title">${titre}</span>
            <span class="toast-desc">${desc}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.classList.add('hide')">
            <i class="ti ti-x"></i>
        </button>
    `;
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
