import React from 'react';
import { useAlert } from './AlertContext';

const AlertPopup: React.FC = () => {
    const { alert } = useAlert();

    if (!alert) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            padding: '12px 20px',
            borderRadius: 8,
            backgroundColor: {
                success: '#4CAF50',
                warning: '#2196F3',
                danger: '#FFC107'
            }[alert.type],
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
        }}>
            {alert.message}
        </div>
    );
};

export default AlertPopup;
