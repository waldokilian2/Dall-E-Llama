# Dall-E Llama: The Swiss Army Knife for Dev

## Overview

Dall-E Llama is a modern, interactive AI chat application designed to be a versatile tool for developers. It features a sleek, responsive user interface built with React, TypeScript, and Tailwind CSS, leveraging `shadcn/ui` components for a polished look and feel.

Key features include:
*   **AI Chat Integration:** Connects to an N8N webhook for AI agent communication, allowing for dynamic and intelligent responses.
*   **File Uploads:** Supports attaching `.txt`, `.pdf`, `.doc`, and `.docx` files to messages, enabling context-rich conversations.
*   **Customizable Settings:** Users can configure the N8N webhook URL, enable/disable file uploads, and set a response timeout directly within the application.
*   **Theme Toggle:** Switch between light and dark modes for a personalized experience.
*   **Suggested Actions:** AI can provide suggested follow-up actions as interactive chips.
*   **Copy AI Responses:** Easily copy AI-generated text to your clipboard.
*   **New Chat Functionality:** Start a fresh conversation at any time.
*   **Responsive Design:** Optimized for various screen sizes.

This application serves as a robust frontend for interacting with powerful AI backends, making it an excellent starting point for custom AI-powered tools.

## Getting Started

Follow these instructions to set up and run the Dall-E Llama application on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js:** Version 18 or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager) or **pnpm** (Performant Node Package Manager): npm comes with Node.js, or you can install pnpm globally: `npm install -g pnpm`.

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd dall-e-llama
    ```
    *(Replace `<repository-url>` with the actual URL of your repository)*

2.  **Install dependencies:**
    Navigate to the project directory and install the required packages using pnpm (recommended) or npm:
    ```bash
    pnpm install
    # or
    npm install
    ```

### Running the Application

To start the development server and view the application in your browser:

```bash
pnpm dev
# or
npm run dev
```

The application will typically run on `http://localhost:32100`. Open this URL in your web browser.

### Configuration

Upon first launch, or by clicking the `Settings` icon (gear icon) in the top right, you can configure:
*   **N8N Webhook URL:** The endpoint for your AI agent (e.g., an N8N workflow). The default is `http://localhost:5678/webhook/86a50552-8058-4896-bd7e-ab95eba073ce/chat`.
*   **Enable File Upload:** Toggle whether the file attachment feature is active.
*   **Response Timeout (s):** Set the maximum time (in seconds) to wait for an AI response.

These settings are saved locally in your browser's local storage.