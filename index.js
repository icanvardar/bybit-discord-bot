const path = require("path");
const envFileName = `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}`}`;
const pathToEnvFile = path.resolve(__dirname, envFileName);
require("dotenv").config({ path: pathToEnvFile });

const { WebsocketClient } = require("bybit-api");
const WsConfigProvider = require("./src/utils/WsConfigProvider");
const MarketTypes = require("./src/objects/MarketTypes");
const MarketListener = require("./src/listeners/MarketListener");
const DiscordListener = require("./src/listeners/DiscordListener");
const discordClient = require("./src/utils/discordClient");
const ErrorListener = require("./src/listeners/ErrorListener");

const wsConfigProvider = new WsConfigProvider(
  MarketTypes.LINEAR,
  process.env.WSS_PRIVATE_ENDPOINT
);

const errorListeners = new ErrorListener();
const marketListeners = new MarketListener(
  new WebsocketClient(wsConfigProvider.config())
);
const discordListeners = new DiscordListener(discordClient);

// errorListeners.init();
console.log("Market Listeners");
marketListeners.init();
console.log("Discord Listeners");
discordListeners.init();
console.log("Discord Client");
discordClient.login(process.env.DISCORD_TOKEN);
