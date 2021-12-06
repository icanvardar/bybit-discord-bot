const discordClient = require("../utils/discordClient");
const DiscordService = require("../services/discord");

const discordService = new DiscordService(discordClient);

class ErrorListener {
  init() {
    process.on("uncaughtException", async (err) => {
      await discordService.sendServerNotification(err);
      process.exit(1);
    });
  }
}

module.exports = ErrorListener;
