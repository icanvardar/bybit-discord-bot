const chalk = require("chalk");
const DiscordService = require("../services/discord");
const discordClient = require("../utils/discordClient");
const PositionController = require("../controllers/PositionController");
const WsPrivateTopics = require("../objects/WsPrivateTopics");
const dataFormatter = require("../helpers/dataFormatter");
const PositionStatus = require("../objects/PositionStatus");

const positionController = new PositionController();
const discordService = new DiscordService(discordClient);

module.exports = {
  async handleOpen(data) {
    console.log(
      chalk.blue.underline.bold(
        "Connection open for websocket with ID: " + data.wsKey
      )
    );
  },
  async handleUpdate(data) {
    if (data.topic === WsPrivateTopics.POSITION) {
      // Readjust recived data from position topic
      try {
        const res = await dataFormatter.formatPositionData(data);

        // Checks if position is closed then closes active position
        if (res.status === PositionStatus.CLOSED) {
          await positionController.closePosition({
            id: res.positionId,
            active: false,
          });
          await discordService.sendPositionNotification({
            ...res,
            condition: res.status,
            entryPrice: res.entryPrice,
            leverage: res.leverage,
            type: res.type,
          });
        }
        // Checks newly created position
        else if (res.status === PositionStatus.NEW) {
          await positionController.openPosition({
            entryPrice: res.entryPrice,
            leverage: res.leverage,
            type: res.type,
            active: true,
            symbol: res.symbol,
            createdAt: Date.now(),
          });
          await discordService.sendPositionNotification({
            ...res,
            condition: res.status,
          });
        }
        // Checks if position created then updates position
        else if (res.status === PositionStatus.UPDATED) {
          await positionController.updatePosition({
            entryPrice: res.entryPrice,
            leverage: res.leverage,
            id: res.positionId,
          });
          await discordService.sendPositionNotification({
            ...res,
            condition: res.status,
          });
        } else if (res.status === "NOT_IDENTIFIED") {
          throw new Error(
            "handleUpdate: Not identified position detected, this probably occured while closing not saved position locally!"
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  async handleResponse(response) {
    console.log(
      JSON.stringify({
        topic: "response",
        data: response,
      })
    );
  },
  async handleClose() {
    console.log(chalk.blue.underline.bold("Connection closed"));
  },
  async handleError(error) {
    console.log(chalk.red.underline.bold(error));
  },
};
