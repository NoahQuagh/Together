import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import '../../../assets/style/tools/zone-travaux.css'

export function WorkInProgress() {
    const { t } = useTranslation();

    return (
        <div className="wip-block block-trav">
            <div className="wip-icon-wrap">
                <i className="ti ti-crane" aria-hidden="true" />
                <span className="wip-badge">!</span>
            </div>
            <p className="wip-title">{t('section under construction')}</p>
            <p className="wip-desc">{t('this section is being developed and will be available soon')}</p>
            <div className="wip-dots">
                <div className="wip-dot" />
                <div className="wip-dot" />
                <div className="wip-dot" />
            </div>
        </div>
    );
}