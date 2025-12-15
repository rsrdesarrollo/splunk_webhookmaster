import { useState, useEffect, useCallback } from 'react';
import Table from '@splunk/react-ui/Table';
import Message from '@splunk/react-ui/Message';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

import CredentialEditor from './CredentialEditor';
import CredentialCreator from './CredentialCreator';
import CredentialRemover from './CredentialRemover';
import { MainContainer, PageHeader, HeaderActions, InfoText } from './styles';
import { fetchAllCredentials } from './api';
import { getUserTheme } from '@splunk/splunk-utils/themes';

// Apply dark theme background if needed
getUserTheme().then((theme) => {
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#171d21';
    }
});

const CREDENTIAL_TYPES = {
    basic: 'Basic Authentication',
    header: 'Custom Header',
    bearer: 'Bearer Token',
};

const REALM_NAME = 'http_alert';

// Parse credential data from Splunk storage format
function parseCredentialEntry(entry) {
    const baseData = {
        name: entry.content.username,
        app: entry.acl.app,
        sharing: entry.acl.sharing,
        owner: entry.acl.owner,
    };

    try {
        const credentialData = JSON.parse(entry.content.clear_password);
        return { ...baseData, ...credentialData };
    } catch (parseError) {
        console.error('Credential parse error:', parseError);
        return { ...baseData, type: 'unknown', error: true };
    }
}

const CredentialsApp = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [credentials, setCredentials] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [needsRefresh, setNeedsRefresh] = useState(0);

    // Load credentials from Splunk
    const loadCredentials = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetchAllCredentials();
            
            // Filter and parse credentials for our realm
            const httpCredentials = response.entry
                .filter((entry) => entry.content.realm === REALM_NAME)
                .map(parseCredentialEntry);
            
            setCredentials(httpCredentials);
        } catch (err) {
            console.error('Failed to load credentials:', err);
            setErrorMessage(err.message || 'Unable to load credentials');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load credentials on mount and when refresh is triggered
    useEffect(() => {
        loadCredentials();
    }, [needsRefresh, loadCredentials]);

    const triggerRefresh = () => setNeedsRefresh((prev) => prev + 1);

    // Render loading state
    if (isLoading) {
        return (
            <MainContainer>
                <WaitSpinner size="large" />
                <InfoText>Loading credentials...</InfoText>
            </MainContainer>
        );
    }

    // Render error state
    if (errorMessage) {
        return (
            <MainContainer>
                <Message type="error">{errorMessage}</Message>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <PageHeader>
                <h1>HTTP Alert Authentication credentials</h1>
                <HeaderActions>
                    <CredentialCreator onComplete={triggerRefresh} />
                </HeaderActions>
            </PageHeader>
            
            <InfoText>
                Manage authentication credentials for HTTP alert actions. 
                Credentials are securely stored and encrypted.
            </InfoText>

            {credentials.length === 0 ? (
                <Message type="info">
                    No credentials configured. Click "Add Credential" to create one.
                </Message>
            ) : (
                <Table stripeRows>
                    <Table.Head>
                        <Table.HeadCell>Credential Name</Table.HeadCell>
                        <Table.HeadCell>Type</Table.HeadCell>
                        <Table.HeadCell>Application</Table.HeadCell>
                        <Table.HeadCell>Owner</Table.HeadCell>
                        <Table.HeadCell>Sharing Level</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {credentials.map((credential) => (
                            <Table.Row key={credential.name}>
                                <Table.Cell>{credential.name}</Table.Cell>
                                <Table.Cell>
                                    {CREDENTIAL_TYPES[credential.type] || 'Unknown'}
                                </Table.Cell>
                                <Table.Cell>{credential.app}</Table.Cell>
                                <Table.Cell>{credential.owner}</Table.Cell>
                                <Table.Cell>{credential.sharing}</Table.Cell>
                                <Table.Cell>
                                    <CredentialEditor
                                        credential={credential}
                                        onComplete={triggerRefresh}
                                    />
                                    {' '}
                                    <CredentialRemover
                                        name={credential.name}
                                        app={credential.app}
                                        onComplete={triggerRefresh}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </MainContainer>
    );
};

export default CredentialsApp;
