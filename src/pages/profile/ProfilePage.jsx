import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastNotification';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import '../../../assets/style/profile/profile.css';
import {CustomAvatar} from "@/components/ui/CustomAvatar.jsx";

export function ProfilePage() {
    const { t } = useTranslation();
    const { setUser } = useAuth();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Données des formulaires
    const [profileData, setProfileData] = useState({ prenom: '', nom: '', email: '', role: '', date_crea: '',avatar: '' });
    const [initialProfile, setInitialProfile] = useState({ prenom: '', nom: '', email: '' });

    const [securityData, setSecurityData] = useState({ passW: '', newPassW: '', confirmPassW: '' });

    const [prefData, setPrefData] = useState({ theme_id: '2', accent_color: '1', tasks_alert: false });
    const [initialPref, setInitialPref] = useState({ theme_id: '2', accent_color: '1', tasks_alert: false });

    const [notifData, setNotifData] = useState({ notif_email: 1, notif_mention: 1, notif_assignation: 1, notif_commentaire: 1 });
    const [initialNotif, setInitialNotif] = useState({ notif_email: 1, notif_mention: 1, notif_assignation: 1, notif_commentaire: 1 });

    const [accentList, setAccentList] = useState([]);
    const [langList, setLangList] = useState([]);
    const [selectedLang, setSelectedLang] = useState('1');



    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        Promise.all([
            fetch('/api/loader/loadProfile.php', { credentials: 'include' }).then(r => r.json()),
            fetch('/api/loader/loadPreference.php', { credentials: 'include' }).then(r => r.json())
        ])
            .then(([profileRes, prefRes]) => {
                if (!isMounted) return;

                // 1. Profil utilisateur
                if (profileRes.success && profileRes.data) {
                    const u = profileRes.data;
                    const pData = {
                        prenom: u.prenom || '',
                        nom: u.nom || '',
                        email: u.email || '',
                        role: u.role || '',
                        date_crea: u.date_crea || '',
                        avatar: u.avatar || u.avatar_url || ''
                    };
                    setProfileData(pData);
                    setInitialProfile({
                        prenom: pData.prenom,
                        nom: pData.nom,
                        email: pData.email,
                        avatar: pData.avatar
                    });
                }

                // 2. Préférences utilisateur
                if (prefRes.success && prefRes.data) {
                    const p = prefRes.data;
                    const pref = {
                        theme_id: String(p.theme_id ?? '2'),
                        accent_color: String(p.accent_color ?? '1'),
                        tasks_alert: Number(p.tasks_alert) === 1
                    };
                    setPrefData(pref);
                    setInitialPref(pref);

                    const notif = {
                        notif_email: Number(p.notif_email ?? 1),
                        notif_mention: Number(p.notif_mention ?? 1),
                        notif_assignation: Number(p.notif_assignation ?? 1),
                        notif_commentaire: Number(p.notif_commentaire ?? 1)
                    };
                    setNotifData(notif);
                    setInitialNotif(notif);

                    if (p.langue_id) setSelectedLang(String(p.langue_id));
                    if (prefRes.accentList) setAccentList(prefRes.accentList);
                    if (prefRes.langList) setLangList(prefRes.langList);
                }
            })
            .catch(() => showToast(t('unable to load profile data'), 'error'))
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    // 1. Sauvegarde Profil
    const handleSaveProfile = (e) => {
        e.preventDefault();
        setSaving(true);
        fetch('/api/updater/updateProfile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                prenom: profileData.prenom,
                nom: profileData.nom,
                email: profileData.email,
                avatar:profileData.avatar
            })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    showToast('Modification réussie', 'success', res.message);
                    setInitialProfile({ prenom: profileData.prenom, nom: profileData.nom, email: profileData.email,avatar: profileData.avatar});
                    if (setUser) setUser((prev) => ({ ...prev, name: `${profileData.prenom} ${profileData.nom}` }));
                } else {
                    showToast('Modification impossible', 'error', res.message);
                }
            })
            .catch(() => showToast(t('unable to update profile'), 'error'))
            .finally(() => setSaving(false));
    };

    //Edit Avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        fetch('/api/updater/updateAvatar.php', {
            method: 'POST',
            credentials: 'include',
            body: formData // Pas de Header Content-Type pour FormData (le navigateur le gère)
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    showToast(t('avatar updated successfully'), 'success', res.message);
                    setProfileData((prev) => ({ ...prev, avatar: res.avatarUrl }));
                } else {
                    showToast(t('unable to update avatar'), 'error', res.message);
                }
            })
            .catch(() => showToast(t('unable to update avatar'), 'error'));
    };

    // 2. Sauvegarde Mot de passe
    const handleSaveSecurity = (e) => {
        e.preventDefault();
        setSaving(true);
        fetch('/api/updater/updatePassWordProfile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                passW: securityData.passW,
                newPassW: securityData.newPassW,
                confirmPassW: securityData.confirmPassW
            })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    showToast('Modification réussie', 'success', res.message);
                    setSecurityData({ passW: '', newPassW: '', confirmPassW: '' });
                } else {
                    showToast('Modification impossible', 'warning', res.message);
                }
            })
            .catch(() => showToast(t('unable to update password'), 'error'))
            .finally(() => setSaving(false));
    };

    // 3. Suppression de compte
    const confirmDeleteAccount = () => {
        fetch('/api/deleter/deleteAccount.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    window.location.href = '/login';
                } else {
                    showToast(t('impossible action'), 'error', data.message);
                }
            })
            .catch(() => showToast(t('impossible action'), 'error'));
    };

    // 4. Sauvegarde Apparence / Thème
    const handleSavePreferences = (e) => {
        e.preventDefault();
        setSaving(true);

        if (window.setTogetherTheme) {
            window.setTogetherTheme(prefData.theme_id, true);
        }

        fetch('/api/updater/updatePreferences.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                theme: prefData.theme_id,
                accent_color: prefData.accent_color,
                tasks_alert: prefData.tasks_alert ? 1 : 0
            })
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    showToast('Modification réussie', 'success', json.message);
                    setInitialPref(prefData);
                } else {
                    showToast('Modification impossible', 'warning', json.message);
                }
            })
            .catch((err) => showToast('Erreur réseau lors de la sauvegarde', 'error', err.message))
            .finally(() => setSaving(false));
    };

    // 5. Sauvegarde Notifications
    const handleSaveNotifs = (e) => {
        e.preventDefault();
        setSaving(true);
        fetch('/api/updater/updateNotif.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(notifData)
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    showToast(t('preferences updated successfully'), 'success', res.message);
                    setInitialNotif(notifData);
                } else {
                    showToast(t('modification not possible'), 'error', res.message);
                }
            })
            .catch(() => showToast(t('unable to update preferences'), 'error'))
            .finally(() => setSaving(false));
    };

    // 6. Sauvegarde Langue
    const handleSaveLang = (e) => {
        e.preventDefault();
        const selectedObj = langList.find((l) => String(l.lang_id) === String(selectedLang));
        fetch('/api/updater/updateLang.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                langue_id: selectedLang,
                lang_code: selectedObj?.lang || 'fr'
            })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) window.location.reload();
            })
            .catch(() => showToast(t('unable to update language'), 'error'));
    };

    if (loading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <LoadingSpinner caption={t('loading profile...')} />
            </div>
        );
    }

    const initiales = `${profileData.prenom.charAt(0)}${profileData.nom.charAt(0)}`.toUpperCase() || 'U';
    const dateCreaFormatted = profileData.date_crea ? new Date(profileData.date_crea).toLocaleDateString('fr-FR') : '';

    return (
        <main className="profile-layout">
            {/* --- ASIDE NAVIGATION --- */}
            <div className="profile-aside">
                <div className="profile-aside-section">
                    <p className="profile-aside-label">{t('account')}</p>
                    <button type="button" onClick={() => setActiveTab('profile')} className={`profile-aside-item ${activeTab === 'profile' ? 'active' : ''}`}>
                        <i className="ti ti-user" aria-hidden="true" />{t('profile')}
                    </button>
                    <button type="button" onClick={() => setActiveTab('security')} className={`profile-aside-item ${activeTab === 'security' ? 'active' : ''}`}>
                        <i className="ti ti-lock" aria-hidden="true" />{t('security')}
                    </button>
                    <button type="button" onClick={() => setActiveTab('notifications')} className={`profile-aside-item ${activeTab === 'notifications' ? 'active' : ''}`}>
                        <i className="ti ti-bell" aria-hidden="true" />{t('notifications')}
                    </button>
                </div>

                <div className="profile-aside-divider" />

                <div className="profile-aside-section">
                    <p className="profile-aside-label">{t('preferences')}</p>
                    <button type="button" onClick={() => setActiveTab('preference')} className={`profile-aside-item ${activeTab === 'preference' ? 'active' : ''}`}>
                        <i className="ti ti-palette" aria-hidden="true" />{t('appearance')}
                    </button>
                    <button type="button" onClick={() => setActiveTab('language')} className={`profile-aside-item ${activeTab === 'language' ? 'active' : ''}`}>
                        <i className="ti ti-language" aria-hidden="true" />{t('language')}
                    </button>
                </div>

                <div className="profile-aside-divider" />

                <div className="profile-aside-section">
                    <p className="profile-aside-label">{t('application')}</p>
                    <button type="button" onClick={() => setActiveTab('new')} className={`profile-aside-item ${activeTab === 'new' ? 'active' : ''}`}>
                        <i className="ti ti-flask" aria-hidden="true" />{t('new features')}
                    </button>
                    <button type="button" onClick={() => setActiveTab('integrations')} className={`profile-aside-item ${activeTab === 'integrations' ? 'active' : ''}`}>
                        <i className="ti ti-plug" aria-hidden="true" />{t('integrations')}
                    </button>
                </div>

                <div className="profile-aside-divider" />

                <div className="profile-aside-section">
                    <p className="profile-aside-label">{t('support')}</p>
                    <button type="button" onClick={() => setActiveTab('help')} className={`profile-aside-item ${activeTab === 'help' ? 'active' : ''}`}>
                        <i className="ti ti-help" aria-hidden="true" />{t('help & documentation')}
                    </button>
                    <button type="button" onClick={() => setActiveTab('about')} className={`profile-aside-item ${activeTab === 'about' ? 'active' : ''}`}>
                        <i className="ti ti-info-circle" aria-hidden="true" />{t('about')}
                    </button>
                </div>
            </div>

            <div id="setting-zone">
                <div className="profile-page">

                    {/* 1. ONGLET PROFIL */}
                    {activeTab === 'profile' && (
                        <>
                            <div className="profile-header">
                                <div className="avatar-container">
                                    <CustomAvatar
                                        size="lg"
                                        variant="blue"
                                        src={profileData.avatar ? `/assets/uploads/avatars/${profileData.avatar}` : null}
                                        name={`${profileData.prenom} ${profileData.nom}`}
                                    />
                                    <label className="avatarEdit" title={t('change avatar')}>
                                        <i className="ti ti-pencil" aria-hidden="true" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>

                                <div className="profile-header-info">
                                    <h2 id="profileDisplayName">{profileData.prenom} {profileData.nom}</h2>
                                    <span className="profile-since">{t(profileData.role)}</span>
                                    {dateCreaFormatted && <span className="profile-since">{t('member since')} {dateCreaFormatted}</span>}
                                </div>
                            </div>

                            <div className="profile-block">
                                <div className="profile-block-header">
                                    <h3><i className="ti ti-user" aria-hidden="true" /> {t('personal information')}</h3>
                                </div>

                                <form className="profile-form" id="profileForm" onSubmit={handleSaveProfile}>
                                    <div className="profile-row-2">
                                        <div className="profile-field">
                                            <label htmlFor="prenom">{t('first name')}</label>
                                            <input
                                                type="text"
                                                id="prenom"
                                                name="prenom"
                                                value={profileData.prenom}
                                                onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="profile-field">
                                            <label htmlFor="nom">{t('name')}</label>
                                            <input
                                                type="text"
                                                id="nom"
                                                name="nom"
                                                value={profileData.nom}
                                                onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="profile-field">
                                        <label htmlFor="email">{t('e-mail')}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="profile-btn-save"
                                        disabled={saving || (profileData.prenom === initialProfile.prenom && profileData.nom === initialProfile.nom && profileData.email === initialProfile.email)}
                                    >
                                        <i className="ti ti-device-floppy" aria-hidden="true" />
                                        {t('save')}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {/* 2. ONGLET SÉCURITÉ */}
                    {activeTab === 'security' && (
                        <>
                            <div className="profile-block">
                                <div className="profile-block-header">
                                    <h3><i className="ti ti-lock" aria-hidden="true" /> {t('change password')}</h3>
                                </div>

                                <form className="profile-form" id="profileForm" onSubmit={handleSaveSecurity}>
                                    <div className="profile-field">
                                        <label htmlFor="mdp-actuel">{t('current password')}</label>
                                        <input
                                            type="password"
                                            id="mdp-actuel"
                                            name="mdp_actuel"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            value={securityData.passW}
                                            onChange={(e) => setSecurityData({ ...securityData, passW: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="profile-row-2">
                                        <div className="profile-field">
                                            <label htmlFor="mdp-nouveau">{t('new password')}</label>
                                            <input
                                                type="password"
                                                id="mdp-nouveau"
                                                name="mdp_nouveau"
                                                placeholder={t('new password')}
                                                autoComplete="new-password"
                                                minLength={8}
                                                value={securityData.newPassW}
                                                onChange={(e) => setSecurityData({ ...securityData, newPassW: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="profile-field">
                                            <label htmlFor="mdp-confirm">{t('confirm')}</label>
                                            <input
                                                type="password"
                                                id="mdp-confirm"
                                                name="mdp_confirm"
                                                placeholder={t('confirm password')}
                                                autoComplete="new-password"
                                                value={securityData.confirmPassW}
                                                onChange={(e) => setSecurityData({ ...securityData, confirmPassW: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="profile-btn-save"
                                        disabled={saving || !securityData.passW || !securityData.newPassW}
                                    >
                                        <i className="ti ti-key" aria-hidden="true" />
                                        {t('update password')}
                                    </button>
                                </form>
                            </div>

                            <div className="profile-block profile-block--danger">
                                <div className="profile-block-header deleteacnt">
                                    <h3><i className="ti ti-alert-triangle" aria-hidden="true" /> {t('sensitive area')}</h3>
                                </div>
                                <div className="profile-danger-row">
                                    <div className="profile-danger-text">
                                        <span className="profile-danger-title">{t('delete my account')}</span>
                                        <span className="profile-danger-desc">{t('this action is irreversible. all your projects and data will be permanently deleted')}.</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="profile-btn-danger"
                                        id="deleteAccountBtn"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        {t('delete my account')}
                                    </button>
                                </div>
                            </div>

                            {/* MODALE DE SUPPRESSION DE COMPTE */}
                            {showDeleteModal && (
                                <div id="supCompte" className="modal-overlay">
                                    <div className="modal-box modal-del-acnt">
                                        <div className="modal-body">
                                            <i className="ti ti-alert-triangle" />
                                            <h3>{t('delete account')}</h3>
                                            <p>{t("you're going to delete your account")}</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="modal-btn btn-cancel" onClick={() => setShowDeleteModal(false)}>
                                                {t('no, keep it')}
                                            </button>
                                            <button className="modal-btn btn-confirm risk" onClick={confirmDeleteAccount}>
                                                {t('yes delete')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* 3. ONGLET APPARENCE */}
                    {activeTab === 'preference' && (
                        <form id="form-appearance" method="POST" onSubmit={handleSavePreferences}>
                            <div className="profile-block">
                                <div className="profile-block-header">
                                    <h3><i className="ti ti-palette" aria-hidden="true" /> {t('appearance')}</h3>
                                </div>

                                <div className="profile-form theme">
                                    {/* SÉLECTEUR DE THÈME AVEC APPERÇUS FENÊTRES */}
                                    <div className="profile-field theme-selec">
                                        <div className="theme-layout">
                                            <div className="theme-title">
                                                <label>{t('interface theme')}</label>
                                                <p>{t('customize your application appereance')}</p>
                                            </div>
                                            <div className="pref-theme-options">
                                                <div className="theme-picker">
                                                    {/* THÈME CLAIR */}
                                                    <label className="theme-option">
                                                        <input
                                                            type="radio"
                                                            name="theme"
                                                            value="1"
                                                            checked={prefData.theme_id === '1'}
                                                            onChange={(e) => setPrefData({ ...prefData, theme_id: e.target.value })}
                                                        />
                                                        <div className="theme-window win-light">
                                                            <div className="w-bar"><div className="w-dot" /><div className="w-dot" /><div className="w-dot" /></div>
                                                            <div className="w-body">
                                                                <div className="w-side">
                                                                    <div className="w-nav-item active" />
                                                                    <div className="w-nav-item" />
                                                                    <div className="w-nav-item" />
                                                                </div>
                                                                <div className="w-content">
                                                                    <div className="w-card"><div className="w-line accent" /><div className="w-line short" /></div>
                                                                    <div className="w-card"><div className="w-line" /><div className="w-line short" /></div>
                                                                    <div className="w-card"><div className="w-line" /><div className="w-line short" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="theme-check" />
                                                        <span className="theme-label">{t('light')}</span>
                                                    </label>

                                                    {/* THÈME SOMBRE */}
                                                    <label className="theme-option">
                                                        <input
                                                            type="radio"
                                                            name="theme"
                                                            value="2"
                                                            checked={prefData.theme_id === '2'}
                                                            onChange={(e) => setPrefData({ ...prefData, theme_id: e.target.value })}
                                                        />
                                                        <div className="theme-window win-dark">
                                                            <div className="w-bar"><div className="w-dot" /><div className="w-dot" /><div className="w-dot" /></div>
                                                            <div className="w-body">
                                                                <div className="w-side">
                                                                    <div className="w-nav-item active" />
                                                                    <div className="w-nav-item" />
                                                                    <div className="w-nav-item" />
                                                                </div>
                                                                <div className="w-content">
                                                                    <div className="w-card"><div className="w-line accent" /><div className="w-line short" /></div>
                                                                    <div className="w-card"><div className="w-line" /><div className="w-line short" /></div>
                                                                    <div className="w-card"><div className="w-line" /><div className="w-line short" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="theme-check" />
                                                        <span className="theme-label">{t('dark')}</span>
                                                    </label>

                                                    {/* THÈME SYSTÈME */}
                                                    <label className="theme-option">
                                                        <input
                                                            type="radio"
                                                            name="theme"
                                                            value="3"
                                                            checked={prefData.theme_id === '3'}
                                                            onChange={(e) => setPrefData({ ...prefData, theme_id: e.target.value })}
                                                        />
                                                        <div className="theme-window win-system">
                                                            <div className="w-bar"><div className="w-dot" /><div className="w-dot" /><div className="w-dot" /></div>
                                                            <div className="w-body">
                                                                <div className="w-side">
                                                                    <div className="w-nav-item active" />
                                                                    <div className="w-nav-item" />
                                                                    <div className="w-nav-item" />
                                                                </div>
                                                                <div className="w-content">
                                                                    <div className="w-card"><div className="w-line accent" /><div className="w-line short" /></div>
                                                                    <div className="w-card"><div className="w-line" /><div className="w-line short" /></div>
                                                                    <div className="w-card"><div className="w-line" /><div className="w-line short" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="theme-check" />
                                                        <span className="theme-label">{t('system')}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="separator-form" />

                                    {/* SÉLECTEUR DE COULEUR D'ACCENT */}
                                    <div className="profile-field">
                                        <div className="theme-layout row">
                                            <div className="theme-title">
                                                <label>{t('accent color')}</label>
                                                <p>{t("pick your platform's main color")}</p>
                                            </div>
                                            <div className="accent-color-picker">
                                                {accentList.map((c) => (
                                                    <label key={c.accent_color_id} className="color-circle-option" title={c.accent_color_label}>
                                                        <input
                                                            type="radio"
                                                            name="accent_color"
                                                            value={c.accent_color_id}
                                                            checked={Number(prefData.accent_color) === Number(c.accent_color_id)}
                                                            onChange={(e) => setPrefData({ ...prefData, accent_color: e.target.value })}
                                                        />
                                                        <span className="color-circle" style={{ backgroundColor: c.accent_color }} />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <span className="separator-form" />

                                    {/* TOGGLE TÂCHES EN RETARD */}
                                    <div className="profile-field">
                                        <div className="theme-layout row">
                                            <div className="theme-title">
                                                <label>{t('Tâches en retard')}</label>
                                                <p>{t('Surbrillance de vos tâches en retard')}</p>
                                            </div>
                                            <input className="tk-alert" type="hidden" name="checkbox-tasks-alert" value={prefData.tasks_alert ? '1' : '0'} />
                                            <span
                                                className={`slider ${prefData.tasks_alert ? 'active' : ''}`}
                                                onClick={() => setPrefData({ ...prefData, tasks_alert: !prefData.tasks_alert })}
                                            />
                                        </div>
                                    </div>

                                    <span className="separator-form" />

                                    <button
                                        type="submit"
                                        className="profile-btn-save apply-theme"
                                        disabled={saving || (prefData.theme_id === initialPref.theme_id && prefData.accent_color === initialPref.accent_color && prefData.tasks_alert === initialPref.tasks_alert)}
                                    >
                                        <i className="ti ti-brush" aria-hidden="true" />
                                        {t('apply')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* 4. ONGLET NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <form id="form-notifications" method="POST" onSubmit={handleSaveNotifs}>
                            <div className="profile-block">
                                <div className="profile-block-header">
                                    <h3><i className="ti ti-bell" aria-hidden="true" /> {t('notifications')}</h3>
                                </div>

                                <div className="profile-form pref-toggle-list">
                                    {[
                                        { key: 'notif_email', label: t('email notifications'), desc: t('receive a summary by email') },
                                        { key: 'notif_mention', label: t('mentions'), desc: t('get notified when someone mentions you') },
                                        { key: 'notif_assignation', label: t('assignments'), desc: t('get notified when a task is assigned to you') },
                                        { key: 'notif_commentaire', label: t('comments'), desc: t('get notified of new comments on your tasks') },
                                    ].map((item) => (
                                        <label key={item.key} className="pref-toggle-card">
                                            <div className="pref-card-header">
                                                <span className="pref-switch">
                                                    <input
                                                        type="checkbox"
                                                        name={item.key}
                                                        value="1"
                                                        checked={notifData[item.key] === 1}
                                                        onChange={(e) => setNotifData({ ...notifData, [item.key]: e.target.checked ? 1 : 0 })}
                                                    />
                                                </span>
                                                <span className="pref-toggle-title">{item.label}</span>
                                            </div>
                                            <p className="pref-toggle-desc">{item.desc}</p>
                                        </label>
                                    ))}

                                    <button
                                        type="submit"
                                        className="profile-btn-save"
                                        disabled={saving || JSON.stringify(notifData) === JSON.stringify(initialNotif)}
                                    >
                                        <i className="ti ti-device-floppy" aria-hidden="true" />
                                        {t('save')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* 5. ONGLET LANGUE */}
                    {activeTab === 'language' && (
                        <form id="form-language" method="POST" onSubmit={handleSaveLang}>
                            <div className="profile-block">
                                <div className="profile-block-header">
                                    <h3><i className="ti ti-language" aria-hidden="true" /> {t('language')}</h3>
                                </div>

                                <div className="profile-form">
                                    <div className="profile-field">
                                        <div className="theme-layout row">
                                            <div className="theme-title">
                                                <label htmlFor="langue">{t('interface language')}</label>
                                                <p>{t('select the language of the platform')}</p>
                                            </div>
                                            <select
                                                id="langue"
                                                name="tup_langue"
                                                value={selectedLang}
                                                onChange={(e) => setSelectedLang(e.target.value)}
                                            >
                                                {langList.map((l) => {
                                                    const id = l.lang_id ?? 1;
                                                    const code = l.lang ?? 'fr';
                                                    const label = l.lang_label ?? l.lang ?? 'Français';
                                                    return (
                                                        <option key={id} value={id} data-code={code}>
                                                            {label.charAt(0).toUpperCase() + label.slice(1)}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <button type="submit" className="profile-btn-save">
                                        <i className="ti ti-device-floppy" aria-hidden="true" />
                                        {t('save')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* AUTRES ONGLETS */}
                    {['new', 'integrations', 'help', 'about'].includes(activeTab) && (
                        <div className="profile-block">
                            <div className="profile-block-header">
                                <h3><i className="ti ti-flask" aria-hidden="true" /> {t(activeTab)}</h3>
                            </div>
                            <div className="profile-form">
                                <p>{t('Section en cours de développement.')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}