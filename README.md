# Blu Keep Servers Plugin

A Vencord plugin that keeps track of servers you've joined and allows you to rejoin them later, even after being kicked or leaving.

## Features

-   **Automatic Server Tracking**: Monitors when you join new servers and stores their information
-   **Invite Link Detection**: Automatically finds or creates invite links for servers
-   **Fake Server Entries**: Shows removed servers in the guild list with visual indicators
-   **Server Info Modal**: Click on fake server entries to view cached information and rejoin
-   **Persistent Storage**: Server data is saved across Discord sessions







## Installation 

### 🪄 Installation Wizard
The easiest way to install this plugin is to use the **[Plugin Installer Generator](https://bluscream-vencord-plugins.github.io)**. 
Simply select this plugin from the list and download your custom install script.

### 💻 Manual Installation (PowerShell)
Alternatively, you can run this snippet in your Equicord/Vencord source directory:
```powershell
$ErrorActionPreference = "Stop"
winget install -e --id Git.Git
winget install -e --id OpenJS.NodeJS
npm install -g pnpm
git clone https://github.com/Equicord/Equicord Equicord
New-Item -ItemType Directory -Force -Path "Equicord\src\userplugins" | Out-Null
git clone https://github.com/bluscream-vencord-plugins/blu-keepServers.desktop.git -b "main" "Equicord\src\userplugins\blu-keepServers.desktop"
cd "Equicord"
npm install -g pnpm
pnpm install --frozen-lockfile
pnpm build
pnpm buildWeb
pnpm inject
```
