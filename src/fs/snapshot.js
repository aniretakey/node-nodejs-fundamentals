import { dirname, join, parse, relative } from 'path';
import { readdir, readFile, stat, writeFile } from 'fs/promises'
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

const getFolderFilesInfo = async (dir, workspaceRoot) => {
    const result = []

    const entries = await readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
        const absolutePath = join(dir, entry.name);
        const relativePath = relative(workspaceRoot, absolutePath);

        if (entry.isDirectory()) {
            const folderInfo = {
                path: relativePath,
                type: 'directory'
            }
            result.push(folderInfo);

            const nestedEntries = await getFolderFilesInfo(absolutePath, workspaceRoot);
            result.push(...nestedEntries);


        } else {
            const fileStat = await stat(absolutePath);

            const fileBuffer = await readFile(absolutePath)
            const fileContent = fileBuffer.toString('base64');

            const fileInfo = {
                path: relativePath,
                type: "file",
                size: fileStat.size,
                content: fileContent
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

    const filesInfo = await getFolderFilesInfo(foundPathToWorkspaceFolder, foundPathToWorkspaceFolder);

    if (!foundPathToWorkspaceFolder) {
        throw new Error('FS operation failed');
    }

    const result = {
        rootPath: foundPathToWorkspaceFolder,
        entries: filesInfo
    }

    const snapshotDir = dirname(foundPathToWorkspaceFolder);
    const snapshotPath = join(snapshotDir, 'snapshot.json');
    await writeFile(snapshotPath, JSON.stringify(result, null, 2))

    return result
};

await snapshot();
