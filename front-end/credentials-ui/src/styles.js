import styled from 'styled-components';
import { variables } from '@splunk/themes';

export const MainContainer = styled.div`
    max-width: 1200px;
    min-height: 500px;
    margin: ${variables.spacingLarge} auto;
    padding: ${variables.spacingLarge};
    background: ${variables.backgroundColor};
    border-radius: ${variables.borderRadius};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: "Splunk Platform Sans", "Proxima Nova", "Roboto", "Droid", "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${variables.spacingLarge};
    padding-bottom: ${variables.spacing};
    border-bottom: 2px solid ${variables.borderColor};

    h1 {
        font-size: ${variables.fontSizeXXLarge};
        font-weight: ${variables.fontWeightBold};
        margin: 0;
        color: ${variables.textColor};
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: ${variables.spacing};
    align-items: center;
`;

export const InfoText = styled.p`
    color: ${variables.textColorSecondary};
    font-size: ${variables.fontSize};
    line-height: 1.6;
    margin-bottom: ${variables.spacingLarge};
    max-width: 800px;
`;

export const FormSection = styled.div`
    margin-bottom: ${variables.spacing};
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: ${variables.spacing};
    justify-content: flex-end;
    margin-top: ${variables.spacingLarge};
`;
