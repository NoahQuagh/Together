import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/home/DashboardPage";
import { ProjectsPage } from "./pages/home/ProjectsPage";
import { ContributionsPage } from "./pages/home/ContributionsPage";
import { TasksPage } from "./pages/home/TasksPage";

export default function App() {
    // En attendant d'avoir un AuthContext global, on simule l'état connecté
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    return (
        <BrowserRouter>
            <Routes>
                {/* Route publique */}
                <Route path="/login" element={<LoginPage />} />

                {/* Routes protégées (nécessitent d'être connecté) */}
                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/contributions" element={<ContributionsPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                    </Route>
                </Route>

                {/* Fallback si la route n'existe pas */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}