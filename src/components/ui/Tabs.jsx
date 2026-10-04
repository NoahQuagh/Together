import React from 'react';
import { motion } from 'framer-motion';

export function Tabs({ tabs, activeTab, onChange, variant = 'pill' }) {
    const isLine = variant === 'line';

    return (
        <div
            className={`tabs flex items-center gap-1.5 w-full ${
                isLine
                    ? 'border-b border-white/10 pb-0.5'
                    : 'rounded-xl p-1 border border-white/10 backdrop-blur-md'
            }`}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                // Couleur forcée en style inline pour neutraliser les styles CSS externes
                const activeStyle = isActive
                    ? { color: isLine ? 'var(--accent)' : '#ffffff' }
                    : {};

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={`relative flex items-center justify-center w-full gap-2 font-medium transition-colors cursor-pointer select-none ${
                            isLine
                                ? `px-3 py-2 text-sm ${
                                    isActive ? '' : 'text-zinc-400 hover:text-zinc-200'
                                }`
                                : `rounded-lg px-3.5 py-1.5 text-sm ${
                                    isActive ? '' : 'text-zinc-400 hover:text-zinc-200'
                                }`
                        }`}
                    >
                        {!isLine && isActive && (
                            <motion.div
                                layoutId="activeTabPill"
                                className="absolute inset-0 rounded-lg bg-[var(--box-icon-color-hover)] shadow-md shadow-[var(--accent)]/30"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                        )}

                        {tab.icon && (
                            <i
                                className={`ti ${tab.icon} relative z-10 text-base`}
                                style={activeStyle}
                                aria-hidden="true"
                            />
                        )}

                        <span className="relative z-10" style={activeStyle}>
                            {tab.label}
                        </span>

                        {isLine && isActive && (
                            <motion.div
                                layoutId="activeTabLine"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)] shadow-sm shadow-[var(--accent)]/50"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}