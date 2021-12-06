const { MessageEmbed } = require("discord.js");

module.exports = function (content) {
  console.log(content);
  return new MessageEmbed()
    .setColor(
      content.condition === "CLOSED"
        ? "#000000"
        : content.type === "Buy"
        ? "#008000"
        : content.type === "Sell"
        ? "#ff0000"
        : null
    )
    .setAuthor(
      content.condition === "NEW"
        ? "🚨  New position added!"
        : content.condition === "UPDATED"
        ? "🚨 Position updated!"
        : "🚨 Position closed!"
    )
    .setTitle(
      "**" +
        content.symbol +
        " - " +
        (content.type === "Buy" ? "LONG**" : "SHORT**")
    )
    .setDescription(
      `Entry price: ${content.entryPrice} | Leverage: ${content.leverage}X`
    )
    .setTimestamp();
};
