import { access, readdir, readFile, writeFile } from 'fs/promises';
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

    const args = process.argv.slice(2);
    let filesToMerge = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--files' && args[i + 1]) {
            filesToMerge = args[i + 1].split(',');
            i++;
            break;
        }
    }

    if (filesToMerge) {
        for (const filename of filesToMerge) {
            const trimmedFilename = filename.trim();
            const filePath = join(partsDir, trimmedFilename);

            try {
                await access(filePath);
                const fileContent = await readFile(filePath, 'utf8');
                allContent += fileContent + '\n';
            } catch {
                throw new Error('FS operation failed');
            }
        }
    } else {
        try {
            await access(partsDir);
            const entries = await readdir(partsDir, {withFileTypes: true});
            const txtFiles = entries
                .filter(entry => !entry.isDirectory() && entry.name.endsWith('.txt'))
                .map(entry => entry.name)
                .sort();

            if (txtFiles.length === 0) {
                throw new Error('FS operation failed');
            }

            for (const filename of txtFiles) {
                const filePath = join(partsDir, filename);
                const fileContent = await readFile(filePath, 'utf8');
                allContent += fileContent + '\n';
            }
        } catch {
            throw new Error('FS operation failed');
        }
    }

    await writeFile(mergedFilePath, allContent.trim());
};

await merge();
