const readline = require('readline')

function askParameters(question, password) {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    readlineInterface.stdoutMuted = password;
    return new Promise(resolve => {
        readlineInterface.question(question, answer => {
            resolve(answer)
            readlineInterface.close()
        })

        readlineInterface._writeToOutput = function _writeToOutput(stringToWrite) {
            if (readlineInterface.stdoutMuted)
            readlineInterface.output.write("*");
            else
            readlineInterface.output.write(stringToWrite);
          };
    })    
}

module.exports = askParameters