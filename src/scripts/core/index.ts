// src/scripts/core/index.ts

import './config';
import './accessibility';
import '../boot/init';
// Features are now loaded dynamically via module-loader.ts
// Static imports removed to enable proper code splitting
import { initPWAInstaller } from '../utilities/pwa-installer';
import '../utilities/share-config';
import '../utilities/share-theme-ui';
import '../features/panel';

// Start backdrop preload IMMEDIATELY (before boot sequence)
import { startBackdropPreload } from '../boot/backdrop-preloader';
if (typeof window !== 'undefined') {
  startBackdropPreload();
}

// Initialize PWA installer
if (typeof window !== 'undefined') {
  initPWAInstaller();
}
