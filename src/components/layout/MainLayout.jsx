import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { Modal } from "../modals/Modal.jsx";
import { useTranslation } from '../../context/LanguageContext';
import { AnimatedSidebarProvider, AnimatedSidebarInset } from "../motion/animated-sidebar";
import './../../../assets/style/project/newProjectModal.css';
import './../../../assets/style/tools/modal-dialog.css';
import './../../../assets/style/home/home.css'
import {BloomMenu} from "@/components/motion/bloom-menu.jsx";
import {Bell, FileText, Folder, FolderClosed, LayoutGrid, Link, RobotArm, Table} from "lucide-react";
import {NewProjectModal} from "@/components/modals/NewProjectModal.jsx";

export function MainLayout() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const { t } = useTranslation();

    const handleOpenModal = (initialStep = 1) => {
        setStep(initialStep)
        setIsModalOpen(true);
    };


    const handleCloseModal = () => setIsModalOpen(false);

    const [data, setData] = useState(() => {
        const cachedUser = sessionStorage.getItem("together_user");
        return cachedUser ? JSON.parse(cachedUser) : null;
    });

    useEffect(() => {
        fetch("/api/loader/loadProfile.php", { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur réseau: ${res.status}`);
                return res.json();
            })
            .then((res) => {
                if (!res.success) throw new Error(res.message);

                const fetchedUser = {
                    name: `${res.data.prenom} ${res.data.nom}`,
                    email: res.data.email,
                    avatarUrl: res.data.avatar ? `/assets/uploads/avatars/${res.data.avatar}` : ""
                };

                setData(fetchedUser);

                sessionStorage.setItem("together_user", JSON.stringify(fetchedUser));
            })
    }, []);

    const ITEMS = [
        { label: "Projet", icon: "ti ti-folder" },
        { label: "Affaire", icon: "ti ti-building-factory-2" },
        { label: "Rapport", icon: "ti ti-report" },
    ];

    const sidebarSections = [
        {
            label: "GÉNÉRAL",
            items: [
                { to: "/dashboard", label: "Tableau de bord", icon: "ti ti-layout-dashboard" },
                { to: "/notifications", label: "Notifications", icon: "ti ti-bell", badge: "3" },
                { to: "/calendar", label: "Calendrier", icon: "ti ti-calendar" },
            ],
        },
        {
            label: "PROJETS",
            items: [
                { to: "/myprojects", label: "Mes projets", icon: "ti ti-folder" },
                { to: "/mycontributions", label: "Mes Contributions", icon: "ti ti-users" },
            ],
        },
        {
            label: "TRAVAIL",
            items: [
                { to: "/tasks", label: "Mes tâches", icon: "ti ti-checklist" },
                { to: "/recent", label: "Récent", icon: "ti ti-clock" },
            ],
        },
        {
            label: "ANALYSE",
            items: [
                { to: "/stats", label: "Statistiques", icon: "ti ti-chart-bar" },
                { to: "/reports", label: "Rapports", icon: "ti ti-report" },
            ],
        },
        {
            label: "COMPTE",
            items: [
                { to: "/profile/settings", label: "Paramètres", icon: "ti ti-settings-2" },
                { to: "/quicklinks/help", label: "Aide", icon: "ti ti-help" },
                { to: "/api/auth/logout.php", label: "Déconnexion", icon: "ti ti-logout" },
            ],
        },
    ];

    const headerActions = [
        {
            component: (
                <BloomMenu
                    key="bloom"
                    items={ITEMS}
                    onSelect={(label) => {
                        if (label === "Projet") {
                            handleOpenModal(1);
                        } else if (label === "Affaire") {
                            handleOpenModal(2);
                        }
                    }}
                />
            )
        },
    ];

    const searchItems = [
        {
            id: "dashboard",
            title: "Tableau de bord",
            description: "Vue d'ensemble de vos activités",
            keywords: ["accueil", "home", "stats"],
            icon: () => <i className="ti ti-layout-dashboard text-xl text-[var(--color-second-tertiary)]" />
        },
        {
            id: "projects",
            title: "Mes projets",
            description: "Accéder à tous vos projets",
            keywords: ["dossiers", "fichiers", "travail"],
            icon: () => <i className="ti ti-folder text-xl text-[var(--color-second-tertiary)]" />
        },
        {
            id: "tasks",
            title: "Mes tâches",
            description: "Voir les tâches assignées",
            keywords: ["todo", "checklist", "retard"],
            icon: () => <i className="ti ti-checklist text-xl text-[var(--color-second-tertiary)]" />
        },
        {
            id: "settings",
            title: "Paramètres",
            description: "Gérer votre compte et vos préférences",
            keywords: ["profil", "configuration", "options"],
            icon: () => <i className="ti ti-settings-2 text-xl text-[var(--color-second-tertiary)]" />
        }
    ];

    const footerColumns = [
        {
            title: "Raccourcis rapides",
            links: [
                { to: "/dashboard", label: "Accueil" },
                { to: "/notifications", label: "Notifications" },
                { to: "/calendar", label: "Calendrier" },
                { to: "/stats", label: "Statistiques" },
                { to: "/reports", label: "Rapports" },
                { to: "/settings", label: "Paramètres" },
            ],
        },
        {
            title: "Liens utiles",
            links: [
                { to: "/help", label: "Aide" },
                { to: "/documentation", label: "Documentation" },
                { to: "/report-bug", label: "Signaler un bug" },
                { to: "/submit-idea", label: "Proposer une idée" },
            ],
        },
        {
            title: "Réseau",
            links: [
                { to: "/about", label: "À propos" },
                { to: "/faq", label: "FAQ" },
                { to: "/changelog", label: "Changelog" },
                { to: "https://github.com/NoahQuagh/Together", label: "GitHub", external: true },
                { to: "/status", label: "Statut" },
            ],
        },
    ];



    return (
        <AnimatedSidebarProvider defaultOpen={false}>
            <div className="flex min-h-screen w-full">
                <Sidebar sections={sidebarSections} user={data} />

                <AnimatedSidebarInset className="flex flex-col flex-1 min-w-0">
                    <Header
                        title="Together"
                        titleLink="/dashboard"
                        searchPlaceholder="Rechercher..."
                        searchItems={searchItems}
                        actions={headerActions}
                        user={data}
                        tabs
                    />

                    <main className={"flex-1 w-full text-left p-0 m-0 bg-[var(--bg-body)]"} style={{ backgroundColor: 'var(--bg-body)' }}>
                        <Outlet context={{ user: data }} />
                    </main>

                    <Footer
                        brandName="Together"
                        slogan="Votre plateforme collaborative."
                        version="1.0.0"
                        columns={footerColumns}
                    />
                </AnimatedSidebarInset>

                <NewProjectModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    step={step}
                />
            </div>
        </AnimatedSidebarProvider>
    );
}