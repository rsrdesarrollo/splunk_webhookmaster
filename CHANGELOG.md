# Changelog

## [11.0.0] - Breaking Changes

### 🚨 BREAKING CHANGES

#### 1. **Removal of `custom_separator` parameter**
- **Removed**: The `httpalert.param.custom_separator` parameter has been completely removed.

#### 2. **Format change in `custom_headers`**
- **Before**: String with `key=value` format separated by `&`
- **Now**: JSON object with key-value pairs
- **Impact**: All existing header configurations need to be manually reformatted.
- **Migration required**:
  ```
  # Old format:
  Authorization=Bearer token123&Content-Type=application/json
  
  # New format:
  {"Authorization": "Bearer token123", "Content-Type": "application/json"}
  ```
- **Validation**: The system now validates that it's valid JSON and will fail if it's not.

#### 3. **New credential-based authentication system**
- **Added**: `httpalert.param.credential` parameter to securely manage credentials.
- **Supported types**:
  - Basic Authentication (username/password)
  - Custom Header (API keys)
  - Bearer Token (OAuth 2.0)
  - HMAC Authentication (cryptographic signatures)
- **Impact**: Authentications previously done via custom headers should migrate to the new credential system.
- **Breaking**: Although the old system still works, it's considered deprecated and credentials should be stored using the new secure system.

#### 4. **Changes in payload processing**
- **Before**: Payload was sent as-is without processing.
- **Now**: Payload supports templates with context variables:
  - `$$sid$$` - Search ID
  - `$$search_name$$` - Saved search name
  - `$$app$$`, `$$owner$$`, `$$results_link$$`
  - `$$result_obj$$` - JSON object with results
  - `$$result.field$$` - Access to specific result fields
- **Impact**: If existing alerts have strings matching these patterns (e.g., `$$sid$$`), they will be automatically replaced.
- **Default payload**: If no payload is specified, a default template with all alert data is now used.

#### 5. **User interface changes**
- **Added**: New web interface to manage credentials at `/app/ta_http_action/credentials`
- **Modified**: Alert form now includes a search-based credential selector
- **Modified**: Header and payload fields are now `<textarea>` instead of `<input type="text">`
- **Impact**: The UX is different, users will need to familiarize themselves with the new interface.

#### 6. **Python code changes (`http_alert.py`)**
- **Refactored**: Removed `helper_get_requests_func()` and `helper_get_verify_ssl_func()` functions
- **Added**: New `render_template_with_context()` function for template processing
- **Added**: Import of `helpers` module with utilities (`config_to_bool`, `get_credential`, `get_hmac_headers`)
- **Modified**: Changed from `requests.post/get/etc` to `requests.request()` with `method` parameter
- **Added**: Integrated authentication system with support for multiple types
- **Impact**: Custom scripts or forks of this code will need to adapt to the new structure.

#### 7. **File structure changes**
- **Added**: New React interface in `front-end/credentials-ui/`
- **Added**: `bin/helpers.py` file with shared utilities
- **Added**: HTML templates in `appserver/templates/credentials.html`
- **Added**: Navigation configuration in `default/data/ui/nav/default.xml`
- **Added**: Credentials view in `default/data/ui/views/credentials.xml`
- **Modified**: `default/app.conf` - App is now visible in UI (`is_visible = 1`)
- **Impact**: Users who had the app hidden will see a new item in the apps menu.

#### 8. **New dependencies**
- **Added**: JavaScript dependencies (React, Webpack, Babel, Splunk UI Kit)
- **File**: `front-end/credentials-ui/package.json` with multiple npm dependencies
- **Impact**: Build process with npm/webpack is required to compile the frontend.

### ⚠️ Required Migration Actions

1. **Update all existing alerts**:
   - Convert headers from `key=value` format to JSON `{"key": "value"}`
   - Remove any `custom_separator` configuration
   - Review payloads to verify they don't contain unintended patterns like `$$variable$$`

2. **Migrate authentications**:
   - Create credentials in the new interface at `/app/ta_http_action/credentials`
   - Update alerts to use the credential selector instead of manual headers
   - Remove tokens/passwords from custom headers

3. **Compile frontend assets**:
   ```bash
   cd front-end/credentials-ui
   npm install
   npm run build
   ```

4. **Test all alerts**:
   - Verify that JSON headers are valid
   - Confirm that credentials work correctly
   - Validate that payloads are processed as expected

### 📋 Updated Configuration Specification

```
httpalert.param.endpoint = <string> HTTPS Endpoint (required)
httpalert.param.method = <list> HTTP Method (required, default: POST)
httpalert.param.verify_ssl_certificate = <list> Verify SSL certificate (required, default: True)
httpalert.param.credential = <list> Credential to use (optional)
httpalert.param.qs_params = <string> Querystring parameters (optional)
httpalert.param.custom_headers = <string> Custom headers as JSON (optional)
httpalert.param.payload = <string> Request body with template support (optional)
```

### 🗑️ Deprecated/Removed Parameters

- ~~`httpalert.param.custom_separator`~~ - **REMOVED**
