import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NewProjectModal } from "../modals/NewProjectModal";

export function MainLayout() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="app-container">
            <Header onOpenNewProject={() => setIsModalOpen(true)} />

            <main>
                <Outlet />
            </main>

            <Footer />

            <NewProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}