import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-start justify-between
              ${toast.variant === 'destructive' ? 'bg-red-500 text-white' :
                toast.variant === 'success' ? 'bg-green-500 text-white' :
                toast.variant === 'warning' ? 'bg-amber-500 text-white' :
                'bg-gray-800 text-white'}
            `}
          >
            <div>
              {toast.title && (
                <h4 className="font-bold">{toast.title}</h4>
              )}
              {toast.description && (
                <p>{toast.description}</p>
              )}
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const toast = ({ title, description, variant = "default" }) => {
  if (typeof window !== "undefined") {
    // Create a custom event
    const event = new CustomEvent("toast", { 
      detail: { title, description, variant } 
    });
    window.dispatchEvent(event);
  }
};

// Event listener component to handle toast events
export const ToastListener = () => {
  const { addToast } = useToast();
  
  useEffect(() => {
    const handleToast = (event) => {
      addToast(event.detail);
    };
    
    window.addEventListener("toast", handleToast);
    
    return () => {
      window.removeEventListener("toast", handleToast);
    };
  }, [addToast]);
  
  return null;
};