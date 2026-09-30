import React, { useState, useEffect } from 'react';
import {useTranslation} from "@/context/LanguageContext.jsx";

export function ProjectOverviewPage(){
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    return (
        <h1>project</h1>
    )
}