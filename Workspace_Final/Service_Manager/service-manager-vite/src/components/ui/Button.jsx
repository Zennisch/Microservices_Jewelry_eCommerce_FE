const Button = ({ 
  children, 
  className = "", 
  variant = "default",
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 text-gray-700 hover:bg-gray-50";
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700";
      default:
        return "bg-amber-600 text-white hover:bg-amber-700";
    }
  };

  return (
    <button 
      className={`px-4 py-2 rounded-md font-medium transition-colors 
        ${getVariantClass()} 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };