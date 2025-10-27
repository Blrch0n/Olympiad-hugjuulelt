# Planet Textures Folder

Place your planet texture images here!

## Required Files

### For Each Planet (7 total):

- `planet_green_albedo.webp` - About planet (green)
- `planet_orange_albedo.webp` - Rules planet (orange)
- `planet_purple_albedo.webp` - Prizes planet (purple)
- `planet_blue_albedo.webp` - Sponsor planet (blue)
- `planet_teal_albedo.webp` - Register planet (teal)
- `planet_purple_albedo.webp` - Contact planet (purple) - same as prizes
- `planet_blue_albedo.webp` - FAQ planet (blue) - same as sponsor

### Shared Maps (used by all planets):

- `planet_normal.webp` - Normal/bump map (creates surface detail)
- `planet_rough.webp` - Roughness map (controls shininess)

## Image Specifications

- **Format:** WebP or PNG
- **Size:** 1024x512 pixels (or 2048x1024 for higher quality)
- **Ratio:** 2:1 (twice as wide as tall) for proper sphere mapping

## Where to Get Textures

### Free Resources:

1. **Solar System Scope** - https://www.solarsystemscope.com/textures/
2. **Poly Haven** - https://polyhaven.com/textures/space
3. **NASA** - https://visibleearth.nasa.gov/

### Quick Start:

If you don't have textures yet, the planets will show as solid colored spheres using the fallback colors defined in `galaxy-constants.ts`.

See `/PLANET-TEXTURES-GUIDE.md` for detailed instructions!
