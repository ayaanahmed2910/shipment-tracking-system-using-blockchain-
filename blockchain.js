
const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, shipmentData, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.shipmentData = shipmentData; // e.g. { shipmentId, location, status }
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.timestamp + JSON.stringify(this.shipmentData) + this.previousHash).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), { info: 'Genesis Block' }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getShipmentHistory(shipmentId) {
    // Exclude genesis block and filter blocks with matching shipmentId
    return this.chain.filter(block => block.index !== 0 && block.shipmentData.shipmentId === shipmentId);
  }
}

module.exports = { Blockchain, Block };
