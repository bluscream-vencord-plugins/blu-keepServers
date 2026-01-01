/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ServerData } from "./utils";

const STORAGE_KEY = "blu-keepServers-data";

export function getNative() {
    return {
        loadServerData: async (): Promise<Record<string, ServerData>> => {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : {};
            } catch (error) {
                console.error("Failed to load server data from localStorage:", error);
                return {};
            }
        },

        saveServerData: async (data: Record<string, ServerData>): Promise<void> => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
            } catch (error) {
                console.error("Failed to save server data to localStorage:", error);
            }
        },

        deleteServerData: async (serverId: string): Promise<void> => {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                const parsedData = data ? JSON.parse(data) : {};
                delete parsedData[serverId];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData, null, 2));
            } catch (error) {
                console.error("Failed to delete server data from localStorage:", error);
            }
        },

        init: async () => { },
        initDirs: async () => { },
        getDefaultNativeDataDir: async () => "",
        keepServersUniqueIdThingyIdkMan: async () => { },
    };
}
