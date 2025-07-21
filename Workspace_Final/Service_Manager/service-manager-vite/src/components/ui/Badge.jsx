const Badge = ({ children, className = "", ...props }) => {
  return (
    <span 
      className={`px-3 py-1 text-xs font-medium text-white rounded-full ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };