import React, { useState, useEffect } from "react";

const AVATAR_GRADIENTS = [
    "bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500",
    "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500",
    "bg-gradient-to-tr from-amber-500 via-rose-500 to-red-500",
    "bg-gradient-to-tr from-emerald-400 via-green-500 to-teal-600",
    "bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500",
    "bg-gradient-to-tr from-neutral-600 via-neutral-700 to-neutral-800",
];

const SIZES = {
    sm: "size-8 text-xs",
    md: "size-9 text-xs",
    lg: "size-20 text-sm",
};

/**
 * Renvoie un entier constant entre 0 et 5 basé sur une chaîne de caractères
 */
function getAvatarColorIndex(name) {
    if (!name || typeof name !== 'string') return 0;

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return Math.abs(hash) % 6;
}

export function CustomAvatar({
                                 size = "md",
                                 className = "",
                                 src,
                                 path= '/assets/uploads/avatars/',
                                 name = 'Utilisateur',
                                 mode = 'imgOnly',
                                 role = 'utilisateur',
                                 showTooltip = false
                             }) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [path+src]);

    const colorIndex = getAvatarColorIndex(name);
    const sizeClass = SIZES[size] || SIZES.md;
    const gradientClass = AVATAR_GRADIENTS[colorIndex];

    const initiales = (str) => {
        if (!str) return '?';
        return str.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className={`group relative inline-flex shrink-0 ${className} flex flex-row gap-2 ${mode === 'card' ? 'bg-[var(--color-main-primary)] px-3 py-2 rounded-[var(--radiusBox-sm)] border border-[var(--color-main-quaternary)]' : ''}`}>
            <div className={`relative rounded-full overflow-hidden flex items-center justify-center font-semibold select-none ${sizeClass} ${path+src && !imageError ? '' : gradientClass}`}>
                {path+src && !imageError ? (
                        <img
                            src={`${path || ''}${src}`}
                            alt={name || 'Avatar'}
                            className="size-full object-cover rounded-full"
                            onError={() => setImageError(true)}
                        />
                ) : (
                    <span className="text-white font-normal fontFamDMSans drop-shadow-sm">
                        {initiales(name)}
                    </span>
                )}

            </div>

            {showTooltip && (name || role) && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none flex flex-col items-center">
                    <div className="w-2 h-2 bg-zinc-900 border-t border-l border-zinc-800 rotate-45 -mb-1" />

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 shadow-xl text-center whitespace-nowrap">
                        {name && <div className="text-xs font-semibold text-white">{name}</div>}
                        {role && <div className="text-[10px] text-zinc-400 font-medium">{role}</div>}
                    </div>
                </div>
            )}
            {mode === 'card' ? (
                <div className="flex items-center justify-center">
                    <span className={'text-[var(--color-second-primary)] fontFamDMSans font-semibold text-base'}>{name}</span>
                </div>
            ) : (
                ''
            )}
        </div>
    );
}