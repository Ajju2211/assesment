const readline = require('node:readline');
const fs = require('fs');

const processFile = (filePath, processFunction) => {
    const inputStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity,
    });

    let t=1;
    console.log("_".repeat(100));
    rl.on('line', (line) => {
        console.log("Test "+t);
        processFunction(line);
        console.log("_".repeat(100));
        t++;
    });

    rl.on('close', () => {
        console.log('done ✨✨✨');
    });
};


module.exports = processFile;