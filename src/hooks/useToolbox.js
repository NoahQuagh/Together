import { useTranslation } from '../context/LanguageContext';
import * as toolbox from '../utils/toolbox';

export function useToolbox() {
    const { t } = useTranslation();

    return {
        ...toolbox,
        formatDate: (date) => toolbox.formatDate(date, t),
        formatDateTime: (date) => toolbox.formatDateTime(date, t),
    };
}