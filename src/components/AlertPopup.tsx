import React from 'react';
import { useAlert } from './AlertContext';

const AlertPopup: React.FC = () => {
    const { alert, hideAlert } = useAlert();

    if (!alert) return null;

    const bgColor = 
        alert.type === 'success' ? '#4CAF50' :
        alert.type === 'error' ? '#F44336' : '#2196F3';

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            borderRadius: 8,
            backgroundColor: bgColor,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <span>{alert.message}</span>
            <button 
                onClick={hideAlert}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '0 0 0 10px'
                }}
            >
                ×
            </button>
        </div>
    );
};

export default AlertPopup;