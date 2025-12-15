import { useState, useEffect } from 'react';
import Button from '@splunk/react-ui/Button';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Modal from '@splunk/react-ui/Modal';
import Text from '@splunk/react-ui/Text';
import Select from '@splunk/react-ui/Select';
import Switch from '@splunk/react-ui/Switch';
import Message from '@splunk/react-ui/Message';
import Plus from '@splunk/react-icons/Plus';

import { FormSection, ActionButtons } from './styles';
import { createCredential, updateCredentialACL, fetchAppsList } from './api';
import CredentialInputs from './CredentialInputs';

const INITIAL_FORM_STATE = {
    type: 'basic',
    username: '',
    password: '',
    header_name: '',
    header_value: '',
    token: '',
    hmac_secret: '',
    hmac_hash_function: 'sha256',
    hmac_digest_type: 'hex',
    hmac_sig_header: '',
    hmac_time_header: '',
};

function CredentialCreator({ onComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [credentialName, setCredentialName] = useState('');
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Advanced options
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [availableApps, setAvailableApps] = useState([]);
    const [selectedApp, setSelectedApp] = useState('webhookmaster');
    const [sharingLevel, setSharingLevel] = useState('global');
    const [readPerms, setReadPerms] = useState('*');
    const [writePerms, setWritePerms] = useState('*');

    useEffect(() => {
        if (isOpen) {
            fetchAppsList()
                .then(setAvailableApps)
                .catch((err) => console.error('Failed to load apps:', err));
        }
    }, [isOpen]);

    const handleOpen = () => {
        setFormData(INITIAL_FORM_STATE);
        setCredentialName('');
        setError(null);
        setShowAdvanced(false);
        setIsOpen(true);
    };

    const handleClose = () => {
        if (!isSaving) {
            setIsOpen(false);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!credentialName.trim()) {
            setError('Credential name is required');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const result = await createCredential(formData, credentialName, selectedApp);
            
            if (showAdvanced) {
                await updateCredentialACL(
                    result.editUrl,
                    result.owner,
                    sharingLevel,
                    readPerms,
                    writePerms
                );
            }

            setIsOpen(false);
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.message || 'Failed to create credential');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Button
                appearance="primary"
                onClick={handleOpen}
                icon={<Plus />}
                label="Add Credential"
            />

            <Modal
                onRequestClose={handleClose}
                open={isOpen}
                style={{ width: '650px' }}
            >
                <form onSubmit={handleSubmit}>
                    <Modal.Header
                        title="Create New Credential"
                        onRequestClose={handleClose}
                    />

                    <Modal.Body>
                        {error && (
                            <Message type="error" appearance="fill">
                                {error}
                            </Message>
                        )}

                        <FormSection>
                            <ControlGroup label="Credential Name" labelPosition="top">
                                <Text
                                    value={credentialName}
                                    onChange={(e) => setCredentialName(e.target.value)}
                                    placeholder="e.g., api-server-auth"
                                />
                            </ControlGroup>
                        </FormSection>

                        <FormSection>
                            <ControlGroup label="Authentication Type" labelPosition="top">
                                <Select
                                    value={formData.type}
                                    onChange={(e, { value }) =>
                                        setFormData({ ...INITIAL_FORM_STATE, type: value })
                                    }
                                >
                                    <Select.Option label="Basic Authentication" value="basic" />
                                    <Select.Option label="Custom Header" value="header" />
                                    <Select.Option label="Bearer Token" value="bearer" />
                                    <Select.Option label="HMAC Authentication" value="hmac" />
                                </Select>
                            </ControlGroup>
                        </FormSection>

                        <CredentialInputs
                            type={formData.type}
                            data={formData}
                            onChange={setFormData}
                        />

                        <FormSection>
                            <Switch
                                value="advanced"
                                selected={showAdvanced}
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                appearance="checkbox"
                            >
                                Show Advanced Options
                            </Switch>
                        </FormSection>

                        {showAdvanced && (
                            <>
                                <FormSection>
                                    <ControlGroup label="App Context" labelPosition="top">
                                        <Select
                                            value={selectedApp}
                                            onChange={(e, { value }) => setSelectedApp(value)}
                                        >
                                            {availableApps.map((app) => (
                                                <Select.Option key={app} label={app} value={app} />
                                            ))}
                                        </Select>
                                    </ControlGroup>
                                </FormSection>

                                <FormSection>
                                    <ControlGroup label="Sharing Level" labelPosition="top">
                                        <Select
                                            value={sharingLevel}
                                            onChange={(e, { value }) => setSharingLevel(value)}
                                        >
                                            <Select.Option label="Global" value="global" />
                                            <Select.Option label="App" value="app" />
                                            <Select.Option label="Private" value="user" />
                                        </Select>
                                    </ControlGroup>
                                </FormSection>

                                <FormSection>
                                    <ControlGroup label="Read Permissions" labelPosition="top">
                                        <Text
                                            value={readPerms}
                                            onChange={(e) => setReadPerms(e.target.value)}
                                            placeholder="e.g., *, admin, power"
                                        />
                                    </ControlGroup>
                                </FormSection>

                                <FormSection>
                                    <ControlGroup label="Write Permissions" labelPosition="top">
                                        <Text
                                            value={writePerms}
                                            onChange={(e) => setWritePerms(e.target.value)}
                                            placeholder="e.g., *, admin"
                                        />
                                    </ControlGroup>
                                </FormSection>
                            </>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <ActionButtons>
                            <Button
                                appearance="secondary"
                                onClick={handleClose}
                                disabled={isSaving}
                                label="Cancel"
                            />
                            <Button
                                appearance="primary"
                                type="submit"
                                disabled={isSaving}
                                label={isSaving ? 'Creating...' : 'Create Credential'}
                            />
                        </ActionButtons>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default CredentialCreator;
