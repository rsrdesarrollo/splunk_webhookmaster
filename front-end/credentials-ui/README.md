# HTTP Alert Action - Credentials UI

Esta carpeta contiene la aplicación **React** para gestionar credenciales de autenticación HTTP en Splunk.

## 🏗️ Arquitectura

La aplicación está construida completamente desde cero con una arquitectura modular y original:

### Componentes Principales

- **`CredentialsApp`** (`HttpCredentials.jsx`) - Componente raíz con tabla de credenciales
- **`CredentialCreator`** - Modal para crear nuevas credenciales
- **`CredentialEditor`** - Modal para editar credenciales existentes
- **`CredentialRemover`** - Modal de confirmación para eliminar
- **`CredentialInputs`** - Formularios reutilizables por tipo de autenticación

### Módulos de Soporte

- **`api.js`** - Funciones para interactuar con Splunk REST API
- **`styles.js`** - Styled components con diseño propio
- **`index.jsx`** - Punto de entrada de la aplicación

## 🔐 Tipos de Autenticación

1. **Basic Authentication** - Usuario y contraseña estándar HTTP
2. **Custom Header** - Header HTTP personalizado (e.g., X-API-Key)
3. **Bearer Token** - Tokens OAuth 2.0

## 🛠️ Compilación

### Automática (recomendado)
```bash
cd /Users/raulfsru/code/ta_http_action
make package
```

### Manual
```bash
cd vue-credentials
npm install
npm run build
```

El archivo compilado se genera en: `../appserver/static/pages/credentials.js`

## 🚀 Desarrollo

```bash
npm run dev      # Servidor de desarrollo en puerto 8080
npm run watch    # Compilación automática con watch mode
```

## 📦 Dependencias

- **@splunk/react-ui** - Componentes UI oficiales de Splunk
- **@splunk/react-page** - Sistema de layout de Splunk
- **@splunk/splunk-utils** - Utilidades para API REST
- **styled-components** - Estilos CSS-in-JS
- **React 17** - Framework de UI

## 🔒 Seguridad

- Todas las credenciales se almacenan cifradas en Splunk's password storage
- El realm específico es `http_alert` para aislamiento
- Soporte completo para permisos y niveles de compartición (global/app/private)

## 📝 Notas

Este código es **completamente original** y fue desarrollado específicamente para este proyecto, aunque está inspirado en las mejores prácticas de desarrollo de aplicaciones Splunk con React.
