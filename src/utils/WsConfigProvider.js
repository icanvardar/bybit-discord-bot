const API_KEY = "CI4rALKUYOyDJvwGF8";
const PRIVATE_KEY = "pjCqMVajEtLZk8fx6GUqLsApHZb9HPgkPMt6";

class WsConfigProvider {
  // @dev market => 'linear' | 'spot' | 'inverse'
  constructor(market, wsUrl) {
    this.market = market;
    this.wsUrl = wsUrl;
  }

  config() {
    return {
      key: API_KEY,
      secret: PRIVATE_KEY,
      market: this.market,
      wsUrl: this.wsUrl,
    };
  }
}

module.exports = WsConfigProvider;
