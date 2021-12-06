const { SlashCommandBuilder } = require("@discordjs/builders");
const PositionService = require("../services/position");
const PositionController = require("../controllers/PositionController");

const positionService = new PositionService();
const positionController = new PositionController();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("db")
    .setDescription("Makes db manipulations")
    .addStringOption((option) =>
      option
        .setName("tablename")
        .setDescription("Name of the table.")
        .setRequired(true)
        .addChoices([["positions", "positions"]])
    )
    .addStringOption((option) =>
      option
        .setName("operation")
        .setDescription("Name of the operation")
        .setRequired(true)
        .addChoices([
          ["truncate", "truncate"],
          ["drop", "drop"],
          ["create", "create"],
        ])
    ),
  async execute(interaction) {
    const tablename = await interaction.options.getString("tablename");
    const operation = await interaction.options.getString("operation");

    if (operation === "truncate") {
      if (tablename === "positions") {
        await positionService.truncate();
        await interaction.reply(
          `Table ${interaction.options.getString("tablename")} truncated!`
        );
      }
    } else if (operation === "drop") {
      if (tablename === "positions") {
        await positionService.drop();
        await interaction.reply(
          `Table ${interaction.options.getString("tablename")} dropped!`
        );
      }
    } else if (operation === "create") {
      if (tablename === "positions") {
        await positionController.openPosition({
          entryPrice: 58550,
          symbol: "BTCUSDT",
          leverage: 100,
          type: "Sell",
          active: true,
          createdAt: Date.now(),
        });
        await interaction.reply("Dummy position created!");
      }
    }
  },
};
