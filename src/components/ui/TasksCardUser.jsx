import React from "react";
import { useToolbox } from "@/hooks/useToolbox";
import '../../../assets/style/ui/TasksCardStyleUser.css';

export function TasksCardUser({ task, onClickTask }) {
    const { formatDateTime } = useToolbox();

    return (
        <li
            onClick={onClickTask}
            className={`flex flex-col justify-between p-4 tcuCard border rounded-xl cursor-pointer transition-colors ${
                task.isLate
                    ? 'taskLate'
                    : ''
            }`}
        >
            <div className="flex items-start tcuCardHeader justify-between gap-2 mb-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <i className="ti ti-clipboard-list text-lg" />
                        <span>{task.titre_tache}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-second-tertiary)]">
                        <i className="ti ti-folder" />
                        <span>{task.projet_nom}</span>
                    </div>
                </div>
                <i className="ti ti-external-link tcuExternLink transition-colors" />
            </div>

            {task.desc_tache && (
                <p className="text-xs tcuCardDesc line-clamp-2 mb-4 leading-relaxed">
                    {task.desc_tache}
                </p>
            )}

            <div className="flex items-center tcuCardFooter justify-between pt-3 border-t border-white/5 text-[11px]">
                <div className="flex items-center gap-1">
                    <i className="ti ti-calendar" />
                    <span>{formatDateTime ? formatDateTime(task.date_fin) : task.date_fin}</span>
                </div>
            </div>
        </li>
    );
}