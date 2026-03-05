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

    let foundJsonPath = await recursiveFileSearch(startDir);

    if (!foundJsonPath) {
        throw new Error('FS operation failed');
    }

    const snapshotDir = dirname(foundJsonPath);

    const workspaceRestoredPath = join(snapshotDir, 'workspace_restored');

    try {
        await access(workspaceRestoredPath);

        throw new Error('FS operation failed');
    } catch {
    }

    const jsonFile = await readFile(foundJsonPath, 'utf-8');
    const jsonContent = JSON.parse(jsonFile);

    for (const entry of jsonContent.entries) {
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
