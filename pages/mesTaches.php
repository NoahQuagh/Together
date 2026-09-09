<article class="dash-page">
  <div id="dashboard-container">
    <div class="demo-item">
      <div class="tog-spinner">
        <div class="tog-bg"></div>
        <div class="tog-elements">
          <div class="tog-top">
            <div class="tog-bar-long"></div>
            <div class="tog-bar-short"></div>
          </div>
          <div class="tog-bottom">
            <div class="tog-block"></div>
            <div class="tog-block"></div>
          </div>
        </div>
      </div>
      <div class="tog-dots">
        <div class="tog-dot"></div>
        <div class="tog-dot"></div>
        <div class="tog-dot"></div>
      </div>
      <span class="demo-caption"><?= __tphp("we're listing your tasks... hang in there, there can't be that many of them") ?>.</span>
    </div>
  </div>
</article>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../api/loader/loadTasksUser.php')
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                renderMyTasks(res.data);
            })
            .catch(error => {
                const container = document.getElementById('dashboard-container');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>${__t('an error occurred while loading your projects')}.</p>
                        </div>
                    `;
                }
            });
    });
</script>
