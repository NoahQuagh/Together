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
  <span class="demo-caption" id="wait"><?= __tphp('loading') ?>.</span>
</article>
<script>document.addEventListener("DOMContentLoaded", function() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectUuid = urlParams.get('key');
        fetch(`../api/loader/loadProject.php?project=${encodeURIComponent(projectUuid)}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                renderProjectSprints(res.data);
            })
            .catch(error => {
                const container = document.getElementById('main-zone');
                if (container) {
                    container.innerHTML = `
                        <div class="dash-error-msg">
                            <i class="ti ti-face-id-error"></i>
                            <p>${__t('an error occurred while loading the data')}.</p>
                        </div>
                    `;
                }
            });
    });</script>

