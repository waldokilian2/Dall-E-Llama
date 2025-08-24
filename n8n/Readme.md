# n8n Setup with Docker

This guide explains how to create, configure, and run an n8n instance from scratch using Docker. It also covers setting up credentials for required services and enabling a custom community node.

---

## 1. Prerequisites

* Docker installed on your system
* Docker Compose installed
* Internet access to pull images and install nodes

---

## 2. Docker Compose Setup

Create a file named `docker-compose.yml` in your project directory with the following content:

```yaml
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n
    # network_mode: host - might be needed for some setups i.e ollama
    restart: always
    ports:
      - 5678:5678
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - WEBHOOK_URL=http://localhost:5678
      - GENERIC_TIMEZONE=Africa/Johannesburg
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

Start the service:

```bash
docker compose up -d
```

n8n will now be available at: [http://localhost:5678](http://localhost:5678)

## 2.1 Set up:

- the Owner account (Required to set up n8n)
- Customize: select not using it for work
- Get API key, feel free to use another email if needed to get the key (It's free to obtain)

---

## 3. Setting Up Credentials

After logging into the n8n UI, configure the required credentials:

### 3.1 n8n API Credentials

1. Go to **Credentials** → **New** → select **N8N API**.
2. Enter:

   * **Authentication**: None (or API Key if your instance is secured)
      * To get the API key to go **settings** -> **n8n API** -> **create api key**
   * **Base URL**: `http://localhost:5678/api/vi`
3. Save credentials.

### 3.2 Gemini API Credentials

1. Go to **Credentials** → **New** → search for **Gemini**.
2. Enter your **Gemini API Key**. [From here](https://aistudio.google.com/app/apikey)
3. Save credentials.

### 3.3 Qdrant Local Instance

1. Go to **Credentials** → **New** → select **Qdrant API**.
2. Enter:

   * **Base URL**: `http://localhost:6333`
   * **API Key**: leave empty if authentication is not enabled
3. Save credentials.

---

## 4. Adding Community Node

To install the `n8n-nodes-datastore` community node:

1. Open the n8n UI.
2. Go to **Settings** → **Community Nodes**.
3. Click **Install Community Node**.
4. Enter `n8n-nodes-datastore` and install.

---

## 5. Importing Workflows in Bulk

### run this to copy the workflows into the container
```
docker cp ./workflows n8n:/backup
```

n8n supports bulk importing workflows via the CLI. First, enter the container shell:

```bash
docker exec -it n8n sh
```

Then run the import command:

```bash
n8n import:workflow --input=/path/to/workflows.json
```

* Replace `/path/to/workflows.json` with the actual file path inside the container.
* To import multiple workflows from a directory:

```bash
n8n import:workflow --input=/path/to/workflows/ --separate
```

Refer to [n8n CLI docs](https://docs.n8n.io/hosting/cli-commands/#workflows_1) for additional options.

---

## 6. Verifying Setup

* Navigate to [http://localhost:5678](http://localhost:5678)
* Confirm credentials exist under **Credentials**
* Confirm `n8n-nodes-datastore` appears under **Community Nodes**
* Import a sample workflow to ensure services connect properly

---

## 7. Managing the Instance

* Start: `docker compose up -d`
* Stop: `docker compose down`
* Logs: `docker logs -f n8n`
* Access shell: `docker exec -it n8n sh`

---

## 8. Data Persistence

Workflows, credentials, and settings are stored in the `n8n_data` Docker volume. This ensures data persists between container restarts.
