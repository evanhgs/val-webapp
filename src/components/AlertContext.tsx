import { createContext, useState, useContext, ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'info';

interface Alert {
    message: string;
    type: AlertType;
}

interface AlertPopup {
    alert: Alert | null;
    showAlert: (message: string, type: AlertType) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertPopup | undefined>(undefined);

export const AlertProvider = ({children}: {children: ReactNode}) => {

    const [alert, setAlert] = useState<Alert | null>(null);
    const showAlert = (message: string, type: AlertType) => {
        setAlert({message, type});
        setTimeout(() => setAlert(null), 3000);
    }
    const hideAlert = () => setAlert(null);

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};