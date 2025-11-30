# KDP Dot-to-Dot Book Generator

This application uses AI to generate complete dot-to-dot cartoon activity books, including covers and descriptions, formatted for Amazon KDP.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/{USERNAME}/{REPO_NAME}.git
    cd {REPO_NAME}
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your API Key for Local Development:**
    Create a file named `.env.local` in the root of your project and add your Gemini API key:
    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    **Note:** This file is included in `.gitignore` and should not be committed to your repository.

### Running Locally

To start the development server, run:
```sh
npm run dev
```
Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages using GitHub Actions.

### Step 1: Update Configuration

Before the first deployment, you must update two files to match your GitHub repository details.

1.  **`package.json`**:
    Open the `package.json` file and update the `homepage` field.
    ```json
    // "homepage": "https://{USERNAME}.github.io/{REPO_NAME}",
    "homepage": "https://your-username.github.io/your-repo-name",
    ```
    Replace `your-username` and `your-repo-name`.

2.  **`vite.config.ts`**:
    Open the `vite.config.ts` file and update the `base` property.
    ```ts
    // base: '/{REPO_NAME}/',
    base: '/your-repo-name/',
    ```
    Replace `your-repo-name`.

### Step 2: Add API Key as a GitHub Secret

To use your API key securely during the automated deployment process, you must add it as a repository secret in GitHub.

1.  In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2.  Click **New repository secret**.
3.  For the **Name**, enter `VITE_API_KEY`.
4.  For the **Secret**, paste your Gemini API key.
5.  Click **Add secret**.

### Step 3: Deploy

The included GitHub Actions workflow will automatically build and deploy your site whenever you push to the `main` branch. After pushing, go to your repository's **Actions** tab to monitor the progress. Once the workflow is complete, your site will be live at the URL you specified in the `homepage` field.
