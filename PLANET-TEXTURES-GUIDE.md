# Planet Textures Setup Guide

## 📁 Where to Put Your Planet Images

Place all your planet texture images in the `/public/textures/` folder.

Your texture files should match the paths defined in `galaxy-constants.ts`:

```
/public/textures/
├── planet_green_albedo.webp    # For "about" planet
├── planet_orange_albedo.webp   # For "rules" planet
├── planet_purple_albedo.webp   # For "prizes" and "contact" planets
├── planet_blue_albedo.webp     # For "sponsor" and "faq" planets
├── planet_teal_albedo.webp     # For "register" planet
├── planet_normal.webp          # Normal map (shared by all)
├── planet_rough.webp           # Roughness map (shared by all)
└── planet_streaks.png          # Emissive map (optional, for prizes)
```

## 🎨 Recommended Texture Specifications

### Albedo/Color Maps (Main texture)

- **Format:** WebP or PNG
- **Size:** 1024x512 or 2048x1024 pixels (2:1 ratio for sphere mapping)
- **Type:** Color texture showing the planet's surface
- **Content:** Your planet design, patterns, colors

### Normal Maps (Surface detail)

- **Format:** WebP or PNG
- **Size:** Same as albedo (1024x512 or 2048x1024)
- **Type:** Purple-blue normal map
- **Content:** Creates 3D bump/detail on the surface
- **Note:** Can use the same normal map for all planets

### Roughness Maps (Surface shine)

- **Format:** WebP or PNG
- **Size:** Same as albedo
- **Type:** Grayscale image
- **Content:** Black = shiny, White = rough/matte
- **Note:** Can use the same roughness map for all planets

## 🌍 Free Planet Texture Resources

### Option 1: Download Free Planet Textures

- **Solar Textures** - https://www.solarsystemscope.com/textures/
- **Poly Haven** - https://polyhaven.com/textures/space
- **NASA Visible Earth** - https://visibleearth.nasa.gov/
- **Planet Pixel Emporium** - https://planetpixelemporium.com/planets.html

### Option 2: Create Custom Planet Textures

Use these tools to create custom planets:

- **Photoshop/GIMP** - Draw your own planetary surfaces
- **Blender** - Generate procedural planet textures
- **Canva** - Create simple colored spheres
- **AI Tools** - Use Midjourney/DALL-E to generate planet surfaces

## 🚀 Quick Setup with Sample Textures

If you don't have textures yet, here's how to create simple colored spheres:

### Using Online Tools:

1. Go to https://www.canva.com
2. Create a 2048x1024 canvas
3. Fill with gradient colors matching your planet colors:
   - Green (#10b981) for "about"
   - Orange (#f97316) for "rules"
   - Purple (#a855f7) for "prizes"
   - Blue (#3b82f6) for "sponsor"
   - Purple (#8b5cf6) for "contact"
   - Teal (#14b8a6) for "register"
   - Cyan (#06b6d4) for "faq"
4. Export as WebP or PNG
5. Rename to match the paths in galaxy-constants.ts

### Creating a Simple Normal Map:

1. Create a 1024x512 image filled with color: `rgb(128, 128, 255)` (medium blue-purple)
2. Save as `planet_normal.webp`

### Creating a Simple Roughness Map:

1. Create a 1024x512 grayscale image (medium gray, ~50% brightness)
2. Save as `planet_rough.webp`

## 📝 Current Texture Configuration

From your `galaxy-constants.ts`:

```typescript
TEXTURE_CONFIG = {
  about: {
    albedo: "/textures/planet_green_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    color: "#10b981", // Fallback color if texture fails
  },
  // ... etc for other planets
};
```

## 🔧 How to Change Texture Paths

To use different textures, edit `/lib/galaxy-constants.ts`:

```typescript
export const TEXTURE_CONFIG: Record<SectionId, TextureConfig> = {
  about: {
    albedo: "/textures/YOUR_TEXTURE_NAME.webp", // Change this
    normal: "/textures/YOUR_NORMAL_MAP.webp", // Change this
    rough: "/textures/YOUR_ROUGH_MAP.webp", // Change this
    label: "Олимпиадын тухай",
    color: "#10b981",
  },
  // ...
};
```

## ✅ Testing Your Textures

1. Place your texture files in `/public/textures/`
2. Make sure filenames match exactly (case-sensitive!)
3. Refresh your browser
4. Check browser console for texture loading errors
5. If textures don't load, check:
   - File paths are correct
   - Files exist in `/public/textures/`
   - File extensions match (.webp, .png, etc.)
   - No 404 errors in browser Network tab

## 🎨 Example: Making Earth-like Planet

For a realistic Earth-style planet:

1. **Albedo Map:** Blue oceans + green/brown land
2. **Normal Map:** Mountain ranges and ocean depth
3. **Roughness Map:** Oceans shiny (dark), land rough (light)

Download Earth textures from:

- https://www.solarsystemscope.com/textures/ (search for "Earth")

## 💡 Tips

- **WebP format** is recommended for smaller file sizes
- **PNG** works if WebP isn't available
- Keep texture sizes reasonable (1024x512 is good, 2048x1024 is great)
- All planets can share the same normal and roughness maps
- The `color` fallback will show if textures fail to load
- Textures load during the loading screen (progress bar)

## 🐛 Troubleshooting

**Problem:** Planets show solid colors instead of textures

- **Solution:** Check browser console for 404 errors, verify file paths

**Problem:** Textures look stretched or distorted

- **Solution:** Use 2:1 aspect ratio images (e.g., 2048x1024)

**Problem:** Loading takes too long

- **Solution:** Reduce texture size or convert to WebP format

**Problem:** Some planets have textures, others don't

- **Solution:** Check that ALL texture files exist for each planet

---

## 🎉 Quick Start Checklist

- [ ] Create `/public/textures/` folder if it doesn't exist
- [ ] Download or create 7 albedo textures (one per planet)
- [ ] Download or create 1 normal map (shared)
- [ ] Download or create 1 roughness map (shared)
- [ ] Rename files to match galaxy-constants.ts paths
- [ ] Refresh browser
- [ ] Check console for errors
- [ ] Enjoy your realistic planets! 🌍🪐
