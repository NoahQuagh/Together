import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useSidebar} from '../motion/animated-sidebar';
import './../../../assets/style/navigation/header.css';
import {Breadcrumb} from "./Breadcrumb.jsx";
import {CustomAvatar} from "../ui/CustomAvatar.jsx";
import {MorphingSearch} from "@/components/motion/morphing-search.jsx";
import {BloomMenu} from "@/components/motion/bloom-menu.jsx";

export function Header({
                           title = "Together",
                           titleLink = "/",
                           searchPlaceholder = "Rechercher...",
                           onSearch,
                           searchItems = [],
                           actions = [],
                           user,
                           tabs,
                       }) {
    const {toggleSidebar} = useSidebar();
    const navigate = useNavigate();

    const CurrentUser = user?.name ?? '' ;
    const CurrentAvatar= user?.avatarUrl ?? '';

    const handleSelectResult = (item) => {
        console.log("Élément sélectionné :", item.id);

        if (item.id === "dashboard") navigate("/dashboard");
        if (item.id === "projects") navigate("/myprojects");
        if (item.id === "tasks") navigate("/tasks");
        if (item.id === "settings") navigate("/profile/settings");
    };


    return (
        <header className="w-full border-[var(--color-main-quaternary)]">
            <section className="header-disposition-top">

                <div className="header-disposition-left" style={{marginLeft: '5px'}}>
                    <button className="sb-close" onClick={toggleSidebar} type="button">
                        <i className="ti ti-layout-sidebar" aria-hidden={true}></i>
                    </button>
                    <Breadcrumb user={user}/>
                </div>

                <div className="header-disposition-left">
                    <div className="w-full max-w-[18rem]">
                        <MorphingSearch
                            items={searchItems}
                            placeholder={searchPlaceholder}
                            onSelect={handleSelectResult}
                        />
                    </div>

                    {actions.map((action, idx) => {
                        if (action.component) {
                            return <React.Fragment key={idx}>{action.component}</React.Fragment>;
                        }

                        return action.to ? (
                            <Link key={idx} className="menu account-menu tooltip-container" to={action.to}>
                                <i className={action.icon} aria-hidden="true"/>
                                {action.tooltip && <span className="tooltip-text normalHelp">{action.tooltip}</span>}
                            </Link>
                        ) : (
                            <div key={idx} className="newProjectBtn tooltip-container" onClick={action.onClick}>
                                <i className={action.icon} aria-hidden="true"/>
                                {action.text && <p>{action.text}</p>}
                                {action.tooltip && <span className="tooltip-text normalHelp">{action.tooltip}</span>}
                            </div>
                        );
                    })}

                    <Link to={"/profile"}>
                        <CustomAvatar
                            size="md"
                            variant="blue"
                            src={CurrentAvatar}
                            name={CurrentUser}
                        />
                    </Link>
                </div>
            </section>

            {tabs}
        </header>
    );
}