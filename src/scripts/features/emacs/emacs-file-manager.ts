import { VFS } from '../../core/vfs';
import { ErrorSeverity } from '../../core/error-handler';
import { logger } from '../../utilities/logger';

export class EmacsFileManager {
  async save(path: string, content: string): Promise<boolean> {
    if (!path) return false;

    try {
      const { errorHandler } = await import('../../core/error-handler');
      const result = await errorHandler.wrapAsync(
        async () => {
          const existing = VFS.getNode(path);
          if (!existing) {
            const parts = path.split('/');
            const filename = parts.pop()!;
            const parentDir = parts.join('/') + '/';
            await VFS.touch(parentDir, filename);
          }
          await VFS.writeFile(path, content);
          return true;
        },
        {
          module: 'Emacs',
          action: 'save',
          severity: ErrorSeverity.HIGH,
          data: { path },
        }
      );
      return !!result;
    } catch (e) {
      logger.error(`[EmacsFileManager] Failed to save ${path}`, e);
      return false;
    }
  }

  async getNode(path: string) {
    return VFS.getNode(path);
  }

  async touch(parent: string, name: string) {
    return VFS.touch(parent, name);
  }
}
