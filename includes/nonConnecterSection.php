<section class="nonConnecter">
    <div class="nonConnecter-card">

        <div class="nonConnecter-icon">
            <i class="ti ti-lock" aria-hidden="true"></i>
        </div>

        <h1><?= __tphp('you are not logged in') ?></h1>
        <p><?= __tphp('log in to access your projects and collaborate with your team') ?>.</p>

        <button class="btn-connexion" onclick="window.location.href='../auth/login.php'">
            <i class="ti ti-user" aria-hidden="true"></i>
          <?= __tphp('login') ?> / <?= __tphp('registration') ?>
        </button>

    </div>
</section>
