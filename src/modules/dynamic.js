const dynamic = async () => {
    const loadPlugin = async (pluginName) => {
        const pluginNames = ['uppercase', 'repeat', 'reverse']

        if (pluginNames.includes(pluginName)) {
            const plugin = await import(`./plugins/${pluginName}.js`);
            const res = await plugin.run();
            console.log(res)
        } else {
            console.log('Plugin not found')
            process.exit(1)
        }

    }

    const args = process.argv.slice(2);
    const pluginNameFromArgs = args[0];

    await loadPlugin(pluginNameFromArgs);
};

await dynamic();
