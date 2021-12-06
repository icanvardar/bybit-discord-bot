const marketListenerHandler = require("../handlers/MarketListenerHandler");
const WsPrivateTopics = require("../objects/WsPrivateTopics");
const ListenerTypes = require("../objects/ListenerTypes");

class MarketListeners {
  constructor(ws) {
    this.ws = ws;
  }

  init() {
    this.ws.subscribe([
      // WsPrivateTopics.EXECUTION,
      // WsPrivateTopics.ORDER,
      WsPrivateTopics.POSITION,
      // WsPrivateTopics.STOP_ORDER,
    ]);

    this.ws.on(ListenerTypes.OPEN, marketListenerHandler.handleOpen);

    this.ws.on(ListenerTypes.UPDATE, marketListenerHandler.handleUpdate);

    this.ws.on(ListenerTypes.RESPONSE, marketListenerHandler.handleResponse);

    this.ws.on(ListenerTypes.CLOSE, marketListenerHandler.handleClose);

    this.ws.on(ListenerTypes.ERROR, marketListenerHandler.handleError);
  }
}

module.exports = MarketListeners;
