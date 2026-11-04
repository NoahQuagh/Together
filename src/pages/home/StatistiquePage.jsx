import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import './../../../assets/style/home/myproject.css';
import {useToast} from "@/components/ui/ToastNotification.jsx";
import {ErrorState} from "@/components/common/ErrorState.jsx";
import EmptyStates from "../../components/motion/empty-states/empty-states.tsx";
import {EmptyStateContainer} from "@/components/common/EmptyStateContainer.jsx";
import {DisableOption} from "@/components/common/DisableOption.jsx";

export function StatistiquePage() {
    const { t } = useTranslation();
    const { notify, showToast, updateToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*
    useEffect(() => {
        fetch(``, { credentials: 'include' })
            .then((res) => res.json())
            .then((res) => {
                if (!res.success) throw new Error(res.message);
                setProjects(res.data);
            })
            .catch(() => setError("an error occurred while loading your statistic data"))
            .finally(() => setLoading(false));
    }, []);


        if (loading) {
            return (
                <article className="dash-page">
                    <LoadingSpinner
                        caption={t('we are looking for your stats... even the ones you had forgotten about')}
                    />
                </arcle>
            );
        }

        if (error) {
            return (
                <article className="dash-page">
                    <ErrorState
                        title="Impossible de charger vos statistique"
                        description={error}
                        onRetry={() => window.location.reload()}
                    />
                </article>
            );
        }*/


    return (
        <article className={"flex justify-center content-center w-full"}>
            <DisableOption/>
        </article>
    );
}