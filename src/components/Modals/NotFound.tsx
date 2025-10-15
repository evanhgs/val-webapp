export const NotFound: React.FC = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            fontFamily: 'system-ui',
            background: '#f5f5f5',
            color: '#333',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '4rem', color: '#d32f2f' }}>404</h1>
            <p style={{ fontSize: '1.25rem' }}>Oups. La page que vous cherchez n’existe pas.</p>
            <a href="/public" style={{ color: '#1976d2', textDecoration: 'none' }}>Retour à l’accueil</a>
        </div>
    );
};
