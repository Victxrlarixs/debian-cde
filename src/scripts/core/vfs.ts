import type { IVFS, VFSNode, VFSFolder } from './vfs/types';
import { VFSPathResolver } from './vfs/vfs-path-resolver';
import { VFSNodeAccessor } from './vfs/vfs-node-accessor';
import { VFSFileOperations } from './vfs/vfs-file-operations';
import { VFSFolderOperations } from './vfs/vfs-folder-operations';
import { VFSTransferOperations } from './vfs/vfs-transfer-operations';
import { VFSTrashManager } from './vfs/vfs-trash-manager';
import { VFSSearch } from './vfs/vfs-search';
import { VFSEventDispatcher } from './vfs/vfs-event-dispatcher';
import { VFSInitializer } from './vfs/vfs-initializer';
import { container } from './container';
import { SystemEvent } from './system-events';
import type { EventBus } from './event-bus';

export type { VFSNode, VFSFolder, VFSFile, VFSMetadata, IVFS } from './vfs/types';

declare global {
  interface Window {
    VirtualFS: IVFS;
  }
}

const fsMap: Record<string, VFSNode> = {};
let rootNode: VFSFolder | null = null;

const getEventBus = (): EventBus | null => {
  try {
    return container.has('eventBus') ? container.get<EventBus>('eventBus') : null;
  } catch {
    return null;
  }
};

const eventDispatcher = new VFSEventDispatcher();
const pathResolver = new VFSPathResolver();
const nodeAccessor = new VFSNodeAccessor(fsMap);
const fileOps = new VFSFileOperations(
  fsMap,
  nodeAccessor.getNode.bind(nodeAccessor),
  eventDispatcher.dispatchChange.bind(eventDispatcher)
);
const folderOps = new VFSFolderOperations(
  fsMap,
  nodeAccessor.getNode.bind(nodeAccessor),
  eventDispatcher.dispatchChange.bind(eventDispatcher)
);
const transferOps = new VFSTransferOperations(
  fsMap,
  nodeAccessor.getNode.bind(nodeAccessor),
  eventDispatcher.dispatchChange.bind(eventDispatcher)
);
const search = new VFSSearch(nodeAccessor.getChildren.bind(nodeAccessor));
const trashManager = new VFSTrashManager(
  nodeAccessor.getNode.bind(nodeAccessor),
  folderOps.mkdir.bind(folderOps),
  transferOps.move.bind(transferOps)
);
const initializer = new VFSInitializer(
  fsMap,
  (node: VFSFolder) => {
    rootNode = node;
  },
  folderOps.mkdir.bind(folderOps)
);

export const VFS: IVFS = {
  init: () => initializer.init(),
  resolvePath: (cwd: string, path: string) => pathResolver.resolvePath(cwd, path),
  getNode: (path: string) => nodeAccessor.getNode(path),
  getChildren: (path: string) => nodeAccessor.getChildren(path),
  exists: (path: string) => nodeAccessor.exists(path),
  getSize: (path: string) => nodeAccessor.getSize(path),
  touch: async (path: string, name: string) => {
    await fileOps.touch(path, name);
    const eventBus = getEventBus();
    if (eventBus) {
      eventBus.emitSync(SystemEvent.FILE_CREATED, { path: path + name, name });
    }
  },
  writeFile: async (path: string, content: string) => {
    await fileOps.writeFile(path, content);
    const eventBus = getEventBus();
    if (eventBus) {
      eventBus.emitSync(SystemEvent.FILE_SAVED, { path, content });
    }
  },
  rm: async (path: string, name: string) => {
    const result = await fileOps.rm(path, name);
    if (result) {
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.emitSync(SystemEvent.FILE_DELETED, { path: path + name, name });
      }
    }
    return result;
  },
  mkdir: async (path: string, name: string) => {
    await folderOps.mkdir(path, name);
    const eventBus = getEventBus();
    if (eventBus) {
      eventBus.emitSync(SystemEvent.FOLDER_CREATED, { path: path + name + '/', name });
    }
  },
  rename: async (path: string, oldName: string, newName: string) => {
    await transferOps.rename(path, oldName, newName);
    const eventBus = getEventBus();
    if (eventBus) {
      eventBus.emitSync(SystemEvent.FILE_RENAMED, {
        path: path + newName,
        name: newName,
      });
    }
  },
  move: async (oldPath: string, newPath: string) => {
    await transferOps.move(oldPath, newPath);
    const eventBus = getEventBus();
    if (eventBus) {
      eventBus.emitSync(SystemEvent.FILE_MOVED, { path: newPath });
    }
  },
  copy: async (sourcePath: string, destPath: string) => {
    await transferOps.copy(sourcePath, destPath);
    const eventBus = getEventBus();
    if (eventBus) {
      eventBus.emitSync(SystemEvent.FILE_COPIED, { path: destPath });
    }
  },
  moveToTrash: (path: string) => trashManager.moveToTrash(path),
  restoreFromTrash: (name: string) => trashManager.restoreFromTrash(name),
  search: (basePath: string, query: string, recursive?: boolean) =>
    search.search(basePath, query, recursive),
};

if (typeof window !== 'undefined') {
  window.VirtualFS = VFS;
}
