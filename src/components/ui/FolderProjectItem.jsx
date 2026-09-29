import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useToolbox } from '../../hooks/useToolbox';

export function FolderProjectItem({ project, onEdit, onChangeStatus, onDelete }) {
    const { t } = useTranslation();
    const { formatDate, statutBadge } = useToolbox();
    const navigate = useNavigate();

    const menuVariants = {
        hidden: { opacity: 0, scale: 0.92, y: -4 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 450, damping: 28 }
        },
        exit: {
            opacity: 0,
            scale: 0.94,
            y: -2,
            transition: { duration: 0.12, ease: "easeOut" }
        }
    };

    const handleOpen = () => {
        navigate(`/project/${project.project_uuid}`);
    };

    return (
        <ContextMenu.Root modal={false}>
            <ContextMenu.Trigger className="flex flex-col items-center justify-start cursor-pointer select-none group w-36">
                <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative w-32 h-24 flex items-end justify-center"
                    onClick={handleOpen}
                >
                    <div className="absolute top-1 left-2 w-12 h-10 bg-[#A3712A] rounded-t-md" />

                    <div className="absolute top-3 left-0 w-full h-[72px] bg-[#c88f34] rounded-xl shadow-sm" />

                    <div className="relative w-full h-[68px] bg-[#dc9b38] rounded-xl shadow-lg border-t border-white/20 flex items-end justify-center pb-2.5 z-10">
                        <div className="w-16 h-[2px] bg-white/20 rounded-full" />
                    </div>
                </motion.div>

                <div className="mt-2.5 text-center flex flex-col items-center gap-1 w-full">
          <span
              className="text-sm font-semibold text-white line-clamp-2 max-w-[130px] leading-tight min-h-[2.5rem] flex items-center justify-center"
              title={project.project_nom}
          >
            {project.project_nom}
          </span>
                    <span className={`badge ${statutBadge(project.project_statut_label)}`}>
            {t(project.project_statut_label)}
          </span>
                </div>
            </ContextMenu.Trigger>

            <ContextMenu.Portal>
                <ContextMenu.Content asChild alignOffset={5}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        className="min-w-[190px] bg-[var(--color-main-secondary)]  border border-white/15 rounded-xl p-1.5 shadow-2xl z-50 select-none"
                    >

                        <ContextMenu.Item
                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-200 rounded-lg outline-none cursor-pointer transition-colors duration-100 data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
                            onClick={() => onEdit(project)}
                        >
                            <i className="ti ti-pencil text-sm" />
                            <span className="flex-1 font-medium">{t('modify the project')}</span>
                        </ContextMenu.Item>

                        <ContextMenu.Separator className="h-px bg-white/10 my-1" />

                        <ContextMenu.Sub>
                            <ContextMenu.SubTrigger className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-200 rounded-lg outline-none cursor-pointer transition-colors duration-100 data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white">
                                <i className="ti ti-adjustments text-sm" />
                                <span className="flex-1 font-medium">{t('change status')}</span>
                                <i className="ti ti-chevron-right text-[10px] opacity-60" />
                            </ContextMenu.SubTrigger>

                            <ContextMenu.Portal>
                                <ContextMenu.SubContent asChild alignOffset={-4} sideOffset={4}>
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={menuVariants}
                                        className="min-w-[150px] bg-[var(--color-main-secondary)] border border-white/15 rounded-xl p-1.5 shadow-2xl z-50 select-none"
                                    >
                                        <ContextMenu.Item
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-200 rounded-lg outline-none cursor-pointer transition-colors duration-100 data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
                                            onClick={() => onChangeStatus(project.project_uuid, 'actif')}
                                        >
                                            <i className="ti ti-activity text-sm" />
                                            <span>{t('active')}</span>
                                        </ContextMenu.Item>
                                        <ContextMenu.Item
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-200 rounded-lg outline-none cursor-pointer transition-colors duration-100 data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
                                            onClick={() => onChangeStatus(project.project_uuid, 'pause')}
                                        >
                                            <i className="ti ti-player-pause text-sm" />
                                            <span>{t('paused')}</span>
                                        </ContextMenu.Item>
                                        <ContextMenu.Item
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-200 rounded-lg outline-none cursor-pointer transition-colors duration-100 data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
                                            onClick={() => onChangeStatus(project.project_uuid, 'termine')}
                                        >
                                            <i className="ti ti-check text-sm" />
                                            <span>{t('finished')}</span>
                                        </ContextMenu.Item>
                                    </motion.div>
                                </ContextMenu.SubContent>
                            </ContextMenu.Portal>
                        </ContextMenu.Sub>

                        <ContextMenu.Separator className="h-px bg-white/10 my-1" />

                        <ContextMenu.Item
                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 rounded-lg outline-none cursor-pointer transition-colors duration-100 data-[highlighted]:bg-red-600 data-[highlighted]:text-white"
                            onClick={() => onDelete(project)}
                        >
                            <i className="ti ti-trash text-sm" />
                            <span className="flex-1 font-medium">{t('delete the project')}</span>
                        </ContextMenu.Item>
                    </motion.div>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
}