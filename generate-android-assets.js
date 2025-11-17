const sharp = require('sharp');
const { mkdir, writeFile } = require('fs/promises');
const { existsSync } = require('fs');
const path = require('path');

const LOGO_PATH = './resources/logo.jpg';
const ANDROID_RES_PATH = './android/app/src/main/res';

// Android icon sizes (for adaptive icons, foreground should be 108dp safe area)
// Actual pixel sizes for different densities
const ICON_SIZES = {
  'mipmap-mdpi': { launcher: 48, foreground: 108, round: 48 },
  'mipmap-hdpi': { launcher: 72, foreground: 162, round: 72 },
  'mipmap-xhdpi': { launcher: 96, foreground: 216, round: 96 },
  'mipmap-xxhdpi': { launcher: 144, foreground: 324, round: 144 },
  'mipmap-xxxhdpi': { launcher: 192, foreground: 432, round: 192 },
};

// Splash screen sizes for different densities and orientations
const SPLASH_SIZES = {
  drawable: { width: 800, height: 1280 }, // Default portrait
  'drawable-port-mdpi': { width: 320, height: 480 },
  'drawable-port-hdpi': { width: 480, height: 800 },
  'drawable-port-xhdpi': { width: 720, height: 1280 },
  'drawable-port-xxhdpi': { width: 1080, height: 1920 },
  'drawable-port-xxxhdpi': { width: 1440, height: 2560 },
  'drawable-land-mdpi': { width: 480, height: 320 },
  'drawable-land-hdpi': { width: 800, height: 480 },
  'drawable-land-xhdpi': { width: 1280, height: 720 },
  'drawable-land-xxhdpi': { width: 1920, height: 1080 },
  'drawable-land-xxxhdpi': { width: 2560, height: 1440 },
};

async function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

async function generateIcon(logoBuffer, size, outputPath) {
  // Regular icons: use 90% of size to leave 5% padding on each side
  const iconSize = Math.floor(size * 0.8);
  const padding = Math.floor((size - iconSize) / 2);

  // Resize logo
  const logoResized = await sharp(logoBuffer)
    .resize(iconSize, iconSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toBuffer();

  // Create square canvas with white background and place logo in center
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: logoResized,
        left: padding,
        top: padding,
      },
    ])
    .png()
    .toFile(outputPath);
  console.log(
    `✓ Generated ${outputPath} (${size}x${size} with ${iconSize}x${iconSize} logo)`
  );
}

async function generateRoundIcon(logoBuffer, size, outputPath) {
  // Round icons: use 90% of size to leave 5% padding on each side
  const iconSize = Math.floor(size * 0.9);
  const padding = Math.floor((size - iconSize) / 2);

  // Create a circular mask
  const circularMask = Buffer.from(
    `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`
  );

  // Resize logo
  const logoResized = await sharp(logoBuffer)
    .resize(iconSize, iconSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toBuffer();

  // Create full-size canvas with white background, place logo in center, then apply circular mask
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: logoResized,
        left: padding,
        top: padding,
      },
      {
        input: circularMask,
        blend: 'dest-in',
      },
    ])
    .png()
    .toFile(outputPath);
  console.log(
    `✓ Generated ${outputPath} (${size}x${size} round with ${iconSize}x${iconSize} logo)`
  );
}

async function generateForegroundIcon(logoBuffer, size, outputPath) {
  // Foreground icons should have safe area (66% of size for adaptive icons)
  // The foreground is 108dp, safe zone is 66dp, so logo should be 66% of foreground size
  const safeSize = Math.floor(size * 0.66);
  const canvasSize = size; // Full size canvas
  const padding = Math.floor((canvasSize - safeSize) / 2);

  // Resize logo to safe size
  const logoResized = await sharp(logoBuffer)
    .resize(safeSize, safeSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toBuffer();

  // Create full-size canvas with transparent background, center the logo
  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([
      {
        input: logoResized,
        left: padding,
        top: padding,
      },
    ])
    .png()
    .toFile(outputPath);
  console.log(
    `✓ Generated ${outputPath} (${canvasSize}x${canvasSize} with ${safeSize}x${safeSize} logo in safe zone)`
  );
}

async function generateSplash(logoBuffer, width, height, outputPath) {
  // Create splash screen with logo centered
  // Use 15% of smaller dimension (Android recommends icon fits in 192dp circle)
  // For typical 1080x1920 screen: 192dp ≈ 288px ≈ 15% of 1920px
  const logoSize = Math.min(width, height) * 0.15;

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(logoBuffer)
          .resize(logoSize, logoSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .toBuffer(),
        left: Math.floor((width - logoSize) / 2),
        top: Math.floor((height - logoSize) / 2),
      },
    ])
    .png()
    .toFile(outputPath);
  console.log(`✓ Generated ${outputPath} (${width}x${height})`);
}

async function main() {
  console.log('🚀 Generating Android icons and splash screens...\n');

  // Check if logo exists
  if (!existsSync(LOGO_PATH)) {
    console.error(`❌ Logo not found at ${LOGO_PATH}`);
    process.exit(1);
  }

  // Load logo
  const logoBuffer = await sharp(LOGO_PATH).toBuffer();
  console.log(`📸 Loaded logo from ${LOGO_PATH}\n`);

  // Generate icons
  console.log('📱 Generating app icons...');
  for (const [folder, sizes] of Object.entries(ICON_SIZES)) {
    const folderPath = path.join(ANDROID_RES_PATH, folder);
    await ensureDir(folderPath);

    // Generate ic_launcher.png
    await generateIcon(
      logoBuffer,
      sizes.launcher,
      path.join(folderPath, 'ic_launcher.png')
    );

    // Generate ic_launcher_round.png
    await generateRoundIcon(
      logoBuffer,
      sizes.round,
      path.join(folderPath, 'ic_launcher_round.png')
    );

    // Generate ic_launcher_foreground.png
    await generateForegroundIcon(
      logoBuffer,
      sizes.foreground,
      path.join(folderPath, 'ic_launcher_foreground.png')
    );
  }

  console.log('\n🖼️  Generating splash screens...');
  for (const [folder, dimensions] of Object.entries(SPLASH_SIZES)) {
    const folderPath = path.join(ANDROID_RES_PATH, folder);
    await ensureDir(folderPath);

    await generateSplash(
      logoBuffer,
      dimensions.width,
      dimensions.height,
      path.join(folderPath, 'splash.png')
    );
  }

  console.log('\n✅ All Android assets generated successfully!');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
