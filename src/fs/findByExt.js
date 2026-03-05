import { readdir } from "fs/promises";
import { dirname, extname, join, parse, relative } from "path";
import { fileURLToPath } from "url";

const getExtFromCmd = async () => {
    const args = process.argv.slice(2);
    let ext = '.txt';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--ext' && args[i + 1]) {
            ext = args[i + 1].startsWith('.') ? args[i + 1] : `.${args[i + 1]}`;
            break;
        }
    }

    return ext
}

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
}

const recursiveFileExtSearch = async (dir, ext, rootDir) => {
    const result = [];
    const entries = await readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
        const innerPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            const foundFiles = await recursiveFileExtSearch(innerPath, ext, rootDir);
            result.push(...foundFiles);
        }

        if (!entry.isDirectory()) {
            const fileExt = extname(entry.name);
            const relativePath = relative(rootDir, innerPath);

            if (fileExt === ext) {
                result.push(relativePath)
            }
        }
    }

    return result
}

const findByExt = async () => {
    const foundExtension = await getExtFromCmd();

    const __filename = fileURLToPath(import.meta.url, fileURLToPath(import.meta.url));
    const __dirname = dirname(__filename);
    const startDir = parse(__dirname).dir

    const foundPathToWorkspaceFolder = await recursiveFolderSearch(startDir)

    if (!foundPathToWorkspaceFolder) {
        throw new Error('FS operation failed');
    }

    const res = await recursiveFileExtSearch(foundPathToWorkspaceFolder, foundExtension, foundPathToWorkspaceFolder);
    return res.sort((a, b) => a.localeCompare(b));
};

await findByExt();
