import layout from '@splunk/react-page';
import { getUserTheme } from '@splunk/splunk-utils/themes';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

import CredentialsApp from './HttpCredentials';

// Loading component
function LoadingScreen() {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '400px',
            gap: '20px'
        }}>
            <WaitSpinner size="large" />
            <div style={{ fontSize: '16px', color: '#666' }}>
                Loading credentials manager...
            </div>
        </div>
    );
}

// Initialize the React application with Splunk theming
getUserTheme()
    .then((theme) => {
        layout(
            <CredentialsApp />,
            {
                theme,
                pageTitle: 'HTTP Alert Authentication',
            },
            document.getElementById('main-content') || document.body
        );
    })
    .catch((error) => {
        console.error('Failed to initialize app:', error);
        const errorElement = document.createElement('div');
        errorElement.style.color = 'red';
        errorElement.style.padding = '20px';
        errorElement.textContent = `Error: ${error.message || 'Failed to load application'}`;
        const target = document.getElementById('main-content') || document.body;
        target.appendChild(errorElement);
    });
