import { dirname, join, parse } from 'path';
import { readdir } from 'fs/promises'
import { fileURLToPath } from 'url'

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

const getFolderFilesInfo = async (dir) => {
    const result = []

    const entries = await readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const folderInfo = {
                path: entry.path,
                type: 'directory'
            }
            result.push(folderInfo);

            await getFolderFilesInfo(entry.path);

        } else {
            const file = await readdir(entry.path, {withFileTypes: true});

            console.log('entry', entry.path, entry.name)

            const fileInfo = {
                path: file,
                type: "file",
                size: 512,
                content: "nested file contents as base64 string"
            }

            result.push(fileInfo);

        }
    }

    return result
}


const snapshot = async () => {
    const __filename = fileURLToPath(import.meta.url, fileURLToPath(import.meta.url));
    const __dirname = dirname(__filename);
    const startDir = parse(__dirname).dir


    const foundPathToWorkspaceFolder = await recursiveFolderSearch(startDir)

    console.log('foundPathToWorkspaceFolder', foundPathToWorkspaceFolder)

    const filesInfo = await getFolderFilesInfo(foundPathToWorkspaceFolder);

    // Write your code here
    // Recursively scan workspace directory
    // Write snapshot.json with:
    // - rootPath: absolute path to workspace
    // - entries: flat array of relative paths and metadata

    if (!foundPathToWorkspaceFolder) {
        throw new Error('FS operation failed');
    }

    const result = {
        rootPath: foundPathToWorkspaceFolder,
        entries: filesInfo
    }

    console.log('result', result)

    return result
};

await snapshot();
