import { readdir } from "fs/promises";
import { dirname, extname, join, parse } from "path";
import { fileURLToPath } from "url";

const recursiveFolderSearch = async (dir) => {
    const entries = await readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
        if (entry.isDirectory() && entry.name === 'workspace') {
            const workspacePath = join(dir, entry.name);

            return workspacePath;
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
}

const findByExt = async (ext = '.txt') => {
    const __filename = fileURLToPath(import.meta.url, fileURLToPath(import.meta.url));
    const __dirname = dirname(__filename);
    const startDir = parse(__dirname).dir

    const foundPathToWorkspaceFolder = await recursiveFolderSearch(startDir)

    if (!foundPathToWorkspaceFolder) {
        throw new Error('FS operation failed');
    }

    const entries = await readdir(foundPathToWorkspaceFolder, {withFileTypes: true});

    console.log('entries', entries);

    for (const entry of entries) {
        if (entry.isDirectory()) {
            console.log('dir!')
        }

        if (!entry.isDirectory()) {
            const fileExt = await extname(entry.name)
            console.log('fileExt', fileExt)
        }

    }

};

await findByExt();
