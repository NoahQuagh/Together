-- =====================================================
--  TOGETHER — Script de création de base de données
--  Convention : TOG_ + nom table
--               colonnes préfixées par abrév. table
--  Compatible MariaDB 10.x+
-- =====================================================

CREATE DATABASE IF NOT EXISTS together
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE together;

-- =====================================================
--  TABLES DE RÉFÉRENCE 
-- =====================================================

CREATE TABLE TOG_REF_ROLE_USER (
    rru_id      INT          NOT NULL AUTO_INCREMENT,
    rru_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rru_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_ROLE_USER (rru_id, rru_label) VALUES
(1, 'admin'),
(2, 'membre');

CREATE TABLE TOG_REF_ROLE_PROJET (
    rrp_id      INT          NOT NULL AUTO_INCREMENT,
    rrp_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rrp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_ROLE_PROJET (rrp_id, rrp_label) VALUES
(1, 'proprietaire'),
(2, 'editeur'),
(3, 'lecteur');

CREATE TABLE TOG_REF_STATUT_PROJET (
    rsp_id      INT          NOT NULL AUTO_INCREMENT,
    rsp_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rsp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_STATUT_PROJET (rsp_id, rsp_label) VALUES
(1, 'actif'),
(2, 'pause'),
(3, 'termine'),
(4, 'archive');

CREATE TABLE TOG_REF_STATUT_SPRINT (
    rss_id      INT          NOT NULL AUTO_INCREMENT,
    rss_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rss_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_STATUT_SPRINT (rss_id, rss_label) VALUES
(1, 'planifie'),
(2, 'actif'),
(3, 'termine');

CREATE TABLE TOG_REF_STATUT_TACHE (
    rst_id      INT          NOT NULL AUTO_INCREMENT,
    rst_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rst_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_STATUT_TACHE (rst_id, rst_label) VALUES
(1, 'a_faire'),
(2, 'en_cours'),
(3, 'review'),
(4, 'termine');

CREATE TABLE TOG_REF_PRIORITE (
    rpr_id      INT          NOT NULL AUTO_INCREMENT,
    rpr_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rpr_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_PRIORITE (rpr_id, rpr_label) VALUES
(1, 'basse'),
(2, 'normale'),
(3, 'haute'),
(4, 'critique');

CREATE TABLE TOG_REF_TYPE_NOTIF (
    rtn_id      INT          NOT NULL AUTO_INCREMENT,
    rtn_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rtn_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_TYPE_NOTIF (rtn_id, rtn_label) VALUES
(1, 'mention'),
(2, 'assignation'),
(3, 'commentaire'),
(4, 'invitation');

CREATE TABLE TOG_REF_TYPE_CONV (
    rtc_id      INT          NOT NULL AUTO_INCREMENT,
    rtc_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rtc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_TYPE_CONV (rtc_id, rtc_label) VALUES
(1, 'prive'),
(2, 'groupe');

CREATE TABLE TOG_REF_TYPE_MESSAGE (
    rtm_id      INT          NOT NULL AUTO_INCREMENT,
    rtm_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rtm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_TYPE_MESSAGE (rtm_id, rtm_label) VALUES
(1, 'texte'),
(2, 'fichier'),
(3, 'image');

CREATE TABLE TOG_REF_STATUT_SUGGESTION (
    rssu_id     INT          NOT NULL AUTO_INCREMENT,
    rssu_label  VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rssu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_STATUT_SUGGESTION (rssu_id, rssu_label) VALUES
(1, 'en_attente'),
(2, 'en_etude'),
(3, 'accepte'),
(4, 'refuse');

CREATE TABLE TOG_REF_STATUT_BUG (
    rsb_id      INT          NOT NULL AUTO_INCREMENT,
    rsb_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rsb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_STATUT_BUG (rsb_id, rsb_label) VALUES
(1, 'ouvert'),
(2, 'en_cours'),
(3, 'resolu'),
(4, 'ferme');

CREATE TABLE TOG_REF_TYPE_ACTIVITE (
    rta_id      INT          NOT NULL AUTO_INCREMENT,
    rta_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_TYPE_ACTIVITE (rta_id, rta_label) VALUES
(1,  'tache_creee'),
(2,  'tache_modifiee'),
(3,  'tache_terminee'),
(4,  'tache_assignee'),
(5,  'commentaire_ajoute'),
(6,  'membre_ajoute'),
(7,  'membre_retire'),
(8,  'projet_cree'),
(9,  'projet_archive'),
(10, 'sprint_demarre'),
(11, 'sprint_termine');

CREATE TABLE TOG_REF_THEME (
    rth_id      INT          NOT NULL AUTO_INCREMENT,
    rth_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rth_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_THEME (rth_id, rth_label) VALUES
(1, 'clair'),
(2, 'sombre'),
(3, 'systeme');

CREATE TABLE TOG_REF_VUE_TACHE (
    rvt_id      INT          NOT NULL AUTO_INCREMENT,
    rvt_label   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (rvt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TOG_REF_VUE_TACHE (rvt_id, rvt_label) VALUES
(1, 'liste'),
(2, 'kanban'),
(3, 'calendrier');

-- =====================================================
--  TABLES PRINCIPALES
-- =====================================================

-- TOG_USERS

CREATE TABLE TOG_USERS (
    use_id          INT          NOT NULL AUTO_INCREMENT,
    use_nom         VARCHAR(100) NOT NULL,
    use_prenom      VARCHAR(100) NOT NULL,
    use_email       VARCHAR(180) NOT NULL,
    use_mot_de_passe VARCHAR(255) NOT NULL,
    use_role_id     INT          NOT NULL DEFAULT 2,
    use_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (use_id),
    UNIQUE KEY uq_use_email (use_email),
    CONSTRAINT fk_use_role FOREIGN KEY (use_role_id) REFERENCES TOG_REF_ROLE_USER(rru_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_USER_PREFERENCES

CREATE TABLE TOG_USER_PREFERENCES (
    tup_user_id         INT      NOT NULL,
    tup_theme_id        INT      NOT NULL DEFAULT 3,
    tup_langue          VARCHAR(10) NOT NULL DEFAULT 'fr',
    tup_notif_email     TINYINT(1) NOT NULL DEFAULT 1,
    tup_notif_mention   TINYINT(1) NOT NULL DEFAULT 1,
    tup_notif_assignation TINYINT(1) NOT NULL DEFAULT 1,
    tup_notif_commentaire TINYINT(1) NOT NULL DEFAULT 1,
    tup_vue_tache_id    INT      NOT NULL DEFAULT 2,
    tup_updated_at      DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (tup_user_id),
    CONSTRAINT fk_tup_user  FOREIGN KEY (tup_user_id)      REFERENCES TOG_USERS(use_id)         ON DELETE CASCADE,
    CONSTRAINT fk_tup_theme FOREIGN KEY (tup_theme_id)     REFERENCES TOG_REF_THEME(rth_id),
    CONSTRAINT fk_tup_vue   FOREIGN KEY (tup_vue_tache_id) REFERENCES TOG_REF_VUE_TACHE(rvt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_PROJECTS

CREATE TABLE TOG_PROJECTS (
    pro_id          INT          NOT NULL AUTO_INCREMENT,
    pro_uuid	    CHAR(36)	 NOT NULL UNIQUE,
    pro_owner_id    INT          NOT NULL,
    pro_nom         VARCHAR(150) NOT NULL,
    pro_description TEXT             NULL DEFAULT NULL,
    pro_statut_id   INT          NOT NULL DEFAULT 1,
    pro_date_debut  DATETIME         NULL DEFAULT NULL,
    pro_date_fin    DATETIME         NULL DEFAULT NULL,
    pro_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (pro_id),
    CONSTRAINT fk_pro_owner  FOREIGN KEY (pro_owner_id)  REFERENCES TOG_USERS(use_id)             ON DELETE CASCADE,
    CONSTRAINT fk_pro_statut FOREIGN KEY (pro_statut_id) REFERENCES TOG_REF_STATUT_PROJET(rsp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_PROJECT_MEMBERS

CREATE TABLE TOG_PROJECT_MEMBERS (
    tpm_id          INT          NOT NULL AUTO_INCREMENT,
    tpm_project_id  INT          NOT NULL,
    tpm_user_id     INT          NOT NULL,
    tpm_role_id     INT          NOT NULL DEFAULT 3,
    tpm_joined_at   DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (tpm_id),
    UNIQUE KEY uq_tpm (tpm_project_id, tpm_user_id),
    CONSTRAINT fk_tpm_project FOREIGN KEY (tpm_project_id) REFERENCES TOG_PROJECTS(pro_id)          ON DELETE CASCADE,
    CONSTRAINT fk_tpm_user    FOREIGN KEY (tpm_user_id)    REFERENCES TOG_USERS(use_id)             ON DELETE CASCADE,
    CONSTRAINT fk_tpm_role    FOREIGN KEY (tpm_role_id)    REFERENCES TOG_REF_ROLE_PROJET(rrp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_SPRINTS

CREATE TABLE TOG_SPRINTS (
    spr_id          INT          NOT NULL AUTO_INCREMENT,
    spr_project_id  INT          NOT NULL,
    spr_nom         VARCHAR(100) NOT NULL,
    spr_statut_id   INT          NOT NULL DEFAULT 1,
    spr_date_debut  DATETIME     NOT NULL,
    spr_date_fin    DATETIME     NOT NULL,

    PRIMARY KEY (spr_id),
    CONSTRAINT fk_spr_project FOREIGN KEY (spr_project_id) REFERENCES TOG_PROJECTS(pro_id)           ON DELETE CASCADE,
    CONSTRAINT fk_spr_statut  FOREIGN KEY (spr_statut_id)  REFERENCES TOG_REF_STATUT_SPRINT(rss_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_TASKS

CREATE TABLE TOG_TASKS (
    tas_id          INT          NOT NULL AUTO_INCREMENT,
    tas_project_id  INT          NOT NULL,
    tas_sprint_id   INT              NULL DEFAULT NULL,
    tas_assignee_id INT              NULL DEFAULT NULL,
    tas_reporter_id INT          NOT NULL,
    tas_titre       VARCHAR(200) NOT NULL,
    tas_description TEXT             NULL DEFAULT NULL,
    tas_statut_id   INT          NOT NULL DEFAULT 1,
    tas_priorite_id INT          NOT NULL DEFAULT 2,
    tas_date_debut  DATETIME     NOT NULL,
    tas_date_fin    DATETIME     NOT NULL,
    tas_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (tas_id),
    CONSTRAINT fk_tas_project  FOREIGN KEY (tas_project_id)  REFERENCES TOG_PROJECTS(pro_id)           ON DELETE CASCADE,
    CONSTRAINT fk_tas_sprint   FOREIGN KEY (tas_sprint_id)   REFERENCES TOG_SPRINTS(spr_id)            ON DELETE SET NULL,
    CONSTRAINT fk_tas_assignee FOREIGN KEY (tas_assignee_id) REFERENCES TOG_USERS(use_id)              ON DELETE SET NULL,
    CONSTRAINT fk_tas_reporter FOREIGN KEY (tas_reporter_id) REFERENCES TOG_USERS(use_id)              ON DELETE CASCADE,
    CONSTRAINT fk_tas_statut   FOREIGN KEY (tas_statut_id)   REFERENCES TOG_REF_STATUT_TACHE(rst_id),
    CONSTRAINT fk_tas_priorite FOREIGN KEY (tas_priorite_id) REFERENCES TOG_REF_PRIORITE(rpr_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_TAGS

CREATE TABLE TOG_TAGS (
    tag_id      INT         NOT NULL AUTO_INCREMENT,
    tag_nom     VARCHAR(50) NOT NULL,
    tag_couleur VARCHAR(7)  NOT NULL DEFAULT '#676666',

    PRIMARY KEY (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_TASK_TAGS

CREATE TABLE TOG_TASK_TAGS (
    ttt_task_id INT NOT NULL,
    ttt_tag_id  INT NOT NULL,

    PRIMARY KEY (ttt_task_id, ttt_tag_id),
    CONSTRAINT fk_ttt_task FOREIGN KEY (ttt_task_id) REFERENCES TOG_TASKS(tas_id) ON DELETE CASCADE,
    CONSTRAINT fk_ttt_tag  FOREIGN KEY (ttt_tag_id)  REFERENCES TOG_TAGS(tag_id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_COMMENTS

CREATE TABLE TOG_COMMENTS (
    com_id          INT      NOT NULL AUTO_INCREMENT,
    com_task_id     INT      NOT NULL,
    com_user_id     INT      NOT NULL,
    com_contenu     TEXT     NOT NULL,
    com_created_at  DATETIME NOT NULL DEFAULT NOW(),

    PRIMARY KEY (com_id),
    CONSTRAINT fk_com_task FOREIGN KEY (com_task_id) REFERENCES TOG_TASKS(tas_id) ON DELETE CASCADE,
    CONSTRAINT fk_com_user FOREIGN KEY (com_user_id) REFERENCES TOG_USERS(use_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_NOTIFICATIONS

CREATE TABLE TOG_NOTIFICATIONS (
    not_id          INT          NOT NULL AUTO_INCREMENT,
    not_user_id     INT          NOT NULL,
    not_type_id     INT          NOT NULL,
    not_message     VARCHAR(255) NOT NULL,
    not_lien        VARCHAR(255)     NULL DEFAULT NULL,
    not_lu          TINYINT(1)   NOT NULL DEFAULT 0,
    not_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (not_id),
    CONSTRAINT fk_not_user FOREIGN KEY (not_user_id) REFERENCES TOG_USERS(use_id)           ON DELETE CASCADE,
    CONSTRAINT fk_not_type FOREIGN KEY (not_type_id) REFERENCES TOG_REF_TYPE_NOTIF(rtn_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_CONVERSATIONS

CREATE TABLE TOG_CONVERSATIONS (
    con_id          INT          NOT NULL AUTO_INCREMENT,
    con_type_id     INT          NOT NULL DEFAULT 1,
    con_nom         VARCHAR(100)     NULL DEFAULT NULL,
    con_project_id  INT              NULL DEFAULT NULL,
    con_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (con_id),
    CONSTRAINT fk_con_type    FOREIGN KEY (con_type_id)    REFERENCES TOG_REF_TYPE_CONV(rtc_id),
    CONSTRAINT fk_con_project FOREIGN KEY (con_project_id) REFERENCES TOG_PROJECTS(pro_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_CONV_MEMBRES

CREATE TABLE TOG_CONV_MEMBRES (
    tcm_conv_id     INT          NOT NULL,
    tcm_user_id     INT          NOT NULL,
    tcm_lu_le       DATETIME         NULL DEFAULT NULL,
    tcm_joined_at   DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (tcm_conv_id, tcm_user_id),
    CONSTRAINT fk_tcm_conv FOREIGN KEY (tcm_conv_id) REFERENCES TOG_CONVERSATIONS(con_id) ON DELETE CASCADE,
    CONSTRAINT fk_tcm_user FOREIGN KEY (tcm_user_id) REFERENCES TOG_USERS(use_id)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_MESSAGES

CREATE TABLE TOG_MESSAGES (
    mes_id          INT          NOT NULL AUTO_INCREMENT,
    mes_conv_id     INT          NOT NULL,
    mes_sender_id   INT          NOT NULL,
    mes_contenu     TEXT         NOT NULL,
    mes_type_id     INT          NOT NULL DEFAULT 1,
    mes_fichier_url VARCHAR(255)     NULL DEFAULT NULL,
    mes_supprime    TINYINT(1)   NOT NULL DEFAULT 0,
    mes_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (mes_id),
    CONSTRAINT fk_mes_conv   FOREIGN KEY (mes_conv_id)   REFERENCES TOG_CONVERSATIONS(con_id) ON DELETE CASCADE,
    CONSTRAINT fk_mes_sender FOREIGN KEY (mes_sender_id) REFERENCES TOG_USERS(use_id)         ON DELETE CASCADE,
    CONSTRAINT fk_mes_type   FOREIGN KEY (mes_type_id)   REFERENCES TOG_REF_TYPE_MESSAGE(rtm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_SUGGESTIONS

CREATE TABLE TOG_SUGGESTIONS (
    sug_id          INT          NOT NULL AUTO_INCREMENT,
    sug_user_id     INT              NULL DEFAULT NULL,
    sug_titre       VARCHAR(150) NOT NULL,
    sug_description TEXT         NOT NULL,
    sug_statut_id   INT          NOT NULL DEFAULT 1,
    sug_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (sug_id),
    CONSTRAINT fk_sug_user   FOREIGN KEY (sug_user_id)   REFERENCES TOG_USERS(use_id)                ON DELETE SET NULL,
    CONSTRAINT fk_sug_statut FOREIGN KEY (sug_statut_id) REFERENCES TOG_REF_STATUT_SUGGESTION(rssu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_BUG_REPORTS

CREATE TABLE TOG_BUG_REPORTS (
    bug_id          INT          NOT NULL AUTO_INCREMENT,
    bug_user_id     INT              NULL DEFAULT NULL,
    bug_titre       VARCHAR(150) NOT NULL,
    bug_description TEXT         NOT NULL,
    bug_etapes      TEXT             NULL DEFAULT NULL,
    bug_statut_id   INT          NOT NULL DEFAULT 1,
    bug_priorite_id INT          NOT NULL DEFAULT 2,
    bug_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (bug_id),
    CONSTRAINT fk_bug_user    FOREIGN KEY (bug_user_id)    REFERENCES TOG_USERS(use_id)             ON DELETE SET NULL,
    CONSTRAINT fk_bug_statut  FOREIGN KEY (bug_statut_id)  REFERENCES TOG_REF_STATUT_BUG(rsb_id),
    CONSTRAINT fk_bug_priorite FOREIGN KEY (bug_priorite_id) REFERENCES TOG_REF_PRIORITE(rpr_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TOG_ACTIVITY_LOG

CREATE TABLE TOG_ACTIVITY_LOG (
    act_id          INT          NOT NULL AUTO_INCREMENT,
    act_user_id     INT              NULL DEFAULT NULL,
    act_project_id  INT              NULL DEFAULT NULL,
    act_type_id     INT          NOT NULL,
    act_description VARCHAR(255) NOT NULL,
    act_lien        VARCHAR(255)     NULL DEFAULT NULL,
    act_created_at  DATETIME     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (act_id),
    CONSTRAINT fk_act_user    FOREIGN KEY (act_user_id)    REFERENCES TOG_USERS(use_id)             ON DELETE SET NULL,
    CONSTRAINT fk_act_project FOREIGN KEY (act_project_id) REFERENCES TOG_PROJECTS(pro_id)          ON DELETE CASCADE,
    CONSTRAINT fk_act_type    FOREIGN KEY (act_type_id)    REFERENCES TOG_REF_TYPE_ACTIVITE(rta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
--  INDEX
-- =====================================================

CREATE INDEX idx_tas_project    ON TOG_TASKS(tas_project_id);
CREATE INDEX idx_tas_assignee   ON TOG_TASKS(tas_assignee_id);
CREATE INDEX idx_tas_statut     ON TOG_TASKS(tas_statut_id);
CREATE INDEX idx_tas_sprint     ON TOG_TASKS(tas_sprint_id);
CREATE INDEX idx_not_user_lu    ON TOG_NOTIFICATIONS(not_user_id, not_lu);
CREATE INDEX idx_mes_conv       ON TOG_MESSAGES(mes_conv_id, mes_created_at);
CREATE INDEX idx_spr_project    ON TOG_SPRINTS(spr_project_id);
CREATE INDEX idx_act_project    ON TOG_ACTIVITY_LOG(act_project_id, act_created_at);
CREATE INDEX idx_act_user       ON TOG_ACTIVITY_LOG(act_user_id, act_created_at);
CREATE INDEX idx_bug_statut     ON TOG_BUG_REPORTS(bug_statut_id);
CREATE INDEX idx_sug_statut     ON TOG_SUGGESTIONS(sug_statut_id);
