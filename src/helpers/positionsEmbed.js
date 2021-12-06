const { MessageEmbed } = require("discord.js");
const { formatTimestamp } = require("../helpers/dataFormatter");

const renderPosition = (position) => {
  return `${
    "**" +
    position.symbol +
    " - " +
    (position.type === "Buy" ? "LONG**" : "SHORT**") +
    "\n" +
    "Entry price: $" +
    position.entryPrice + " | " + "Leverage: " + position.leverage + "X" + "\n" + formatTimestamp(position.createdAt)
  }`;
};

const renderMultiplePositions = (positions) => {
  let renderMessage;
  for (let i = 0; i < positions.length; i++) {
    renderMessage =
      (renderMessage ? renderMessage : "") +
      "\n" +
      "🚨 " +
      renderPosition(positions[i]);
  }
  return renderMessage;
};

module.exports = function (data) {
  const pos = data.positionData;
  console.log(pos);
  if (!pos[0] || pos.length === 0) {
    return new MessageEmbed()
      .setColor(0xFFF933)
      .setDescription(
        `**${
          data.option ? " Position " + data.option : "Position"
        } not found. 🥶**`
      );
  } else if (data.symbolOption === true) {
    return new MessageEmbed()
      .setColor(0xFFF933)
      .setDescription(renderPosition(pos[0]));
  } else if (data.symbolOption === false) {
    return new MessageEmbed()
      .setColor(0xFFF933)
      .setDescription(renderMultiplePositions(pos));
  }
};
