const FILLED_VALUE = '█'
const EMPTY_VALUE = '░'
const initColorCode = '\x1b[0m'

function hexToAnsi(hex) {
    if (!hex) {
        return '';
    }

    const hexWithoutHash = hex.startsWith('#') ? hex.slice(1) : hex;

    const r = parseInt(hexWithoutHash.substring(0, 2), 16);
    const g = parseInt(hexWithoutHash.substring(2, 4), 16);
    const b = parseInt(hexWithoutHash.substring(4, 6), 16);

    return `\x1b[38;2;${r};${g};${b}m`;
}

const getProgressBarArgs = () => {
    const args = process.argv.slice(2);
    let duration = 5000, interval = 100, length = 30, color = null;

    for (let i = 0; i < args.length; i++) {
        const currElem = args[i];

        if (currElem === '--duration') {
            duration = Number(args[++i]);
            continue;
        }

        if (currElem === '--interval') {
            interval = Number(args[++i]);
            continue;
        }

        if (currElem === '--length') {
            length = Number(args[++i]);
            continue;
        }

        if (currElem === '--color') {
            color = args[++i] || null;
        }
    }

    return {duration, interval, length, color};
}

const progress = () => {
    const {duration, interval, length, color} = getProgressBarArgs();

    const ansiColor = hexToAnsi(color)

    const startTime = Date.now();

    const timer = setInterval(() => {
        const timePassed = Date.now() - startTime;
        const progressPercent = Math.min((timePassed / duration) * 100, 100);

        const filledBlocks = Math.floor((progressPercent / 100) * length);
        const emptyBlocks = length - filledBlocks;

        const progressString = `[${FILLED_VALUE.repeat(filledBlocks)}${EMPTY_VALUE.repeat(emptyBlocks)}] ${Math.floor(progressPercent)}%`;

        process.stdout.write(`\r${ansiColor}${progressString}${initColorCode}`)

        if (progressPercent >= 100) {
            process.stdout.write('\nDone!\n');
            clearInterval(timer);
        }

    })
};

progress();
