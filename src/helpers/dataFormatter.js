const PositionController = require("../controllers/PositionController");
const PositionStatus = require("../objects/PositionStatus");
const positionController = new PositionController();
const moment = require("moment-timezone");

// PNL created_at: 1636890139 not okay
// Positions createdAt: 1636890293581 okay

module.exports = {
  formatTimestamp(
    timestamp,
    timezone = "Europe/Istanbul",
    dateFormat = "DD/MM/YYYY HH:mm:ss"
  ) {
    // For unix timestamps
    if (timestamp.toString().length === 10) {
      return moment.unix(timestamp).tz(timezone).format(dateFormat);
    }
    // For JS Date object
    return moment(timestamp).tz(timezone).format(dateFormat);
  },
  async formatPositionData(position) {
    const { data } = position;
    const targetData = [data[0], data[1]];

    const activePosition = await positionController.getActivePosition(
      targetData[0].symbol
    );

    const [foundData] = targetData.filter((p) => p.size > 0);

    if (!foundData) {
      return {
        positionId: activePosition.id,
        status: PositionStatus.CLOSED,
        closed: true,
        topic: position.topic,
        entryPrice: activePosition.entryPrice,
        symbol: activePosition.symbol,
        leverage: activePosition.leverage,
        type: activePosition.type,
      };
    }

    if (activePosition) {
      return {
        positionId: activePosition.id,
        status: PositionStatus.UPDATED,
        closed: false,
        topic: position.topic,
        entryPrice: foundData.entry_price,
        symbol: activePosition.symbol,
        leverage: foundData.leverage,
        type: activePosition.type,
      };
    }

    return {
      status: PositionStatus.NEW,
      closed: false,
      topic: position.topic,
      entryPrice: foundData.entry_price,
      symbol: foundData.symbol,
      leverage: foundData.leverage,
      type: foundData.side,
    };
  },
};
