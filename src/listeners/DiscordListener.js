const fs = require("fs");
const { Collection } = require("discord.js");
const deployCommands = require("../helpers/deployCommands");

class DiscordListeners {
  constructor(client) {
    this.client = client;
  }

  init() {
    // Creates collection for commands
    this.client.commands = new Collection();
    // Reads all commands by scanning command files in commands folder
    const commandFiles = fs
      .readdirSync("./src/commands")
      .filter((file) => file.endsWith(".js"));
    // Adds each command to command collection
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      // Set a new item in the Collection
      // With the key as the command name and the value as the exported module
      this.client.commands.set(command.data.name, command);
    }

    deployCommands(this.client);

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      const command = this.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    });
  }
}

module.exports = DiscordListeners;
