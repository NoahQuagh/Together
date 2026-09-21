<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Erreur de connexion - Together</title>
    <link rel="stylesheet" href="../assets/style/paletteStyle.css">
    <style>
        body {
            background-color: var(--color-main-primary, #0e0d0c);
            color: var(--color-second-primary, #f2ede6);
            font-family: var(--font-text, sans-serif);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .error-card {
            background: var(--color-main-secondary, #131313);
            border: 1px solid var(--color-main-quaternary, #252320);
            padding: var(--space-xl, 2rem);
            border-radius: var(--radiusBox-md, 14px);
            max-width: 400px;
            box-shadow: var(--boxshadow-white-s);
        }
        .btn-retry {
            display: inline-block;
            margin-top: var(--space-base, 1rem);
            padding: 0.75rem 1.5rem;
            background: var(--accent, #226db8);
            color: #fff;
            border-radius: var(--radiusBox-sm, 7px);
            cursor: pointer;
        }
    </style>
</head>
<body>
<div class="error-card">
    <h2>Connexion à la BDD impossible</h2>
    <p>Le serveur de base de données est actuellement inaccessible.</p>
    <a href="../app/home.php" class="btn-retry">Réessayer</a>
</div>
</body>
</html>