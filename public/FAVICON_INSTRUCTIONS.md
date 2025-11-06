# Favicon Instructions

You need to create and add the following favicon files:

## Required Files

1. **favicon.ico** (32x32, 16x16 multi-size)
   - Classic favicon for older browsers
   - Place at: `/public/favicon.ico`

2. **apple-touch-icon.png** (180x180)
   - For iOS devices
   - Place at: `/public/apple-touch-icon.png`

3. **android-chrome-192x192.png** (192x192)
   - For Android devices
   - Place at: `/public/android-chrome-192x192.png`

4. **android-chrome-512x512.png** (512x512)
   - High-res Android icon
   - Place at: `/public/android-chrome-512x512.png`

5. **og-image.png** (1200x630)
   - Social media preview image
   - Place at: `/public/og-image.png`

## Easy Generation

Use **favicon.io** or **realfavicongenerator.net**:

1. Go to https://favicon.io/ or https://realfavicongenerator.net/
2. Upload your logo or create text-based favicon
3. Download the generated package
4. Extract all files to `/public/` directory

## Current Status

✅ favicon.svg exists (modern browsers) ❌ favicon.ico (needed for older
browsers) ❌ apple-touch-icon.png (needed for iOS) ❌ android-chrome icons
(needed for Android) ❌ og-image.png (needed for social media)

## Recommended Colors

- Primary: #8b5cf6 (purple)
- Secondary: #14b8a6 (teal)
- Background: #0f0f23 (dark)
