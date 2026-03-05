import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises'
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

    let foundJsonPath = await recursiveFileSearch(startDir);
    console.log('foundJson', foundJsonPath)

    if (!foundJsonPath) {
        throw new Error('FS operation failed');
    }

    const snapshotDir = dirname(foundJsonPath);
    console.log('snapshotDir', snapshotDir)

    const workspaceRestoredPath = join(snapshotDir, 'workspace_restored');
    console.log('workspaceRestoredPath', workspaceRestoredPath)

    try {
        await access(workspaceRestoredPath);

        throw new Error('FS operation failed');
    } catch {
    }

    const newWorkspaceFolder = await mkdir(workspaceRestoredPath);

    const jsonFile = await readFile(foundJsonPath, 'utf-8');
    const jsonContent = JSON.parse(jsonFile);

    console.log('jsonContent', jsonContent);

    for (const entry of jsonContent.entries) {
        console.log('entry', entry);
        const newElemPath = join(workspaceRestoredPath, entry.path);

        if (entry.type === 'directory') {
            await mkdir(newElemPath);
        }

        if (entry.type === 'file') {
            const decodedContent = Buffer.from(entry.content, 'base64')
            await writeFile(newElemPath, decodedContent);
        }
    }
};

await restore();
