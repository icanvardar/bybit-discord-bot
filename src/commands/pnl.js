const { SlashCommandBuilder } = require("@discordjs/builders");
const { LinearClient } = require("bybit-api");
const { formatTimestamp } = require("../helpers/dataFormatter");

const linearClient = new LinearClient(
  process.env.API_KEY,
  process.env.API_SECRET
);

const calculatePNL = (data) => {
  const {
    avg_entry_price,
    avg_exit_price,
    leverage,
    side,
    symbol,
    created_at,
  } = data;
  let pnl;

  if (side === "Sell") {
    pnl =
      ((avg_entry_price - avg_exit_price) / avg_entry_price) *
      100 *
      leverage *
      -1;
  } else if (side === "Buy") {
    pnl =
      ((avg_entry_price - avg_exit_price) / avg_entry_price) * 100 * leverage;
  }

  return {
    pnl: pnl.toFixed(4),
    avgEntryPrice: avg_entry_price,
    avgExitPrice: avg_exit_price,
    leverage,
    symbol,
    posSide: side === "Sell" ? "LONG" : side === "Buy" ? "SHORT" : null,
    closeTime: formatTimestamp(created_at),
  };
};

const renderPNLMessage = (pnlData) => {
  return `**${pnlData.symbol} - ${pnlData.leverage}X ${pnlData.posSide}**\nGiriş Fiyat: ${pnlData.avgEntryPrice} | Kapanış Fiyatı: ${pnlData.avgExitPrice}\nPNL: %${pnlData.pnl}\nKapanış Zamanı: ${pnlData.closeTime}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pnl")
    .setDescription("Fetches pnl of given pair!")
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
      const position = await linearClient.getClosedPnl({
        symbol: symbolOption,
        limit: 1,
      });
      console.log(position.result.data);
      await interaction.reply(
        renderPNLMessage(calculatePNL(position.result.data[0]))
      );
    } catch (err) {
      throw new Error(err);
    }
  },
};
