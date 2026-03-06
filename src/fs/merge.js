import { readdir } from 'fs/promises';
import { join } from 'path';

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
    // Write your code here
    // Default: read all .txt files from workspace/parts in alphabetical order
    // Optional: support --files filename1,filename2,... to merge specific files in provided order
    // Concatenate content and write to workspace/merged.txt
};

await merge();
