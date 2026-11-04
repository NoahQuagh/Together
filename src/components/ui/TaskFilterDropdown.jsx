import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';

export function TaskFilterDropdown({ membersList = [], onApplyFilters, initialFilters = {} }) {
    const { t } = useTranslation();

    const containerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const [selectedSort, setSelectedSort] = useState(initialFilters.sort || '');
    const [selectedStatuses, setSelectedStatuses] = useState(new Set(initialFilters.statut || []));
    const [selectedPriorities, setSelectedPriorities] = useState(new Set(initialFilters.priorite || []));
    const [selectedAssignees, setSelectedAssignees] = useState(new Set(initialFilters.assignee || []));

    useEffect(() => {
        if (initialFilters) {
            setSelectedSort(initialFilters.sort || '');
            setSelectedStatuses(new Set(initialFilters.statut || []));
            setSelectedPriorities(new Set(initialFilters.priorite || []));
            setSelectedAssignees(new Set(initialFilters.assignee || []));
        }
    }, [initialFilters]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setActiveSubmenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filterSections = [
        {
            id: 'sort',
            label: t('alphabetical order'),
            icon: 'ti-sort-ascending text-zinc-400',
            type: 'single',
            items: [
                { id: 'asc', label: t('A to Z') },
                { id: 'desc', label: t('Z to A') }
            ]
        },
        {
            id: 'status',
            label: t('status'),
            icon: 'ti-loader text-blue-400',
            type: 'multiple',
            items: [
                { id: '1', label: t('waiting'), icon: 'ti-clock text-zinc-400' },
                { id: '2', label: t('in progress'), icon: 'ti-player-play text-blue-400' },
                { id: '3', label: t('in review'), icon: 'ti-eye text-yellow-400' },
                { id: '4', label: t('finished'), icon: 'ti-circle-check text-green-400' }
            ]
        },
        {
            id: 'priority',
            label: t('priority'),
            icon: 'ti-alert-triangle text-amber-400',
            type: 'multiple',
            items: [
                { id: '4', label: t('critical'), icon: 'ti-flame text-red-500' },
                { id: '3', label: t('high'), icon: 'ti-arrow-up text-amber-500' },
                { id: '2', label: t('normal'), icon: 'ti-minus text-blue-400' },
                { id: '1', label: t('low'), icon: 'ti-arrow-down text-zinc-400' }
            ]
        },
        {
            id: 'assignee',
            label: t('assigned to'),
            icon: 'ti-user text-purple-400',
            type: 'multiple',
            items: membersList.map(m => ({
                id: String(m.member_id || m.id),
                label: m.member_nom || m.nom
            }))
        }
    ];

    const handleToggleFilter = (sectionId, itemId) => {
        let newSort = selectedSort;
        let newStatuses = new Set(selectedStatuses);
        let newPriorities = new Set(selectedPriorities);
        let newAssignees = new Set(selectedAssignees);

        if (sectionId === 'sort') {
            newSort = newSort === itemId ? '' : itemId;
            setSelectedSort(newSort);
        } else if (sectionId === 'status') {
            if (newStatuses.has(itemId)) newStatuses.delete(itemId);
            else newStatuses.add(itemId);
            setSelectedStatuses(new Set(newStatuses));
        } else if (sectionId === 'priority') {
            if (newPriorities.has(itemId)) newPriorities.delete(itemId);
            else newPriorities.add(itemId);
            setSelectedPriorities(new Set(newPriorities));
        } else if (sectionId === 'assignee') {
            if (newAssignees.has(itemId)) newAssignees.delete(itemId);
            else newAssignees.add(itemId);
            setSelectedAssignees(new Set(newAssignees));
        }

        const updatedFilters = {
            sort: newSort,
            statut: Array.from(newStatuses),
            priorite: Array.from(newPriorities),
            assignee: Array.from(newAssignees),
        };

        const totalActive = (newSort ? 1 : 0) + newStatuses.size + newPriorities.size + newAssignees.size;
        onApplyFilters(updatedFilters, totalActive);
    };

    const handleResetAll = () => {
        setSelectedSort('');
        setSelectedStatuses(new Set());
        setSelectedPriorities(new Set());
        setSelectedAssignees(new Set());
        setActiveSubmenu(null);
        onApplyFilters({ sort: '', statut: [], priorite: [], assignee: [] }, 0);
    };

    const totalActiveCount = (selectedSort ? 1 : 0) + selectedStatuses.size + selectedPriorities.size + selectedAssignees.size;

    const isItemSelected = (sectionId, itemId) => {
        if (sectionId === 'sort') return selectedSort === itemId;
        if (sectionId === 'status') return selectedStatuses.has(itemId);
        if (sectionId === 'priority') return selectedPriorities.has(itemId);
        if (sectionId === 'assignee') return selectedAssignees.has(itemId);
        return false;
    };

    const getSectionBadgeCount = (sectionId) => {
        if (sectionId === 'sort') return selectedSort ? 1 : 0;
        if (sectionId === 'status') return selectedStatuses.size;
        if (sectionId === 'priority') return selectedPriorities.size;
        if (sectionId === 'assignee') return selectedAssignees.size;
        return 0;
    };

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <button
                type="button"
                className="items-center pro-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <i className="ti ti-filter text-base" />
                <span className="whitespace-nowrap font-medium text-sm">{t('filter by')}</span>
                {totalActiveCount > 0 && (
                    <span className="font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full text-xs">
                        {totalActiveCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    className="absolute left-0 top-full mt-1.5 z-50 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 text-zinc-200 !flex !flex-col !justify-start !gap-1"
                    onMouseLeave={() => setActiveSubmenu(null)}
                >
                    {filterSections.map((section) => {
                        const count = getSectionBadgeCount(section.id);
                        const isSubmenuOpen = activeSubmenu === section.id;

                        return (
                            <div
                                key={section.id}
                                className="relative w-full"
                                onMouseEnter={() => setActiveSubmenu(section.id)}
                            >
                                <div
                                    onClick={() => setActiveSubmenu(isSubmenuOpen ? null : section.id)}
                                    className={`!flex !flex-row items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                                        isSubmenuOpen ? 'bg-zinc-800 text-white font-medium' : 'hover:bg-zinc-800/60 text-zinc-300'
                                    }`}
                                >
                                    <div className="!flex !flex-row items-center gap-2.5 min-w-0">
                                        <i className={`ti ${section.icon} text-base shrink-0`} />
                                        <span className="truncate whitespace-nowrap text-sm">{section.label}</span>
                                    </div>

                                    <div className="!flex !flex-row items-center gap-1.5 shrink-0 ml-2">
                                        {count > 0 && (
                                            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                                                {count}
                                            </span>
                                        )}
                                        <i className="ti ti-chevron-right text-xs text-zinc-500" />
                                    </div>
                                </div>

                                {isSubmenuOpen && (
                                    <div className="absolute left-full top-0 ml-1.5 z-50 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 text-zinc-200 max-h-72 overflow-y-auto !flex !flex-col !justify-start !gap-1">

                                        {section.items.map((item) => {
                                            const selected = isItemSelected(section.id, item.id);
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleFilter(section.id, item.id);
                                                    }}
                                                    className={`w-full !flex !flex-row items-center justify-between px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                                                        selected ? 'bg-blue-500/15 text-blue-400 font-medium' : 'hover:bg-zinc-800 text-zinc-300'
                                                    }`}
                                                >
                                                    <div className="!flex !flex-row items-center gap-2.5 min-w-0">
                                                        {item.icon && <i className={`ti ${item.icon} text-base shrink-0`} />}
                                                        <span className="truncate whitespace-nowrap text-sm">{item.label}</span>
                                                    </div>

                                                    {selected && (
                                                        <i className="ti ti-check text-blue-400 text-base font-bold shrink-0 ml-2" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="border-t border-zinc-800 mt-1 pt-1">
                        <div
                            onClick={handleResetAll}
                            className="w-full !flex !flex-row items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                            <i className="ti ti-refresh shrink-0" />
                            <span className="whitespace-nowrap">{t('reset')}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}