<div class="profile-page">
<div id="news-zone">
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
    <span class="demo-caption" id="wait"><?= __tphp("we're rounding up the latest news... spoilers ahead") ?>.</span>
  </article>
</div>
</div>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../assets/docs/new.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du fichier texte');
                }
                return response.text();
            })
            .then(texteBrut => {
                const htmlFormate = marked.parse(texteBrut);
                document.getElementById('news-zone').innerHTML = htmlFormate;
            })
            .catch(erreur => {
                console.error(erreur);
                document.getElementById('news-zone').innerHTML = `<p class="error">${__t('unable to load content')}</p>`;
            });
    });
</script>
