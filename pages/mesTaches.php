<article class="dash-page">
  <div id="dashboard-container">
    <article class="section-loading-center">
      <div class="sp-wrap">

        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <div class="sp-stage lg">
            <div class="sp-card sp-card-1"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
            <div class="sp-card sp-card-2"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
            <div class="sp-card sp-card-3"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
          </div>
        </div>

      </div>
      <span class="demo-caption"><?= __tphp("we're listing your tasks... hang in there, there can't be that many of them") ?>.</span>
    </article>
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
