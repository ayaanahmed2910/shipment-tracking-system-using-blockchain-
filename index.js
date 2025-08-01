const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Block } = require('./blockchain');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const shipmentChain = new Blockchain();

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to add a shipment event
app.post('/addShipment', (req, res) => {
  const { shipmentId, location, status } = req.body;
  if (!shipmentId || !location || !status) {
    return res.status(400).json({ error: 'shipmentId, location and status are required' });
  }
  const newBlock = new Block(
    shipmentChain.chain.length,
    new Date().toISOString(),
    { shipmentId, location, status }
  );
  shipmentChain.addBlock(newBlock);
  res.json({ message: 'Shipment event added', block: newBlock });
});

// Endpoint to get shipment history by shipmentId
app.get('/shipmentHistory/:shipmentId', (req, res) => {
  const shipmentId = req.params.shipmentId;
  const history = shipmentChain.getShipmentHistory(shipmentId);
  res.json(history);
});


app.listen(port, () => {
  console.log(`Blockchain Shipment Tracking app listening at http://localhost:${port}`);
});
