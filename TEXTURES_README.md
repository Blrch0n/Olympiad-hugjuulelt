# Texture Files Fix

## Problem

Your GalaxyHero component was trying to load texture files that didn't exist, causing 404 errors:

- `/textures/bg-space.webp`
- `/textures/planet_*.webp`
- `/textures/planet_streaks.png`

## Solution Applied

### 1. Created Placeholder Files

Created empty placeholder files in `/public/textures/` to prevent 404 errors.

### 2. Modified Component to Use Solid Colors

Updated `components/GalaxyHero.tsx` to:

- Disabled texture loading (set to return `null`)
- Planets now use solid colors defined in the `TEX` object
- Background uses CSS gradient instead of texture image

## Current Behavior

✅ No more 404 errors
✅ Planets display with solid colors:

- About: Green (#10b981)
- Rules: Orange (#f97316)
- Prizes: Purple (#a855f7)
- Sponsor: Blue (#3b82f6)
- Contact: Purple (#8b5cf6)
- Register: Teal (#14b8a6)
- FAQ: Cyan (#06b6d4)

## Optional: Adding Real Textures

If you want to add real planet textures later, you have two options:

### Option 1: Enable Texture Loading (Recommended)

1. Add your texture files to `/public/textures/`
2. In `components/GalaxyHero.tsx`, find the texture loading code (around line 468)
3. Uncomment and enable the texture loading:

```typescript
// Change this:
const albedo = useMemo(() => {
  return null;
}, [tex.albedo, loader, cfg.id]);

// To this:
const albedo = useMemo(() => {
  try {
    const texture = loader.load(tex.albedo);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  } catch (err) {
    console.error(\`Failed to load texture for \${cfg.id}:\`, err);
    return null;
  }
}, [tex.albedo, loader, cfg.id]);
```

### Option 2: Create Simple Placeholder Textures

You can create simple colored textures using ImageMagick or Python PIL:

```bash
# Using ImageMagick
cd public/textures
convert -size 512x512 xc:'#a855f7' planet_purple_albedo.webp
convert -size 512x512 xc:'#3b82f6' planet_blue_albedo.webp
# ... etc for each color

# Or using Python PIL
python3 << 'EOF'
from PIL import Image
colors = {
    'planet_purple_albedo.webp': (168, 85, 247),
    'planet_blue_albedo.webp': (59, 130, 246),
    'planet_teal_albedo.webp': (20, 184, 166),
    'planet_orange_albedo.webp': (249, 115, 22),
    'planet_green_albedo.webp': (16, 185, 129),
}
for filename, color in colors.items():
    img = Image.new('RGB', (512, 512), color)
    img.save(f'public/textures/{filename}', 'WEBP')
EOF
```

### Recommended Texture Sources

- [Poly Haven](https://polyhaven.com/textures) - Free PBR textures
- [Solar System Scope](https://www.solarsystemscope.com/textures/) - Free planet textures
- [NASA's CGI Moon Kit](https://svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720) - Real NASA textures

## File Structure

```
public/
└── textures/
    ├── bg-space.webp              (background space image)
    ├── planet_purple_albedo.webp  (prizes planet)
    ├── planet_blue_albedo.webp    (sponsor/faq planet)
    ├── planet_teal_albedo.webp    (register planet)
    ├── planet_orange_albedo.webp  (rules planet)
    ├── planet_green_albedo.webp   (about planet)
    ├── planet_normal.webp         (normal map - optional)
    ├── planet_rough.webp          (roughness map - optional)
    └── planet_streaks.png         (emissive streaks - optional)
```

## Need Help?

If you want to restore texture loading or need help adding textures, let me know!
