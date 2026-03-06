const FILLED_VALUE = '█'
const EMPTY_VALUE = '░'

const getProgressBarArgs = () => {
    const args = process.argv.slice(2);
    let duration = 5000, interval = 100, length = 30, color = null;

    for (let i = 0; i < args.length; i++) {
        const currElem = args[i];
        const nextElem = args[i + 1];

        if (currElem && nextElem) {
            if (currElem === '--duration') {
                duration = Number(nextElem);
            }

            if (currElem === '--interval') {
                interval = nextElem;
            }

            if (currElem === '--length') {
                length = nextElem;
            }

            if (currElem === '--color') {
                color = nextElem;
            }
        }
    }

    return {duration, interval, length, color};
}

const progress = () => {
    const {duration, interval, length, color} = getProgressBarArgs();

    console.log('color', color);

    const startTime = Date.now();

    const timer = setInterval(() => {
        const timePassed = Date.now() - startTime;
        const progressPercent = Math.min((timePassed / duration) * 100, 100);

        const filledBlocks = Math.floor((progressPercent / 100) * length);
        const emptyBlocks = length - filledBlocks;

        const progressString = `[${FILLED_VALUE.repeat(filledBlocks)}${EMPTY_VALUE.repeat(emptyBlocks)}] ${Math.floor(progressPercent)}%`;

        process.stdout.write(`\r${progressString}`)

        if (progressPercent >= 100) {
            process.stdout.write('\nDone!\n');
            clearInterval(timer);
        }

    })
};

progress();
