import ControlGroup from '@splunk/react-ui/ControlGroup';
import Text from '@splunk/react-ui/Text';
import Select from '@splunk/react-ui/Select';

import { FormSection } from './styles';

function CredentialInputs({ type, data, onChange }) {
    const updateField = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    // Basic Authentication Form
    if (type === 'basic') {
        return (
            <>
                <FormSection>
                    <ControlGroup label="Username" labelPosition="top">
                        <Text
                            value={data.username || ''}
                            onChange={(e) => updateField('username', e.target.value)}
                            placeholder="Enter username"
                        />
                    </ControlGroup>
                </FormSection>

                <FormSection>
                    <ControlGroup label="Password" labelPosition="top">
                        <Text
                            type="password"
                            value={data.password || ''}
                            onChange={(e) => updateField('password', e.target.value)}
                            passwordVisibilityToggle
                            canClear
                            placeholder="Enter password"
                        />
                    </ControlGroup>
                </FormSection>
            </>
        );
    }

    // Custom Header Form
    if (type === 'header') {
        return (
            <>
                <FormSection>
                    <ControlGroup 
                        label="Header Name" 
                        labelPosition="top"
                        help="e.g., X-API-Key, Authorization"
                    >
                        <Text
                            value={data.header_name || ''}
                            onChange={(e) => updateField('header_name', e.target.value)}
                            placeholder="X-API-Key"
                        />
                    </ControlGroup>
                </FormSection>

                <FormSection>
                    <ControlGroup label="Header Value" labelPosition="top">
                        <Text
                            type="password"
                            value={data.header_value || ''}
                            onChange={(e) => updateField('header_value', e.target.value)}
                            passwordVisibilityToggle
                            canClear
                            placeholder="Enter header value"
                        />
                    </ControlGroup>
                </FormSection>
            </>
        );
    }

    // Bearer Token Form
    if (type === 'bearer') {
        return (
            <FormSection>
                <ControlGroup 
                    label="Bearer Token" 
                    labelPosition="top"
                    help="OAuth 2.0 Bearer token for API authentication"
                >
                    <Text
                        type="password"
                        value={data.token || ''}
                        onChange={(e) => updateField('token', e.target.value)}
                        passwordVisibilityToggle
                        canClear
                        placeholder="Enter bearer token"
                    />
                </ControlGroup>
            </FormSection>
        );
    }

    // HMAC Authentication Form
    if (type === 'hmac') {
        return (
            <>
                <FormSection>
                    <ControlGroup label="HMAC Secret" labelPosition="top">
                        <Text
                            type="password"
                            value={data.hmac_secret || ''}
                            onChange={(e) => updateField('hmac_secret', e.target.value)}
                            passwordVisibilityToggle
                            canClear
                            placeholder="Enter HMAC secret key"
                        />
                    </ControlGroup>
                </FormSection>

                <FormSection>
                    <ControlGroup label="Hash Function" labelPosition="top">
                        <Select
                            value={data.hmac_hash_function || 'sha256'}
                            onChange={(e, { value }) => updateField('hmac_hash_function', value)}
                        >
                            <Select.Option label="SHA-256" value="sha256" />
                            <Select.Option label="SHA-1" value="sha1" />
                            <Select.Option label="SHA-512" value="sha512" />
                            <Select.Option label="MD5" value="md5" />
                        </Select>
                    </ControlGroup>
                </FormSection>

                <FormSection>
                    <ControlGroup label="Digest Type" labelPosition="top">
                        <Select
                            value={data.hmac_digest_type || 'hex'}
                            onChange={(e, { value }) => updateField('hmac_digest_type', value)}
                        >
                            <Select.Option label="Hexadecimal" value="hex" />
                            <Select.Option label="Base64" value="base64" />
                        </Select>
                    </ControlGroup>
                </FormSection>

                <FormSection>
                    <ControlGroup 
                        label="Signature Header Name" 
                        labelPosition="top"
                        help="Header name for the HMAC signature (e.g., X-Signature)"
                    >
                        <Text
                            value={data.hmac_sig_header || ''}
                            onChange={(e) => updateField('hmac_sig_header', e.target.value)}
                            placeholder="X-Signature"
                        />
                    </ControlGroup>
                </FormSection>

                <FormSection>
                    <ControlGroup 
                        label="Timestamp Header Name" 
                        labelPosition="top"
                        help="Header name for the timestamp (e.g., X-Timestamp)"
                    >
                        <Text
                            value={data.hmac_time_header || ''}
                            onChange={(e) => updateField('hmac_time_header', e.target.value)}
                            placeholder="X-Timestamp"
                        />
                    </ControlGroup>
                </FormSection>
            </>
        );
    }

    return null;
}

export default CredentialInputs;
