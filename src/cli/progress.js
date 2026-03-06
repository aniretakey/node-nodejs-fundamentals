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
                duration = nextElem;
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

    return {duration, interval, length};
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

};

progress();
