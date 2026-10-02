function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        bg-[#111827]
        border
        border-white/10
        rounded-3xl
        shadow-lg
        transition-all
        duration-300
        hover:border-blue-500/30
        hover:shadow-blue-500/20
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default GlassCard;