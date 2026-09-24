import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavigationTabs } from "./NavigationTabs";
import { NewProjectModal } from "../modals/NewProjectModal";

export function MainLayout() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const sidebarSections = [
        {
            label: "GÉNÉRAL",
            items: [
                { to: "/dashboard", label: "Accueil", icon: "ti ti-smart-home" },
                { to: "/notifications", label: "Notifications", icon: "ti ti-bell", badge: "3" },
                { to: "/calendar", label: "Calendrier", icon: "ti ti-calendar" },
            ],
        },
        {
            label: "PROJETS",
            items: [
                { to: "/projects", label: "Mes projets", icon: "ti ti-folder" },
                { to: "/contributions", label: "Contributions", icon: "ti ti-users" },
                {
                    to: "#",
                    label: "Nouveau projet",
                    icon: "ti ti-circle-plus",
                    onClick: handleOpenModal
                },
            ],
        },
        {
            label: "TRAVAIL",
            items: [
                { to: "/tasks", label: "Mes tâches", icon: "ti ti-checklist" },
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
                { to: "/settings", label: "Paramètres", icon: "ti ti-settings-2" },
                { to: "/api/auth/logout.php", label: "Déconnexion", icon: "ti ti-logout" },
            ],
        },
    ];

    const headerActions = [
        {
            icon: "ti ti-plus",
            tooltip: "Nouveau projet",
            onClick: handleOpenModal
        },
        {
            icon: "ti ti-user",
            tooltip: "Profil",
            to: "/profile"
        },
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
        <div className="app-container">
            {/* APPEL DU HEADER GENERIQUE */}
            <Header
                title="Together"
                titleLink="/dashboard"
                searchPlaceholder="Rechercher..."
                onSearch={(query) => console.log("Recherche :", query)}
                actions={headerActions}
                tabs={<NavigationTabs />}
                sidebarSections={sidebarSections}
            />

            <main>
                <Outlet />
            </main>

            {/* APPEL DU FOOTER GENERIQUE */}
            <Footer
                brandName="Together"
                slogan="Votre plateforme collaborative."
                version="1.0.0"
                columns={footerColumns}
            />

            {/* MODAL DE NOUVEAU PROJET */}
            <NewProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}