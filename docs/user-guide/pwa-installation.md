# PWA Installation

## Overview

Debian CDE Desktop can be installed as a Progressive Web App (PWA) on your device, allowing you to run it like a native application with offline capabilities.

## Features

- **Offline Access**: Once installed, the app works without an internet connection
- **Native Experience**: Runs in its own window without browser UI
- **Desktop Integration**: Appears in your app launcher and taskbar
- **Automatic Updates**: Updates automatically when new versions are available

## Installation Methods

### Method 1: Desktop Icon (Recommended)

When you first visit the site in a compatible browser, an "Install PWA" icon will appear on the desktop:

<p align="center">
  <img src="/images/Install_PWA.png" alt="Install PWA Icon" width="300"/>
</p>

1. Wait for the boot sequence to complete
2. Look for the "Install PWA" icon on the desktop (floppy disk icon)
3. Double-click the icon
4. Follow the browser's installation prompt
5. The app will be installed and the icon will disappear

### Method 2: Browser Menu

Most modern browsers offer a PWA installation option:

- **Chrome/Edge**: Look for the install icon in the address bar or use the menu (⋮) → "Install Debian CDE Desktop"
- **Firefox**: Use the menu (☰) → "Install" (if available)
- **Safari (iOS)**: Tap Share → "Add to Home Screen"

## Requirements

- Modern browser with PWA support (Chrome, Edge, Firefox, Safari)
- HTTPS connection (required for service workers)
- Sufficient storage space for offline caching

## Uninstallation

To uninstall the PWA:

- **Chrome/Edge**: Go to chrome://apps or edge://apps, right-click the app, and select "Uninstall"
- **Firefox**: Remove from your applications menu
- **iOS**: Long-press the icon and select "Remove App"

## Technical Details

The PWA uses:

- Service Worker for offline caching and performance
- Web App Manifest for installation metadata
- Cache-first strategy for static assets
- Network-first strategy for dynamic content

## Troubleshooting

**Icon doesn't appear:**

- Make sure you're using a compatible browser
- Check that the site is served over HTTPS
- The app may already be installed
- Try refreshing the page

**Installation fails:**

- Check your browser's PWA support
- Ensure you have sufficient storage space
- Try clearing browser cache and reloading

**App doesn't work offline:**

- Wait for the initial cache to complete
- Check your browser's service worker status
- Reinstall the app if issues persist
