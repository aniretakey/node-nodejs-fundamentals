import readline from 'readline';

const cmdActions = {
    'uptime': () => console.log(`Uptime: ${process.uptime()} s`),
    'cwd': () => console.log(process.cwd()),
    'date': () => console.log(new Date()),
    'exit': () => {
        console.log('Goodbye!');
        process.exit();
    }

}

const interactive = () => {
    const args = process.argv.slice(2);

    console.log('args', args)


    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });

    readLine.prompt()

    readLine.on('line', (line) => {
        const lineWithoutWhitespace = line.trim();
        if (lineWithoutWhitespace in cmdActions) {
            cmdActions[lineWithoutWhitespace]()
            readLine.prompt()
        } else {
            console.log('Unknown command')
            readLine.prompt()
        }

    })

    readLine.on('SIGINT', () => {
        console.log('Goodbye!');
        process.exit();
    })
};

interactive();
