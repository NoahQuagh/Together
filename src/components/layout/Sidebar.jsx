import React from "react";
import { NavLink } from "react-router-dom";
import { CustomAvatar } from "../ui/CustomAvatar";
import {
    AnimatedSidebar,
    AnimatedSidebarHeader,
    AnimatedSidebarContent,
    AnimatedSidebarGroup,
    AnimatedSidebarGroupLabel,
    AnimatedSidebarGroupContent,
    AnimatedSidebarMenu,
    AnimatedSidebarMenuItem,
    AnimatedSidebarFooter,
    AnimatedSidebarRail,
    useSidebar,
} from "../motion/animated-sidebar";
import './../../../assets/style/navigation/sidebar.css';

const DEFAULT_USER = { id: 0, name: 'Invité Utilisateur', email: 'guest@together.com', avatarUrl: '' };

export function Sidebar({ title = "Together", sections = [], user: userProp }) {

    const currentUser = userProp || DEFAULT_USER;

    return (
        <AnimatedSidebar
            ariaLabel={title}
            collapsible="icon"
            className="sidebar-custom-wrapper"
            panelClassName="sidebar"
        >
            <AnimatedSidebarHeader className="sb-header">
                <div className="flex items-left gap-2 overflow-hidden">
                    <span className="sb-title truncate group-data-[state=collapsed]/sidebar:hidden">{title}</span>
                </div>
            </AnimatedSidebarHeader>

            <AnimatedSidebarContent className="sb-content">
                {sections.map((section, idx) => (
                    <React.Fragment key={section.label || idx}>
                        {idx > 0 && <div className="sb-divider" />}
                        <AnimatedSidebarGroup className="sb-section">
                            {section.label && (
                                <AnimatedSidebarGroupLabel className="sb-label">
                                    <span className="group-data-[state=collapsed]/sidebar:opacity-0 transition-opacity duration-200">
                                        {section.label}
                                    </span>
                                </AnimatedSidebarGroupLabel>
                            )}
                            <AnimatedSidebarGroupContent>
                                <AnimatedSidebarMenu>
                                    {section.items.map((item, itemIdx) => (
                                        <AnimatedSidebarMenuItem key={itemIdx}>
                                            <NavLink
                                                to={item.to || "#"}
                                                className={({ isActive }) => `sb-item ${isActive ? 'active' : ''}`}
                                            >
                                                <i className={item.icon} aria-hidden="true" />
                                                <span className="sb-item-text group-data-[state=collapsed]/sidebar:hidden">{item.label}</span>
                                                {item.badge && <span className="sb-badge group-data-[state=collapsed]/sidebar:hidden">{item.badge}</span>}
                                            </NavLink>
                                        </AnimatedSidebarMenuItem>
                                    ))}
                                </AnimatedSidebarMenu>
                            </AnimatedSidebarGroupContent>
                        </AnimatedSidebarGroup>
                    </React.Fragment>
                ))}
            </AnimatedSidebarContent>

            <AnimatedSidebarFooter className="sb-footer">
                <a className="sb-user-card group-data-[state=collapsed]/sidebar:justify-center flex items-center gap-3 p-2.5 hover:bg-[#212121] rounded-xl cursor-pointer transition-colors w-full" href={"/profile"}>
                    {/* On utilise currentUser ici au lieu de "user" */}
                    <CustomAvatar
                        size="md"
                        variant="blue"
                        src={currentUser.avatarUrl}
                        name={currentUser.name}
                    />

                    <div className="sb-user-info group-data-[state=collapsed]/sidebar:hidden truncate flex-1 min-w-0" >
                        <span className="sb-user-name truncate block font-bold text-white text-sm">
                            {currentUser.name}
                        </span>
                        <span className="sb-user-email truncate block text-xs text-neutral-400">
                            {currentUser.email}
                        </span>
                    </div>

                    <i className="ti ti-chevron-right text-neutral-400 group-data-[state=collapsed]/sidebar:hidden shrink-0 text-xs" aria-hidden="true" />
                </a>
            </AnimatedSidebarFooter>

            <AnimatedSidebarRail />
        </AnimatedSidebar>
    );
}