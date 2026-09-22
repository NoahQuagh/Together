function toggleMembersZone(checkbox) {
    const membersZone = document.getElementById('members-selection-zone');
    if (!membersZone) return;

    if (checkbox.checked) {
        membersZone.classList.add('is-hidden');
    } else {
        membersZone.classList.remove('is-hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleInput = document.getElementById('project-highlight-toggle');
    if (toggleInput) {
        toggleMembersZone(toggleInput);
    }
});

function copyProjectLink() {
    const linkInput = document.getElementById('project-copy-link');
    if (!linkInput) return;

    navigator.clipboard.writeText(linkInput.textContent).then(() => {
        const icon = document.getElementById('copy-icon');
        if (icon) {
            icon.className = 'ti ti-check';
            setTimeout(() => {
                icon.className = 'ti ti-copy';
            }, 2000);
        }
        if (typeof showToast === 'function') {
            showToast('Lien copié dans le presse-papier !', 'info');
        }
    });
}
function createProject(){}

function addRessource() {
    const inputNameRes = document.getElementById('project-resource-name');
    const inputLinkRes = document.getElementById('project-resource-link');
    const inputTypeRes = document.getElementById('project-resource-type');
    const ressourceList = document.getElementById('selected-ressource-list');

    const valueName = inputNameRes.value.trim();
    const valueLink = inputLinkRes.value.trim();
    const valueTypeId = inputTypeRes ? inputTypeRes.value : '';

    if (valueName === '') return;

    const chip = document.createElement('div');
    chip.className = 'member-chip';
    chip.dataset.linkRes = valueLink;
    chip.dataset.iconId = valueTypeId;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = valueName;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-chip';
    removeBtn.title = 'Retirer';
    removeBtn.setAttribute('aria-label', 'Retirer cette ressource');
    removeBtn.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';

    removeBtn.addEventListener('click', () => chip.remove());

    chip.appendChild(nameSpan);
    chip.appendChild(removeBtn);
    ressourceList.appendChild(chip);

    inputNameRes.value = '';
    inputLinkRes.value = '';
}

function addMember() {
    const inputElement = document.getElementById('member-search-input');
    const memberList = document.getElementById('selected-members-list');

    const value = inputElement.value.trim();

    if (value === '') return;

    const alreadyAdded = Array.from(memberList.children).some(
        (chip) => chip.dataset.email === value
    );
    if (alreadyAdded) {
        inputElement.value = '';
        return;
    }

    const chip = document.createElement('div');
    chip.className = 'member-chip';
    chip.dataset.email = value;

    const emailSpan = document.createElement('span');
    emailSpan.textContent = value;

    const statusSpan = document.createElement('span');
    statusSpan.className = 'member-status';
    statusSpan.innerHTML = '<span class="loader"></span>';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-chip';
    removeBtn.title = 'Retirer';
    removeBtn.setAttribute('aria-label', 'Retirer ce membre');
    removeBtn.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
    removeBtn.addEventListener('click', () => chip.remove());

    chip.appendChild(emailSpan);
    chip.appendChild(statusSpan);
    chip.appendChild(removeBtn);
    memberList.appendChild(chip);

    inputElement.value = '';

    checkMemberEmail(value, chip, statusSpan);
}

function buildStatusIcon(iconClass, tooltipText) {
    if (!tooltipText) {
        return `<i class="${iconClass}" aria-hidden="true"></i>`;
    }
    return `
        <span class="tooltip-container">
            <i class="${iconClass}" aria-hidden="true"></i>
            <span class="tooltip-text">${escapeHtml(tooltipText)}</span>
        </span>
    `;
}

function checkMemberEmail(email, chip, statusSpan) {
    const params = new URLSearchParams({ email });

    fetch('../api/validator/checkMember.php?' + params.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    })
        .then((response) => {
            if (!response.ok) throw new Error('network_error');
            return response.json();
        })
        .then((data) => {
            const found = !!(data && data.exists);

            chip.classList.toggle('is-valid', found);
            chip.classList.toggle('is-invalid', !found);

            if (found) {
                statusSpan.innerHTML = buildStatusIcon('ti ti-check');
                if (data.user_id) {
                    chip.dataset.userId = data.user_id;
                }
            } else {
                const message = (data && data.message)
                    ? data.message
                    : "Aucun compte associé à cet email.";
                statusSpan.innerHTML = buildStatusIcon('ti ti-exclamation-mark', message);
            }
        })
        .catch(() => {
            chip.classList.add('is-invalid');
            statusSpan.innerHTML = buildStatusIcon(
                'ti ti-exclamation-mark',
                "Impossible de vérifier cet email pour le moment."
            );
        });
}