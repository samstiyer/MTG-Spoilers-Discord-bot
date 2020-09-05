import constants from "../constants.js";

/**
 * Checks if the user who sent the given message has the required discord permission as defined in constants.
 * Sends a message in the channel if the user does not have the required permission to notify them of this.
 * @returns true if the user has the right permission, false otherwise
 */
export function checkPermissions(message) {
    if (!message.member.hasPermission(constants.BOTNECESSARYPERMISSION)) {
        message.channel.send("You do not have permissions to use that command.");
        return false;
    }
    return true;
}
