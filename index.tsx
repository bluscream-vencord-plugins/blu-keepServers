//// Plugin originally written for Equicord at 2026-02-16 by https://github.com/Bluscream, https://antigravity.google
// region Imports
import definePlugin from "@utils/types";
import { Logger } from "@utils/Logger";
import {
    FluxDispatcher,
    GuildStore,
    InviteActions,
    NavigationRouter,
    React
} from "@webpack/common";

import { settings } from "./settings";
import { openServerInfoModal } from "./components/ServerInfoModal.js";
import {
    createFakeGuildEntry,
    getServerInviteCode,
    removeFakeGuildEntry,
    saveServerData
} from "./utils.js";
import { getNative } from "./nativeUtils.js";
// endregion Imports

import { pluginInfo } from "./info";
export { pluginInfo };

// region Variables
const logger = new Logger(pluginInfo.id, pluginInfo.color);
const storedServers = new Map<string, ServerData>();

interface ServerData {
    id: string;
    name: string;
    icon?: string;
    inviteCode?: string;
    joinedAt: string;
    removedAt?: string;
}
// endregion Variables

// region Utils
async function loadStoredServers() {
    try {
        const native = getNative();
        const data = await native.loadServerData();
        Object.entries(data).forEach(([id, serverData]) => {
            storedServers.set(id, serverData as ServerData);
        });
        logger.info(`Loaded ${storedServers.size} stored servers`);
    } catch (error) {
        logger.error("Failed to load stored servers:", error);
    }
}

async function saveStoredServers() {
    try {
        const native = getNative();
        const data = Object.fromEntries(storedServers);
        await native.saveServerData(data);
        logger.info(`Saved ${storedServers.size} servers to storage`);
    } catch (error) {
        logger.error("Failed to save stored servers:", error);
    }
}

async function onGuildCreate(guild: any) {
    if (!settings.store.autoCreateInvites) return;

    logger.info(`Joined server: ${guild.name} (${guild.id})`);

    const serverData: ServerData = {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        joinedAt: new Date().toISOString()
    };

    try {
        const inviteCode = await getServerInviteCode(guild.id);
        if (inviteCode) {
            serverData.inviteCode = inviteCode;
            logger.info(`Found invite code for ${guild.name}: ${inviteCode}`);
        }
    } catch (error) {
        logger.warn(`Failed to get invite code for ${guild.name}:`, error);
    }

    storedServers.set(guild.id, serverData);
    saveStoredServers();
}

async function onGuildDelete(event: any) {
    const { guild } = event;
    if (guild.unavailable) return;

    logger.info(`Left/removed from server: ${guild.id}`);

    const serverData = storedServers.get(guild.id);
    if (!serverData) return;

    serverData.removedAt = new Date().toISOString();
    storedServers.set(guild.id, serverData);
    saveStoredServers();

    if (settings.store.showInGuildList) {
        createFakeGuildEntry(serverData);
    }
}
// endregion Utils

// region Definition
export default definePlugin({
    name: pluginInfo.name,
    description: pluginInfo.description,
    authors: pluginInfo.authors,
    settings,

    patches: [
        {
            find: "getGuildsTree:",
            replacement: {
                match: /getGuildsTree:\(\)=>\{/,
                replace: "getGuildsTree:()=>{const fakeGuilds=$self.getFakeGuilds();"
            }
        },
        {
            find: ".getGuildsTree(),",
            replacement: {
                match: /\.getGuildsTree\(\),/,
                replace: ".getGuildsTree().concat($self.getFakeGuilds()),"
            }
        },
        {
            find: "onClick:",
            replacement: {
                match: /onClick:(\i),/,
                replace: "onClick:$self.handleGuildClick($1),"
            }
        }
    ],

    flux: {
        GUILD_CREATE: onGuildCreate,
        GUILD_DELETE: onGuildDelete
    },

    getFakeGuilds() {
        if (!settings.store.showInGuildList) return [];

        const fakeGuilds: any[] = [];
        for (const [id, serverData] of storedServers) {
            if (serverData.removedAt) {
                fakeGuilds.push({
                    id: `fake-${id}`,
                    name: serverData.name,
                    icon: serverData.icon || null,
                    fake: true,
                    originalId: id,
                    serverData
                });
            }
        }
        return fakeGuilds;
    },

    handleGuildClick(originalOnClick: (guildId: string) => void) {
        return (guildId: string) => {
            if (guildId.startsWith('fake-')) {
                const originalId = guildId.replace('fake-', '');
                const serverData = storedServers.get(originalId);
                if (serverData) {
                    openServerInfoModal(serverData);
                    return;
                }
            }
            originalOnClick(guildId);
        };
    },

    async start() {
        loadStoredServers();
        logger.info("Plugin started");
    },

    stop() {
        logger.info("Plugin stopped");
    }
});
// endregion Definition
