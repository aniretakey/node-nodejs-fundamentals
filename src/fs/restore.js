import { readdir } from 'fs/promises'
import { fileURLToPath } from "url";
import { dirname, join, parse } from "path";

const recursiveFileSearch = async (dir) => {
    const entries = await readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
        if (!entry.isDirectory() && entry.name === 'snapshot.json') {
            return join(dir, entry.name);
        }
    }

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const innerPath = join(dir, entry.name);
            const found = await recursiveFileSearch(innerPath);

            if (found !== null) {
                return found;
            }
        }
    }

    return null;
}


const restore = async () => {
    const __filename = fileURLToPath(import.meta.url, fileURLToPath(import.meta.url));
    const __dirname = dirname(__filename);
    const startDir = parse(__dirname).dir

    console.log('startDir', startDir)

    let foundJson = await recursiveFileSearch(startDir);
    console.log('foundJson', foundJson)

    if (!foundJson) {
        throw new Error('FS operation failed');
    }


};

await restore();
