import { useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import Message from '@splunk/react-ui/Message';
import P from '@splunk/react-ui/Paragraph';
import TrashCanCross from '@splunk/react-icons/TrashCanCross';

import { ActionButtons } from './styles';
import { removeCredential } from './api';

function CredentialRemover({ name, app, onComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOpen = () => {
        setError(null);
        setIsOpen(true);
    };

    const handleClose = () => {
        if (!isDeleting) {
            setIsOpen(false);
            setError(null);
        }
    };

    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        setError(null);

        try {
            await removeCredential(name, app);
            setIsOpen(false);
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.message || 'Failed to delete credential');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button
                appearance="destructive"
                onClick={handleOpen}
                icon={<TrashCanCross />}
                label="Delete"
            />

            <Modal
                onRequestClose={handleClose}
                open={isOpen}
                style={{ width: '500px' }}
            >
                <form onSubmit={handleConfirmDelete}>
                    <Modal.Header
                        title="Confirm Deletion"
                        onRequestClose={handleClose}
                    />

                    <Modal.Body>
                        {error && (
                            <Message type="error" appearance="fill">
                                {error}
                            </Message>
                        )}

                        <P>
                            Are you sure you want to permanently delete the credential 
                            <strong> "{name}"</strong>? This action cannot be undone.
                        </P>
                    </Modal.Body>

                    <Modal.Footer>
                        <ActionButtons>
                            <Button
                                appearance="secondary"
                                onClick={handleClose}
                                disabled={isDeleting}
                                label="Cancel"
                            />
                            <Button
                                appearance="destructive"
                                type="submit"
                                disabled={isDeleting}
                                label={isDeleting ? 'Deleting...' : 'Delete Credential'}
                            />
                        </ActionButtons>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default CredentialRemover;
