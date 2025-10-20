# GitHub Pages Deployment Guide

## Overview
This is a pre-compiled static Next.js/React/Three.js website ready for GitHub Pages deployment. All files in the `out/` folder are production-ready and require no build process on the server. Pre-build locally, then publish the `out/` directory.

## Deployment Steps

### Option 1: Manual pre-build and publish (simple)

1. **Create a GitHub Repository**
   - Go to https://github.com/new
   - Create a new repository (e.g., `anti-fascist-3d-site`)
   - Choose "Public" for GitHub Pages to work

2. **If deploying under a repo subpath, configure base path**

If your Pages URL is `https://USERNAME.github.io/REPO`, edit `next.config.mjs`:

```js
// next.config.mjs
export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/REPO',
  assetPrefix: '/REPO',
};
```

3. **Build and upload the `out/` folder contents**
  ```bash
  # Build static site
  pnpm install
  pnpm run build   # outputs to ./out

  # Initialize git in the out folder
  cd out
  git init
  git add .
  git commit -m "Initial commit: 3D anti-fascist website"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git push -u origin main
  ```

4. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to "Pages" section
  - Set "Source" to "Deploy from a branch"
  - Select "main" branch and "/root" folder
  - Save and wait for deployment (usually 1-2 minutes)

5. **Access your site**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Option 2: Using GitHub Actions (automated)

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build   # outputs to ./out
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          # If using a custom domain, optionally add:
          # cname: your.custom.domain
```

## File Structure

```
out/
├── index.html              # Main entry point
├── _next/                  # Optimized assets
├── 94549151-6F8E-4D89-A1FA-7C3090A8C998.png
├── 1C15C370-AF41-4332-8E41-32944415171E.png
├── logo1.png
└── logo2.png
```

## Features

- **3D Animated Background**: Particle system with orbiting geometric shapes symbolizing knowledge and resistance
- **Logo Rotation**: Logos fade between each other every 4 seconds
- **Responsive Design**: Adapts to all screen sizes
- **Performance Optimized**: Minified and bundled for fast loading
- **No Server Required**: Pure static HTML/CSS/JavaScript

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

To modify the site:

1. Edit components in `components/` or styles in `app/globals.css`
2. Run `pnpm run build` to pre-build
3. The new `out/` folder will contain the updated files

### Key Files to Modify

- `components/Background3D.jsx` - 3D scene configuration
- `components/LogoDisplay.jsx` - Logo rotation logic
- `app/globals.css` - Styling and animations

## Performance Notes

- Bundle size: ~680KB (minified)
- Three.js library: ~180KB gzipped
- Optimized for modern browsers with WebGL support
- Smooth 60 FPS animation on most devices

## Troubleshooting

**Logos not showing?**
- Ensure PNG files are in the `out/` folder
 - If using a subpath, confirm `basePath` and `assetPrefix` match the repo name
- Check browser console for 404 errors

**3D background not rendering?**
- Verify WebGL is enabled in your browser
- Check browser console for WebGL errors
- Try a different browser

**Slow performance?**
- Reduce particle count in `Background3D.jsx`
- Disable some orbit rings
- Check GPU usage in browser DevTools

## License

This website displays logos for the Anti-Fascist Book Club UK. Ensure proper attribution and licensing compliance.
