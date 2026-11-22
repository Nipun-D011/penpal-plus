export const BrandLogo = ({
  badge = null,
  badgeVariant = 'gold', // 'gold' | 'blue' | 'slate'
  subtitle = 'BOOKSHOP & PRESS',
  theme = 'dark', // 'dark' | 'light'
  size = 'md',
  className = '',
}) => {
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: {
      box: 'w-8 h-8 rounded-md text-xs',
      title: 'text-sm',
      sub: 'text-[9px]',
    },
    md: {
      box: 'w-9 h-9 rounded-lg text-sm',
      title: 'text-base',
      sub: 'text-[10px]',
    },
    lg: {
      box: 'w-11 h-11 rounded-xl text-base',
      title: 'text-lg',
      sub: 'text-xs',
    },
  }[size] || {
    box: 'w-9 h-9 rounded-lg text-sm',
    title: 'text-base',
    sub: 'text-[10px]',
  };

  const badgeVariants = {
    gold: 'bg-amber-500/20 text-[#dfa84a] border border-[#dfa84a]/30',
    blue: 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
    slate: 'bg-slate-700/60 text-slate-300 border border-slate-600/50',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Signature PP Gold Box */}
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
