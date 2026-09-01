
let currentCalendarTasks = [];
let ganttInstance = null;

function renderProjectCalendar(data)  {
    const calendarContainer = document.getElementById('calendar-id');
    if (!calendarContainer) return;
    currentCalendarTasks = data.tasks || (data.data && data.data.tasks) || [];
    calendarContainer.innerHTML = `
      <div id="view-vertical" class="calendar-container"></div>
      <div id="view-horizontal" class="gantt-container" style="display: none;"><svg id="gantt"></svg></div>
    
    `;
    ganttInstance = null;
    fullCalendar(currentCalendarTasks);
}

document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById('btn-toggle-view');

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function() {
        const verticalView = document.getElementById('view-vertical');
        const horizontalView = document.getElementById('view-horizontal');
        const labelSpan = document.getElementById('view-label');

        if (!verticalView || !horizontalView) return;

        const currentView = this.getAttribute('data-view');

        if (currentView === 'vertical') {
            verticalView.style.display = 'none';
            horizontalView.style.display = 'block';
            this.setAttribute('data-view', 'horizontal');

            const icon = this.querySelector('i');
            if (icon) icon.className = 'ti ti-layout-bottombar';
            if (labelSpan) labelSpan.textContent = __t('vertical view');
            granttCalendar(currentCalendarTasks);

        } else {
            horizontalView.style.display = 'none';
            verticalView.style.display = 'block';
            this.setAttribute('data-view', 'vertical');

            const icon = this.querySelector('i');
            if (icon) icon.className = 'ti ti-layout-sidebar';
            if (labelSpan) labelSpan.textContent = __t('horizontal view');
            fullCalendar(currentCalendarTasks);
        }
    });
});


function fullCalendar(tasks = currentCalendarTasks) {
    const calendarEl = document.getElementById('view-vertical');
    if (!calendarEl) return;

    // Transformation du JSON API -> Format FullCalendar
    const events = tasks.map(t => {
        const colorMap = {
            'critique': '#e04030',
            'haute': '#d4901a',
            'normale': '#5c90e8',
            'basse': '#28b870'
        };

        return {
            id: String(t.id),
            title: t.titre,
            start: t.date_debut ? t.date_debut.replace(' ', 'T') : null,
            end: t.date_fin ? t.date_fin.replace(' ', 'T') : null,
            backgroundColor: colorMap[t.priorite] || '#5c90e8',
            borderColor: 'transparent',
            extendedProps: {
                statut: t.statut,
                priorite: t.priorite,
                reporter: t.reporter,
                desc: t.desc
            }
        };
    }).filter(e => e.start); // Filtre les tâches sans date de début

    // Nettoyage si un calendrier existait déjà
    calendarEl.innerHTML = '';

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: events,
        eventClick: function(info) {
            // Ouverture de la modale de détails si fonction globale disponible
            if (typeof openModal === 'function') {
                openModal(`modal-task-${info.event.id}`);
            } else {
                alert(`Tâche : ${info.event.title}`);
            }
        }
    });

    calendar.render();
}

/**
 * Rendu Frappe Gantt (Vue horizontale)
 */
function granttCalendar(tasks = currentCalendarTasks) {
    const ganttEl = document.getElementById('gantt');
    if (!ganttEl) return;

    // Transformation du JSON API -> Format Frappe Gantt
    const formattedTasks = tasks.map(t => {
        // Date par défaut si absente
        const todayStr = new Date().toISOString().split('T')[0];
        let startDate = t.date_debut ? t.date_debut.split(' ')[0] : todayStr;
        let endDate = t.date_fin ? t.date_fin.split(' ')[0] : startDate;

        // Sécurité : la date de fin doit être >= date de début
        if (new Date(endDate) < new Date(startDate)) {
            endDate = startDate;
        }

        // Calcul du pourcentage d'avancement selon le statut
        let progress = 0;
        if (t.statut === 'termine') progress = 100;
        else if (t.statut === 'en_review') progress = 85;
        else if (t.statut === 'en_cours') progress = 50;

        return {
            id: String(t.id),
            name: t.titre,
            start: startDate,
            end: endDate,
            progress: progress
        };
    }).filter(t => t.start && t.end);

    if (formattedTasks.length === 0) {
        ganttEl.parentElement.innerHTML = `<div class="dash-empty"><p>${__t('no tasks found')}</p></div>`;
        return;
    }

    // Réinitialise le SVG pour éviter les superpositions au redessin
    ganttEl.innerHTML = '';
    ganttInstance = null;

    // Création du Diagramme de Gantt
    ganttInstance = new Gantt("#gantt", formattedTasks, {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 25,
        bar_corner_radius: 6,
        arrow_curve: 5,
        padding: 18,
        view_mode: 'Day',
        language: 'fr',
        on_click: function (task) {
            if (typeof openModal === 'function') {
                openModal(`modal-task-${task.id}`);
            }
        }
    });
}


