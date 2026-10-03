import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDownloadsDir = path.join(rootDir, 'public', 'downloads');

console.log('🚀 Step 1: Building production website with Vite...');
execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

if (!fs.existsSync(publicDownloadsDir)) {
  fs.mkdirSync(publicDownloadsDir, { recursive: true });
}

// Helper to recursively add a directory to JSZip
function addDirectoryToZip(zip, folderPath, zipPath = '') {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const itemZipPath = zipPath ? `${zipPath}/${item}` : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subZip = zip.folder(item);
      addDirectoryToZip(subZip, fullPath, '');
    } else {
      zip.file(item, fs.readFileSync(fullPath));
    }
  }
}

async function buildPackages() {
  console.log('📦 Step 2: Packaging Website Bundle (.zip)...');
  const websiteZip = new JSZip();
  addDirectoryToZip(websiteZip, distDir);

  const websiteBuffer = await websiteZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const websiteZipPath = path.join(rootDir, 'omnitoolbox-website.zip');
  fs.writeFileSync(websiteZipPath, websiteBuffer);
  fs.writeFileSync(path.join(publicDownloadsDir, 'omnitoolbox-website.zip'), websiteBuffer);
  console.log(`✅ Generated: omnitoolbox-website.zip (${(websiteBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

buildPackages().catch(err => {
  console.error('Error building packages:', err);
  process.exit(1);
});
