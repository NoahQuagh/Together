# Together v1.0 — Bêta

> Première version publique de Together. L'application est en cours de développement actif — certaines fonctionnalités sont encore en construction.

---

## Nouveautés de cette version



### Dashboard
- Chiffres clés : tâches à faire, tâches en retard, tâches terminées ce mois, projets actifs
- Bloc **Mes tâches** — tâches assignées triées par priorité
- Bloc **En retard** — tâches dépassant leur deadline
- Bloc **Projets actifs** — avec tous les projets actuellement actifs
- Bloc **Sprints en cours** — sprints actifs sur les projets de l'utilisateur
- Bloc **Activité récente** — fil des dernières actions sur ses projets


---

### Mes projets
- Liste des projets créés par l'utilisateur
- Filtres : Tout, Actif, Pause, Terminé, Archivé
- Actions rapides : modifier, options, supprimer

---

### Contributions
- Liste des projets auxquels l'utilisateur participe sans en être le propriétaire
- Actions rapides : quitter le projet

---

### Mes tâches
- Vue centralisée de toutes les tâches assignées à l'utilisateur
- Filtres par statut, priorité
- Surbrillance de vos tâches en retard (désactivable dans les paramètres)
---

### Page projet
Navigation secondaire par projet avec les onglets :

#### Aperçu
- Résumé du projet, progression, sprint actif, membres

#### Tâches
- Liste des tâches du projet
- Cartes avec titre, statut, priorité, assigné, dates
- Badge par statut et priorité avec code couleur
- Tâches terminées en opacité réduite avec titre barré
- Modal **Voir détails** — description, assignés, étiquettes, dates, reporter
- Modal **Modifier** — formulaire de modification de la tâche *(en développement)*
- Bouton d'action contextuel selon le statut (Commencer / Valider / Terminer)

#### Kanban *(en développement)*
- Vue colonnes glissables par statut

#### Calendrier *(en développement)*
- Vue temporelle des deadlines

#### Sprints *(en développement)*
- Gestion des itérations, burndown chart

#### Membres *(en développement)*
- Liste des membres, rôles, invitation

#### Insights *(en développement)*
- Statistiques, vélocité, rapports

---

### Profil & Paramètres

#### Profil
- Affichage nom, prénom, e-mail, rôle, date d'inscription
- Statistiques : projets créés, tâches assignées, tâches terminées
- Modification des informations personnelles
- Changement de mot de passe
- Suppression de compte

#### Préférences
- Choix du thème : Clair, Sombre, Système
- Vue par défaut des tâches : Liste, Kanban, Calendrier
- Langue de l'interface : Français, Anglais *(en développement)*

#### Notifications
- Activer/désactiver les notifications par e-mail
- Activer/désactiver les notifications de mention
- Activer/désactiver les notifications d'assignation
- Activer/désactiver les notifications de commentaire

#### Sécurité *(en développement)*
- Sessions actives, historique de connexion, 2FA

#### Langue & région *(en développement)*
- Langue, format de date, fuseau horaire

#### Accessibilité *(en développement)*
- Réduction des animations, contraste élevé

#### Intégrations *(en développement)*
- GitHub, Slack, Google Calendar

#### Facturation *(en développement)*
- Plan, méthode de paiement, historique

---

### Notifications
- Centre de notifications in-app
- Types : mention, assignation, commentaire, invitation
- Marquage lu/non lu

---

### Messagerie *(en développement)*
- Conversations privées entre utilisateurs
- Groupes de discussion liés à un projet
- Messages texte, fichiers, images

---

### Internationalisation
- Interface disponible en **Français** et **Anglais**
- Système de dictionnaire PHP avec clés de traduction
- *(d'autres langues à venir)*

---

### Interface
- Thème sombre par défaut
- Thème clair et mode système disponibles
- Design system cohérent avec variables CSS
- Icônes **Tabler Icons**
- Sidebar de navigation avec animation au survol
- Header avec navigation secondaire par section
- Tooltips sur les boutons d'action
- Toasts de confirmation (succès / erreur)
- Modals de confirmation pour les actions sensibles
- Animations de chargement avec logo animé
- Responsive mobile


---

*Together v1.0.0 - bêta · Développé par Noah Quaghebeur*