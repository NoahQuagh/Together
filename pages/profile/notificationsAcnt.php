<article class="section-loading">
  <div class="sp-wrap">

    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
      <div class="sp-stage lg">
        <div class="sp-card sp-card-1"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
        <div class="sp-card sp-card-2"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
        <div class="sp-card sp-card-3"><div class="sp-card-line"></div><div class="sp-card-line short"></div></div>
      </div>
    </div>

  </div>
  <span class="demo-caption" id="wait"><?= __tphp('we are preparing your notifications... nothing escapes our alerts') ?>.</span>
</article>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../api/loader/loadPreference.php')
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message);
                }else{
                    renderNotification(res.data);
                }
            })
            .catch(error => {
                const container = document.getElementById('dashboard-container');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>${__t('an error occurred while loading your preferences')}.</p>
                        </div>
                    `;
                }
            });
    });
</script>
