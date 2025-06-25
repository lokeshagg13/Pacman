const fs = require('fs');
const path = require('path');
const { GenomeBuilder } = require('neat-javascript');
const { default: config } = require('../config');

function saveGenomeDataAsFile(fileName, data) {
    const jsData = JSON.parse(data);
    const formattedData = JSON.stringify(jsData, undefined, 4);
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, formattedData, 'utf-8');
}

function testGenomeDataForInput(fileName, inputs) {
    const filePath = path.join(__dirname, fileName);
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const genome = GenomeBuilder.loadGenome(jsonData, config);
    const output = genome.propagate(inputs);
    console.log(output);
}


// testGenomeDataForInput('saved.json', [100, 10, 400]);
// saveGenomeDataAsFile('best.json', data);