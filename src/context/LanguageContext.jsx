import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('fr');
    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState(true);

    const baseUrl = import.meta.env.VITE_APP_BASE_URL || '';

    useEffect(() => {
        setLoading(true);

        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const apiUrl = `${cleanBaseUrl}/api/translations.php?lang=${lang}`;

        fetch(apiUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setTranslations(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur chargement traductions :", err);
                setLoading(false);
            });
    }, [lang]);

    const t = (key) => {
        if (!translations || Object.keys(translations).length === 0) {
            return key;
        }
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ t, lang, setLang, loading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useTranslation = () => useContext(LanguageContext);