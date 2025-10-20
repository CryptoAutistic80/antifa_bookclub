# Anti-Fascist 3D Experience

A stunning, immersive React/Three.js website featuring an animated 3D background symbolizing resistance through knowledge, with rotating logos that fade seamlessly between each other.

## 🎨 Visual Features

### 3D Background
- **Particle System**: 1000+ animated particles flowing through the scene in blue tones
- **Orbiting Books**: Symbolic representations of knowledge rotating in multiple dimensions
- **Geometric Orbits**: Rotating rings in blue, red, and white representing interconnected ideas
- **Dynamic Lighting**: Multi-source lighting with blue and red accents for depth and atmosphere
- **Smooth Camera Movement**: Gentle orbital camera motion for immersive viewing

### Logo Display
- **Centered Display**: Both logos positioned at the center of the screen
- **Fade Transitions**: Smooth 0.5-second fade animations between logos
- **4-Second Rotation**: Logos transition every 4 seconds
- **Drop Shadow Effect**: Blue glow effect around logos for visual prominence
- **Responsive Sizing**: Adapts from 300px on desktop to 150px on mobile

## 🚀 Quick Start (Next.js Static Export)

### Development

```bash
# Install dependencies
pnpm install

# Start Next.js dev server
pnpm run dev
```

### Build (pre-rendered static site)

```bash
# Builds to `out/` via next.config.mjs (output: 'export')
pnpm run build
```

### Deploy to GitHub Pages

If your site is hosted at `https://USERNAME.github.io/REPO`, set the base path first:

1) Configure base path (once): edit `next.config.mjs` and set:

```js
// next.config.mjs
export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/REPO',
  assetPrefix: '/REPO',
};
```

2) Pre-build the site locally:

```bash
pnpm install
pnpm run build   # generates ./out
```

3) Publish `out/` to GitHub Pages (pick one):

- Manual upload (quick): push just the `out/` folder as a repo and enable Pages
- GitHub Actions (automated): use the workflow in `GITHUB_PAGES_SETUP.md`

4) In the repo settings, enable Pages and select the published branch.

## 📁 Project Structure

```
anti_fascist_3d_site/
├── app/
│   ├── page.jsx                   # Home page (client component)
│   ├── layout.jsx                 # Root layout + metadata
│   └── globals.css                # Global styles (migrated)
├── components/
│   ├── Background3D.jsx           # Three.js 3D scene (client)
│   └── LogoDisplay.jsx            # Logo rotation (client)
├── public/
│   ├── 94549151-6F8E-4D89-A1FA-7C3090A8C998.png
│   ├── 1C15C370-AF41-4332-8E41-32944415171E.png
│   ├── logo1.png
│   └── logo2.png
├── out/                           # Static build output (after `pnpm run build`)
├── next.config.mjs                # Next.js static export config
├── package.json                   # Dependencies and scripts
└── GITHUB_PAGES_SETUP.md          # Deployment guide
```

## 🛠️ Technology Stack

- **Next.js 15** (App Router, static export)
- **React 19** - UI framework
- **Three.js 0.180.0** - 3D graphics library
- **CSS** - Animations and styling

## 🎯 Design Philosophy

The website embodies the theme of **resistance through knowledge**:

1. **Orbiting Books** - Represent the power of literature and education
2. **Particle Flow** - Symbolize the spread of ideas and information
3. **Blue Tones** - Convey trust, stability, and intellectual pursuit
4. **Red Accents** - Represent resistance and revolutionary spirit
5. **Geometric Patterns** - Show interconnected networks of resistance

## 📱 Responsive Design

- **Desktop (1920px+)**: Full 300px logos with complete particle effects
- **Tablet (768px-1919px)**: 200px logos with optimized particle count
- **Mobile (320px-767px)**: 150px logos with streamlined effects

## ⚡ Performance

- **Bundle Size**: ~680KB minified
- **Gzipped Size**: ~183KB
- **Target FPS**: 60 FPS on modern hardware
- **Load Time**: <2 seconds on typical broadband

## 🔧 Customization

### Modify 3D Background
Edit `components/Background3D.jsx`:
- Change particle count (line ~40)
- Adjust particle colors (line ~65)
- Modify orbit speeds and colors (lines ~130-145)
- Adjust lighting intensity (lines ~149-157)

### Modify Logo Rotation
Edit `components/LogoDisplay.jsx`:
- Change rotation interval (line ~20): `4000` milliseconds
- Add/remove logos in the `logos` array (lines ~24-31)
- Adjust fade duration (line ~22): `500` milliseconds

### Modify Colors and Styling
Edit `app/globals.css`:
- Change drop shadow color (line ~12)
- Adjust logo size (line ~10)
- Modify animation timing

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari | 14+ | ✅ Full Support |

## 📊 File Sizes

| File | Size | Gzipped |
|------|------|---------|
| index-*.js | 663 KB | 182.9 KB |
| index-*.css | 2.0 KB | 0.76 KB |
| Book Club Logo | 699 KB | - |
| Resistance Symbol | 440 KB | - |

## 🚨 Troubleshooting

### 3D Background Not Rendering
- Ensure WebGL is enabled in your browser
- Check browser console (F12) for errors
- Try a different browser
- Update your graphics drivers

### Logos Not Displaying
- Verify PNG files exist in the `dist/` folder
- Check browser console for 404 errors
- Ensure correct file paths in `LogoDisplay.jsx`

### Poor Performance
- Reduce particle count in `Background3D.jsx`
- Disable some orbit rings
- Lower browser graphics quality settings
- Close other browser tabs

### GitHub Pages Not Working
- Ensure repository is public
- Check Pages settings in repository
- Verify `out/` folder is published
- If using a subpath (e.g., `/repo-name`), configure `basePath`/`assetPrefix` in `next.config.mjs`
- If you see 404 on refresh, ensure the page exists in `out/` (this app is a single index route)

## 📝 License

This project uses logos from the Anti-Fascist Book Club UK. Ensure proper attribution and licensing compliance when deploying.

## 🤝 Contributing

To contribute improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Built with ❤️ for resistance through knowledge**
