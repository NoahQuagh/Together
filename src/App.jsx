import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

import { MainLayout } from "./components/layout/MainLayout";
import { ProjectLayout } from "./components/layout/ProjectLayout.jsx";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/home/DashboardPage";
import { ProjectsPage } from "./pages/home/ProjectsPage";
import { ContributionsPage } from "./pages/home/ContributionsPage";
import { ProjectOverviewPage } from "./pages/project/ProjectOverviewPage.jsx";
import { TasksPage } from "./pages/home/TasksPage";
import { ToastProvider } from './components/ui/ToastNotification';
import {NotFound} from "@/pages/NotFound.jsx";

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route element={<MainLayout />}>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/myprojects" element={<ProjectsPage />} />
                                <Route path="/mycontributions" element={<ContributionsPage />} />
                                <Route path="/tasks" element={<TasksPage />} />
                            </Route>
                        </Route>

                        <Route path="/project/:projectId" element={<ProjectLayout />}>
                            <Route index element={<ProjectOverviewPage />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    );
}
