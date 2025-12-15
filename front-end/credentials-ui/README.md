# WebhookMaster - Credentials UI

This folder contains the **React** application for managing HTTP authentication credentials in Splunk.

## 🏗️ Architecture

The application is built from scratch with a modular architecture:

### Main Components

- **`CredentialsApp`** (`HttpCredentials.jsx`) - Root component with credentials table
- **`CredentialCreator`** - Modal for creating new credentials
- **`CredentialEditor`** - Modal for editing existing credentials
- **`CredentialRemover`** - Confirmation modal for deletion
- **`CredentialInputs`** - Reusable forms by authentication type

### Support Modules

- **`api.js`** - Functions to interact with Splunk REST API
- **`styles.js`** - Styled components with custom design
- **`index.jsx`** - Application entry point

## 🔐 Authentication Types

1. **Basic Authentication** - Standard HTTP username and password
2. **Custom Header** - Custom HTTP header (e.g., X-API-Key)
3. **Bearer Token** - OAuth 2.0 tokens

## 🛠️ Build

### Automatic (recommended)
```bash
cd /Users/raulfsru/code/ta_http_action
make package
```

### Manual
```bash
cd credentials-ui
npm install
npm run build
```

The compiled file is generated at: `../../appserver/static/pages/credentials.js`

## 🚀 Development

```bash
npm run dev      # Development server on port 8080
npm run watch    # Automatic compilation with watch mode
```

## 📦 Dependencies

- **@splunk/react-ui** - Official Splunk UI components
- **@splunk/react-page** - Splunk layout system
- **@splunk/splunk-utils** - Utilities for REST API
- **styled-components** - CSS-in-JS styles
- **React 16** - UI framework

## 🔒 Security

- All credentials are stored encrypted in Splunk's password storage
- The specific realm is `httpalert` for isolation
- Full support for permissions and sharing levels (global/app/private)

## 📝 Notes

This code is **completely original** and was developed specifically for this project, following best practices for developing Splunk applications with React.
