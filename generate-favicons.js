/**
 * Favicon Generator Script
 * 
 * This script generates PNG favicons from the SVG source files.
 * 
 * Requirements:
 * npm install sharp --save-dev
 * 
 * Usage:
 * node generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Favicon sizes to generate
const faviconSizes = [16, 32, 48, 64, 96, 128, 256];

async function generateFavicons() {
  try {
    console.log('🎨 Starting favicon generation...\n');

    // Check if sharp is installed
    try {
      require.resolve('sharp');
    } catch (e) {
      console.error('❌ Error: sharp is not installed.');
      console.error('Please run: npm install sharp --save-dev\n');
      process.exit(1);
    }

    // Generate standard favicons from favicon.svg
    const faviconSvg = path.join(publicDir, 'favicon.svg');
    if (fs.existsSync(faviconSvg)) {
      const svgBuffer = fs.readFileSync(faviconSvg);
      
      console.log('📦 Generating PNG favicons...');
      for (const size of faviconSizes) {
        const outputPath = path.join(publicDir, `favicon-${size}x${size}.png`);
        await sharp(svgBuffer)
          .resize(size, size)
          .png({ quality: 100, compressionLevel: 9 })
          .toFile(outputPath);
        console.log(`   ✓ Generated favicon-${size}x${size}.png`);
      }

      // Generate specific sizes for web standards
      console.log('\n📱 Generating standard favicon sizes...');
      
      await sharp(svgBuffer)
        .resize(16, 16)
        .png({ quality: 100 })
        .toFile(path.join(publicDir, 'favicon-16x16.png'));
      console.log('   ✓ Generated favicon-16x16.png');

      await sharp(svgBuffer)
        .resize(32, 32)
        .png({ quality: 100 })
        .toFile(path.join(publicDir, 'favicon-32x32.png'));
      console.log('   ✓ Generated favicon-32x32.png');

      await sharp(svgBuffer)
        .resize(192, 192)
        .png({ quality: 100 })
        .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
      console.log('   ✓ Generated android-chrome-192x192.png');

      await sharp(svgBuffer)
        .resize(512, 512)
        .png({ quality: 100 })
        .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
      console.log('   ✓ Generated android-chrome-512x512.png');
    } else {
      console.error('❌ favicon.svg not found!');
    }

    // Generate Apple Touch Icon
    const appleSvg = path.join(publicDir, 'apple-touch-icon.svg');
    if (fs.existsSync(appleSvg)) {
      console.log('\n🍎 Generating Apple Touch Icon...');
      const appleSvgBuffer = fs.readFileSync(appleSvg);
      
      await sharp(appleSvgBuffer)
        .resize(180, 180)
        .png({ quality: 100 })
        .toFile(path.join(publicDir, 'apple-touch-icon.png'));
      console.log('   ✓ Generated apple-touch-icon.png');
    } else {
      console.warn('⚠️  apple-touch-icon.svg not found, skipping...');
    }

    // Generate logo PNGs for use in other contexts
    console.log('\n🖼️  Generating logo PNGs...');
    
    const logoLight = path.join(publicDir, 'perfxads-logo-light.svg');
    if (fs.existsSync(logoLight)) {
      const logoLightBuffer = fs.readFileSync(logoLight);
      await sharp(logoLightBuffer)
        .resize(800, 200)
        .png({ quality: 100 })
        .toFile(path.join(publicDir, 'perfxads-logo-light.png'));
      console.log('   ✓ Generated perfxads-logo-light.png');
    }

    const logoDark = path.join(publicDir, 'perfxads-logo-dark.svg');
    if (fs.existsSync(logoDark)) {
      const logoDarkBuffer = fs.readFileSync(logoDark);
      await sharp(logoDarkBuffer)
        .resize(800, 200)
        .png({ quality: 100 })
        .toFile(path.join(publicDir, 'perfxads-logo-dark.png'));
      console.log('   ✓ Generated perfxads-logo-dark.png');
    }

    console.log('\n✅ All favicons and logos generated successfully!');
    console.log('\n📝 Note: For .ico file generation, use an online tool like:');
    console.log('   https://realfavicongenerator.net/\n');
    
  } catch (error) {
    console.error('\n❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateFavicons();
