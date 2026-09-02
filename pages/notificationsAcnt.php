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
            <span class="demo-caption" id="wait"><?= __tphp('we are preparing your notifications... nothing escapes our alerts') ?>.</span>
        </div>
    </div>
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
