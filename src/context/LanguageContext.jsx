import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('fr');
    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/translations.php?lang=${lang}`)
            .then((res) => res.json())
            .then((data) => {
                setTranslations(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur de chargement des traductions:", err);
                setLoading(false);
            });
    }, [lang]);

    const t = (key) => {
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ t, lang, setLang, loading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useTranslation = () => useContext(LanguageContext);