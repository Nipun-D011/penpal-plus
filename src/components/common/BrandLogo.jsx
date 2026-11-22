export const BrandLogo = ({
  size = 'md',
  variant = 'dark', // 'dark' (navy backdrop with gold emblem) | 'light' (white backdrop with dark navy text)
  theme, // alias for variant
  subtitle = 'PEN PAL PLUS (PVT) LTD - BOOKSHOP & PRESS',
  badge = null,
  badgeVariant = 'gold', // 'gold' | 'blue' | 'slate'
  centered = false,
  className = '',
}) => {
  const activeVariant = theme || variant;
  const isDark = activeVariant === 'dark';

  const sizeClasses = {
    sm: {
      box: 'w-8 h-8 rounded-md text-xs',
      title: 'text-sm',
      sub: 'text-[9px]',
      gap: 'gap-2.5',
    },
    md: {
      box: 'w-9 h-9 rounded-lg text-sm',
      title: 'text-base',
      sub: 'text-[10px]',
      gap: 'gap-3',
    },
    lg: {
      box: 'w-12 h-12 rounded-xl text-lg',
      title: 'text-xl',
      sub: 'text-xs',
      gap: 'gap-3.5',
    },
  }[size] || {
    box: 'w-9 h-9 rounded-lg text-sm',
    title: 'text-base',
    sub: 'text-[10px]',
    gap: 'gap-3',
  };

  const badgeVariants = {
    gold: 'bg-amber-500/20 text-[#dfa84a] border border-[#dfa84a]/30',
    blue: 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
    slate: 'bg-slate-700/60 text-slate-300 border border-slate-600/50',
  };

  if (centered) {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Signature PP Gold Emblem */}
        <div
          className={`${sizeClasses.box} bg-[#dfa84a] flex items-center justify-center shadow-sm flex-shrink-0 font-serif font-black text-[#131d33] tracking-tight mb-2`}
        >
          PP
        </div>

        {/* Brand Title */}
        <div className="flex items-center justify-center gap-2">
          <span
            className={`font-serif font-bold ${sizeClasses.title} tracking-tight leading-snug ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Pen Pal Plus
          </span>
          {badge && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                badgeVariants[badgeVariant] || badgeVariants.gold
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Official Subtext */}
        {subtitle && (
          <span
            className={`${sizeClasses.sub} ${
              isDark ? 'text-[#dfa84a]' : 'text-amber-700 font-semibold'
            } font-bold tracking-wider uppercase mt-1`}
          >
            {subtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${sizeClasses.gap} select-none ${className}`}>
      {/* Signature PP Gold Emblem */}
      <div
        className={`${sizeClasses.box} bg-[#dfa84a] flex items-center justify-center shadow-sm flex-shrink-0 font-serif font-black text-[#131d33] tracking-tight`}
      >
        PP
      </div>

      {/* Brand Title & Tagline / Badge */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`font-serif font-bold ${sizeClasses.title} tracking-tight leading-snug truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Pen Pal Plus
          </span>

          {badge && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${
                badgeVariants[badgeVariant] || badgeVariants.gold
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <span
            className={`${sizeClasses.sub} ${
              isDark ? 'text-[#dfa84a]' : 'text-slate-500'
            } font-bold tracking-wider uppercase mt-0.5 truncate`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
