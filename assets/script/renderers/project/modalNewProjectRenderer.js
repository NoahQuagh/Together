let typeRessourceList = [];

function assignTypeRessource(data){
    typeRessourceList = data || [];
}

function selectClassicProject() {
    renderModalNewPro();

    const slider = document.getElementById('modalNP-slider');
    const backBtn = document.getElementById('btn-back-type');
    const confirmBtn = document.querySelector('.modal-footer .btn-confirm');

    if (slider) {
        slider.classList.remove('slide-right');
        slider.classList.add('slide-left');
    }

    if (backBtn) backBtn.classList.remove('is-hidden');
    if (confirmBtn) confirmBtn.removeAttribute('disabled');
}

function resetToTypeSelection() {
    const slider = document.getElementById('modalNP-slider');
    const backBtn = document.getElementById('btn-back-type');
    const confirmBtn = document.querySelector('.modal-footer .btn-confirm');
    const body = document.getElementById('step-form-content');


    if (slider && slider.classList.contains('slide-left')) {
        slider.classList.remove('slide-left');
        slider.classList.add('slide-right');
    }

    if (backBtn) backBtn.classList.add('is-hidden');
    if (confirmBtn) confirmBtn.setAttribute('disabled', 'true');
    if (body) body.innerHTML=``;

}

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        resetToTypeSelection()
    }
});

const originalCloseModal = window.closeModal;
window.closeModal = function(modalId) {
    if (modalId === 'modalNewProject') {
        const slider = document.getElementById('modalNP-slider');
        const backBtn = document.getElementById('btn-back-type');
        const confirmBtn = document.querySelector('.modal-footer .btn-confirm');

        if (slider) {
            slider.classList.remove('slide-left', 'slide-right');
        }
        if (backBtn) backBtn.classList.add('is-hidden');
        if (confirmBtn) confirmBtn.setAttribute('disabled', 'true');
    }

    if (typeof originalCloseModal === 'function') {
        originalCloseModal(modalId);
    }
};

