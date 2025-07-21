const Input = ({ className = "", ...props }) => {
  return (
    <input 
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export { Input };