const PositionService = require("../services/position");

class PositionController {
  constructor() {
    this.name = "PositionController";
    this.positionService = new PositionService();
  }

  // @params positionId
  async getPosition(positionId) {
    return await this.positionService.getById(positionId);
  }

  async getPositions() {
    return await this.positionService.getAll();
  }

  async getActivePosition(positionSymbol) {
    return await this.positionService.getActive(positionSymbol);
  }

  async getActivePositions() {
    return await this.positionService.getActives();
  }

  // @params entryPrice, leverage, type, active, createdAt, symbol
  async openPosition(input) {
    return await this.positionService.create(input);
  }

  // @params id, active
  async closePosition(input) {
    return await this.positionService.changeStatus(input);
  }

  // @params entryPrice, leverage, active, type
  async updatePosition(input) {
    return await this.positionService.update(input);
  }
}

module.exports = PositionController;