async function renderModalNewPro() {
    const body = document.getElementById('step-form-content');
    if (!body) return;


    let projectUuid = '';
    let projectLink = 'Lien indisponible';

    try {
        const response = await fetch('../assets/script/project/uuidGenerator.php', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('network_error');

        const data = await response.json();

        if (data && data.exists) {
            projectUuid = data.pro_uuid || '';
            projectLink = data.pro_path || projectLink;
        }
    } catch (error) {
        console.error('Impossible de générer le lien du projet :', error);
    }

    body.innerHTML = `
    <div class="form-new-pro">
      <form id="form-create-project" class="project-form">
        <input type="hidden" id="project-uuid" name="project_uuid" value="${projectUuid}">

        <div class="form-group">
          <label for="project-name" class="form-label">Nom du projet</label>
          <input
            type="text"
            id="project-name"
            name="project_name"
            class="form-input"
            placeholder="Ex: Mon projet"
            required
          />
        </div>

        <div class="form-group">
          <label for="project-desc" class="form-label">Description</label>
          <textarea
            id="project-desc"
            name="project_desc"
            class="form-textarea"
            rows="3"
            placeholder="Décrivez les objectifs du projet..."
          ></textarea>
        </div>

        <div class="form-col">
          <div class="form-group">
            <label for="project-start" class="form-label">Date de début</label>
            <input
              type="datetime-local"
              id="project-start"
              name="project_start"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="project-end" class="form-label">Date de fin</label>
            <input
              type="datetime-local"
              id="project-end"
              name="project_end"
              class="form-input"
            />
          </div>
        </div>
        
        <div class="form-group">
              <label class="form-label">Ressource du projet</label>
              
              <div class="resource-input-group">
                <input 
                  type="text" 
                  id="project-resource-name" 
                  name="resource_nom" 
                  class="form-input" 
                  placeholder="Ex: Documentation API"
                />
            
                <div class="custom-select-wrapper" id="custom-res-select">
                  <input type="hidden" id="project-resource-type" name="resource_type_id" value="${typeRessourceList[0]?.typeResId || ''}">
            
                  <div class="custom-select-trigger" onclick="toggleCustomSelect(event, 'custom-res-select')">
                    <span class="selected-option">
                      ${typeRessourceList.length ? `<i class="ti ti-${typeRessourceList[0].typeResIcon}"></i>` : ''}
                    </span>
                    <i class="ti ti-chevron-down arrow-icon"></i>
                  </div>
            
                  <div class="custom-select-options">
                    ${typeRessourceList.map(r => `
                      <div class="custom-option" onclick="selectCustomOption(event, 'custom-res-select', '${r.typeResId}', '${r.typeResNom}', '${r.typeResIcon}')">
                        <i class="ti ti-${r.typeResIcon}"></i>
                        <span>${r.typeResNom}</span>
                      </div>
                    `).join('')}
                  </div>
                </div></div>
                
              <div class="resource-input-group">
                    <input 
                      type="text" 
                      id="project-resource-link" 
                      name="resource_link" 
                      class="form-input" 
                      placeholder="Ex: https://github.com/myName/myProject"
                    />  
                    
                  <button class="btn-invite" type="button" onclick="">
                      <i class="ti ti-plus"></i>
                      <span>Ajouter</span>
                  </button> 
              </div>  
        </div>
      </form>

      <div class="invite-zone">
        <h3>Partager</h3>

        <div class="form-group form-group-inline">
          <div class="toggle-wrapper">
            <div class="content-link">
              <i class="ti ti-world" aria-hidden="true"></i>
              <div class="text-form-col">
                <label for="project-highlight-toggle" class="form-label">Public</label>
                <p>Toute personne avec le lien peut accéder</p>
              </div>
            </div>
            <label class="switch">
              <input type="checkbox" id="project-highlight-toggle" name="project_highlight_enabled" onchange="toggleMembersZone(this)">
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <div class="project-link-zone">
          <label class="form-label">Lien du projet</label>
          <div class="copy-input-wrapper">
            <p id="project-copy-link" class="link-pro">${projectLink}</p>
            <button type="button" class="btn-copy" onclick="copyProjectLink()" title="Copier le lien">
              <i class="ti ti-copy" id="copy-icon"></i>
            </button>
          </div>
        </div>

        <div class="members-selection-zone" id="members-selection-zone">

          <label class="form-label">Inviter</label>

          <form class="member-search-wrapper">
            <input type="email" id="member-search-input" class="form-input" placeholder="Email du membre...">
            <button class="btn-invite" type="button" onclick="addMember()">
              <i class="ti ti-location-plus"></i>
              <span>Inviter</span>
            </button>
          </form>

          <div class="selected-members-list" id="selected-members-list"></div>

        </div>

      </div>
    </div>
    `;

    const toggleInput = document.getElementById('project-highlight-toggle');
    if (toggleInput) {
        toggleMembersZone(toggleInput);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('../api/loader/loadRessourceType.php')
        .then(res => res.json())
        .then(res => {
            if (!res.success) {
                throw new Error(res.message);
            }
            assignTypeRessource(res.data);
        })
        .catch(error => {

        });
});

function toggleCustomSelect(event, wrapperId) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const isOpen = wrapper.classList.contains('is-open');

    document.querySelectorAll('.custom-select-wrapper').forEach(el => {
        el.classList.remove('is-open');
    });

    if (!isOpen) {
        wrapper.classList.add('is-open');
    }
}

function selectCustomOption(event, wrapperId, value, name, icon) {
    if (event) event.stopPropagation();

    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const hiddenInput = wrapper.querySelector('input[type="hidden"]');
    if (hiddenInput) hiddenInput.value = value;

    const trigger = wrapper.querySelector('.selected-option');
    if (trigger) {
        trigger.innerHTML = `<i class="ti ti-${icon}"></i>`;
    }

    wrapper.classList.remove('is-open');
}

window.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper').forEach(el => el.classList.remove('is-open'));
    }
});