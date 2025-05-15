export type AlertType = 'success' | 'error' | 'info';

export interface Alert {
    message: string;
    type: AlertType;
}

export interface AlertPopup {
    alert: Alert | null;
    showAlert: (message: string, type: AlertType) => void;
    hideAlert: () => void;
}