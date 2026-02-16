import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    showInGuildList: {
        type: OptionType.BOOLEAN,
        description: "Show removed servers in guild list",
        default: true,
        restartNeeded: false,
    },
    autoCreateInvites: {
        type: OptionType.BOOLEAN,
        description: "Automatically create invite links when joining servers",
        default: true,
        restartNeeded: false,
    },
    searchForInvites: {
        type: OptionType.BOOLEAN,
        description: "Search for existing invite links in server messages",
        default: true,
        restartNeeded: false,
    }
});
