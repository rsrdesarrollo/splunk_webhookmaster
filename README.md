# TA_HTTP_ACTION

Last Updated: 16th May 2024

Custom Alert Action developed to send a customised HTTP request

Brendan Cooper: https://github.com/brendancooper/ta_http_action

## Building the Package

Use the provided Makefile to build a Splunk package:

```bash
make package
```

This creates a tarball in `dist/ta_http_action-<version>.tar.gz` ready for installation.

### Available Make Commands

- `make package` - Build the Splunk package
- `make clean` - Remove build artifacts
- `make install` - Install to local Splunk (requires `SPLUNK_HOME`)
- `make docker-up` - Start Splunk in Docker for local testing
- `make docker-down` - Stop Splunk Docker container
- `make docker-restart` - Restart Splunk Docker container
- `make docker-logs` - View Splunk Docker logs
- `make help` - Show all available commands

## Local Development with Docker

### Quick Start

1. Start Splunk with the app mounted:

   ```bash
   make docker-up
   ```

2. Access Splunk Web UI:
   - URL: <http://localhost:8000>
   - Username: `admin`
   - Password: `changeme123`

3. Stop Splunk:

   ```bash
   make docker-down
   ```

### Configuration

#### Change Default Password

Create a `.env` file from the example:

```bash
cp .env.example .env
# Edit .env with your preferred password
```

#### Persist Data

The docker-compose configuration uses named volumes to persist:

- `splunk-data`: Splunk's indexed data and logs
- `splunk-etc`: Splunk's configuration files

To start fresh, remove the volumes:

```bash
make docker-clean
```

### Development Workflow

The app is mounted as read-only at `/opt/splunk/etc/apps/ta_http_action`.

After making changes to the app:

1. Restart Splunk to reload the app:

   ```bash
   make docker-restart
   ```

2. Or restart from Splunk Web UI:
   - Settings > Server controls > Restart Splunk

### Accessing Splunk CLI

To run Splunk CLI commands:

```bash
docker exec -it splunk-dev /opt/splunk/bin/splunk <command>
```

Example - Check app status:

```bash
docker exec -it splunk-dev /opt/splunk/bin/splunk display app ta_http_action
```

### Troubleshooting

#### View Splunk logs

```bash
make docker-logs
```

#### Access container shell

```bash
docker exec -it splunk-dev bash
```

#### Check app installation

```bash
docker exec -it splunk-dev ls -la /opt/splunk/etc/apps/ta_http_action
```

#### Check Splunk internal logs

```bash
docker exec -it splunk-dev tail -f /opt/splunk/var/log/splunk/splunkd.log
```

### Available Ports

- **8000**: Splunk Web UI
- **8088**: HTTP Event Collector (HEC)
- **8089**: Splunk Management/API port
- **9997**: Splunk receiving port for forwarders

### Notes

- The free license has a 500MB/day indexing limit
- Data is persisted in Docker volumes between restarts
- The app directory is mounted read-only to prevent accidental modifications from within the container
