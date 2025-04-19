import { useState, useEffect } from "react";

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

export const AlertPopup = ({message, type}: AlertProps) => {

    const [alert] = useState<AlertProps | null>({message, type});
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(()=> {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);

    }, [message])

    if (!isVisible) return null;

    return (
        <>
            {alert && (
                <div 
                    className={`absolute top-4 left-1/2 transform -translate-x-1/2 rounded-md px-4 py-2 shadow-lg text-white text-sm font-medium z-50 transition-all duration-300 ${
                        type === 'success' ? 'bg-green-500' : 
                        type === 'error' ? 'bg-red-500' : 'bg-orange-400'
                    }`}
                    style={{ minWidth: '200px', maxWidth: '80%' }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {type === 'success' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            {type === 'error' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            {type === 'info' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span>{message}</span>
                        </div>
                        <button 
                            onClick={() => setIsVisible(false)} 
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    )
} 