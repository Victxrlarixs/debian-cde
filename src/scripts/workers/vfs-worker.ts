// src/scripts/workers/vfs-worker.ts
// Web Worker for VFS operations to avoid blocking the main thread

interface VFSOperation {
  type: 'search' | 'flatten' | 'validate';
  payload: any;
}

interface VFSResult {
  type: 'result';
  operation: string;
  data: any;
  error?: string;
}

// Search files by name pattern
function searchFiles(fsMap: Record<string, any>, pattern: string): string[] {
  const regex = new RegExp(pattern, 'i');
  const results: string[] = [];

  for (const [path, node] of Object.entries(fsMap)) {
    if (node.type === 'file') {
      const fileName = path.split('/').pop() || '';
      if (regex.test(fileName)) {
        results.push(path);
      }
    }
  }

  return results;
}

// Flatten nested filesystem structure
function flattenFilesystem(root: any, basePath: string = '/'): Record<string, any> {
  const fsMap: Record<string, any> = {};

  function traverse(node: any, path: string): void {
    fsMap[path] = node;

    if (node.type === 'folder' && node.children) {
      for (const [name, child] of Object.entries(node.children)) {
        const fullPath = path + name + (child.type === 'folder' ? '/' : '');
        traverse(child, fullPath);
      }
    }
  }

  traverse(root, basePath);
  return fsMap;
}

// Validate filesystem integrity
function validateFilesystem(fsMap: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [path, node] of Object.entries(fsMap)) {
    if (!node.type) {
      errors.push(`Missing type for path: ${path}`);
    }

    if (node.type === 'file' && node.content === undefined) {
      errors.push(`File missing content: ${path}`);
    }

    if (node.type === 'folder' && !node.children) {
      errors.push(`Folder missing children: ${path}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

self.onmessage = async (e: MessageEvent<VFSOperation>) => {
  try {
    let data: any;

    switch (e.data.type) {
      case 'search':
        data = searchFiles(e.data.payload.fsMap, e.data.payload.pattern);
        break;

      case 'flatten':
        data = flattenFilesystem(e.data.payload.root, e.data.payload.basePath);
        break;

      case 'validate':
        data = validateFilesystem(e.data.payload.fsMap);
        break;

      default:
        throw new Error(`Unknown operation: ${e.data.type}`);
    }

    const result: VFSResult = {
      type: 'result',
      operation: e.data.type,
      data,
    };

    self.postMessage(result);
  } catch (error) {
    const result: VFSResult = {
      type: 'result',
      operation: e.data.type,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    self.postMessage(result);
  }
};
