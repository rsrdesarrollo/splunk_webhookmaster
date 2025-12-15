import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';

export const API_BASE = '/en-US/splunkd/__raw';
export const REALM_NAME = 'httpalert';

// Fetch list of available Splunk apps
export async function fetchAppsList() {
    const endpoint = `${API_BASE}/services/apps/local?output_mode=json&count=0`;

    try {
        const response = await fetch(endpoint, {
            ...defaultFetchInit,
            method: 'GET',
        });
        const data = await handleResponse(200)(response);
        return data.entry.map((app) => app.name);
    } catch (error) {
        throw handleError('Failed to retrieve apps list')(error);
    }
}

// Fetch all credentials from password storage
export async function fetchAllCredentials() {
    const endpoint = `${API_BASE}/servicesNS/nobody/-/storage/passwords?output_mode=json&count=0`;

    try {
        const response = await fetch(endpoint, {
            ...defaultFetchInit,
            method: 'GET',
        });
        return await handleResponse(200)(response);
    } catch (error) {
        throw handleError('Failed to fetch credentials')(error);
    }
}

// Create a new credential
export async function createCredential(credentialData, credentialName, appContext) {
    const endpoint = `${API_BASE}/servicesNS/nobody/${appContext}/storage/passwords`;
    const encodedData = encodeURIComponent(JSON.stringify(credentialData));

    try {
        const response = await fetch(endpoint, {
            ...defaultFetchInit,
            method: 'POST',
            body: `password=${encodedData}&name=${credentialName}&realm=${REALM_NAME}&output_mode=json`,
        });

        const result = await handleResponse(201)(response);
        return {
            editUrl: result.entry[0].links.edit,
            owner: result.entry[0].author,
        };
    } catch (error) {
        throw handleError('Failed to create credential')(error);
    }
}

// Update an existing credential
export async function updateCredential(credentialData, credentialName, appContext) {
    const endpoint = `${API_BASE}/servicesNS/nobody/${appContext}/storage/passwords/${REALM_NAME}:${credentialName}:`;
    const encodedData = encodeURIComponent(JSON.stringify(credentialData));

    try {
        const response = await fetch(endpoint, {
            ...defaultFetchInit,
            method: 'POST',
            body: `password=${encodedData}`,
        });

        return await handleResponse(200)(response);
    } catch (error) {
        throw handleError('Failed to update credential')(error);
    }
}

// Delete a credential
export async function removeCredential(credentialName, appContext) {
    const endpoint = `${API_BASE}/servicesNS/nobody/${appContext}/storage/passwords/${REALM_NAME}:${credentialName}:`;

    try {
        const response = await fetch(endpoint, {
            ...defaultFetchInit,
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return { success: true };
    } catch (error) {
        throw handleError('Failed to delete credential')(error);
    }
}

// Update credential sharing and permissions
export async function updateCredentialACL(editUrl, owner, sharingLevel, readPermissions, writePermissions) {
    const aclUrl = editUrl.replace('/storage/passwords/', '/configs/conf-passwords/credential%3A');
    const endpoint = `${API_BASE}${aclUrl}/acl`;

    try {
        const response = await fetch(endpoint, {
            ...defaultFetchInit,
            method: 'POST',
            body: new URLSearchParams({
                sharing: sharingLevel,
                owner: owner,
                'perms.read': readPermissions,
                'perms.write': writePermissions,
                output_mode: 'json',
            }),
        });

        await handleResponse(200)(response);
        return { success: true };
    } catch (error) {
        throw handleError('Failed to update permissions')(error);
    }
}
