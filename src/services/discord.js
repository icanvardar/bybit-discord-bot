const positionNotifierEmbed = require("../helpers/positionNotifierEmbed");

class DiscordService {
  constructor(client) {
    this.client = client;
  }

  async sendPositionNotification(content) {
    await this.client.channels.cache
      .get(process.env.DISCORD_MAIN_CHANNEL_ID)
      .send({
        /*content: "@everyone",*/ embeds: [positionNotifierEmbed(content)],
      });
  }

  async sendMessage(content) {
    await this.client.channels.cache
      .get(process.env.DISCORD_MAIN_CHANNEL_ID)
      .send(content);
  }

  async sendServerNotification(content) {
    await this.client.channels.cache
      .get(process.env.DISCORD_SERVER_NOTIFICATIONS_CHANNEL_ID)
      .send(content);
  }
}

module.exports = DiscordService;
