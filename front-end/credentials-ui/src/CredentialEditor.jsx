import { useState } from 'react';
import Button from '@splunk/react-ui/Button';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Modal from '@splunk/react-ui/Modal';
import Text from '@splunk/react-ui/Text';
import Message from '@splunk/react-ui/Message';
import Pencil from '@splunk/react-icons/Pencil';

import { FormSection, ActionButtons } from './styles';
import { updateCredential } from './api';
import CredentialInputs from './CredentialInputs';

function CredentialEditor({ credential, onComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(credential);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleOpen = () => {
        setFormData(credential);
        setError(null);
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
        setIsSaving(true);
        setError(null);

        try {
            await updateCredential(formData, credential.name, credential.app);
            setIsOpen(false);
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.message || 'Failed to update credential');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Button
                appearance="secondary"
                onClick={handleOpen}
                icon={<Pencil />}
                label="Edit"
            />

            <Modal
                onRequestClose={handleClose}
                open={isOpen}
                style={{ width: '600px' }}
            >
                <form onSubmit={handleSubmit}>
                    <Modal.Header
                        title="Edit Credential"
                        onRequestClose={handleClose}
                    />

                    <Modal.Body>
                        {error && (
                            <Message type="error" appearance="fill">
                                {error}
                            </Message>
                        )}

                        <FormSection>
                            <ControlGroup label="Credential Name">
                                <Text value={credential.name} disabled />
                            </ControlGroup>
                        </FormSection>

                        <FormSection>
                            <ControlGroup label="Type">
                                <Text value={credential.type} disabled />
                            </ControlGroup>
                        </FormSection>

                        <CredentialInputs
                            type={formData.type}
                            data={formData}
                            onChange={setFormData}
                        />
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
                                label={isSaving ? 'Saving...' : 'Save Changes'}
                            />
                        </ActionButtons>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default CredentialEditor;
