import { readdir, writeFile } from 'fs/promises';
import { dirname, join, parse } from 'path';
import { fileURLToPath } from "url";

const recursiveFolderSearch = async (dir) => {
    const entries = await readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
        if (entry.isDirectory() && entry.name === 'workspace') {
            return join(dir, entry.name);
        }
    }

    for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'workspace') {
            const innerPath = join(dir, entry.name);
            const found = await recursiveFolderSearch(innerPath);
            if (found !== null) {
                return found;
            }
        }
    }

    return null;
};

const merge = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const startDir = parse(__dirname).dir;

    const workspacePath = await recursiveFolderSearch(startDir);
    if (!workspacePath) {
        throw new Error('FS operation failed');
    }

    const partsDir = join(workspacePath, 'parts');
    const mergedFilePath = join(workspacePath, 'merged.txt');

    let allContent = '';


    await writeFile(mergedFilePath, allContent.trim());
};

await merge();
