const { SlashCommandBuilder } = require("@discordjs/builders");
const PositionController = require("../controllers/PositionController");
const positionsEmbed = require("../helpers/positionsEmbed");

const positionController = new PositionController();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("positions")
    .setDescription("Fetches all positions!")
    .addStringOption((option) =>
      option
        .setName("symbol")
        .setDescription("Symbol of pair")
        .addChoices([
          ["BTCUSDT", "BTCUSDT"],
          ["ETHUSDT", "ETHUSDT"],
        ])
    ),
  async execute(interaction) {
    try {
      const symbolOption = await interaction.options.getString("symbol");
      let data;

      if (symbolOption) {
        data = await positionController.getActivePosition(symbolOption);
        data = {
          positionData: [data],
          symbolOption: true,
          option: symbolOption,
        };
      } else {
        data = await positionController.getActivePositions();
        data = {
          positionData: [...data],
          symbolOption: false,
        };
      }
      await interaction.reply({ embeds: [positionsEmbed(data)] });
    } catch (err) {
      throw new Error(err);
    }
  },
};
