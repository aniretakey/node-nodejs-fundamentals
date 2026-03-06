const FILLED_VALUE = '█'
const EMPTY_VALUE = '░'

const getProgressBarArgs = () => {
    const args = process.argv.slice(2);
    let duration = 5000, interval = 100, length = 30, color = null;

    console.log('args', args)

    for (let i = 0; i < args.length; i++) {
        const currElem = args[i];
        const nextElem = args[i + 1];

        if (currElem && nextElem) {
            console.log('currElem', currElem)
            console.log('nextElem', nextElem)

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
    // Write your code here
    // Simulate progress bar from 0% to 100% over ~5 seconds
    // Update in place using \r every 100ms
    // Format: [████████████████████          ] 67%
    const {duration, interval, length, color} = getProgressBarArgs();

    console.log('duration', duration);
    console.log('interval', interval);
    console.log('length', length);
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
            process.stdout.write('Done!');
            clearInterval(timer);
        }

    })
};

progress();
