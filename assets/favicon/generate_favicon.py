"""
generate_favicon.py
Genera favicon.ico (multi-size) con lo stesso design dell'SVG:
faccia ridente su sfondo a gradiente rosa/viola/arancio.
"""

from PIL import Image, ImageDraw


def make_face(size):
    """Disegna la faccia ridente a una data risoluzione."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # --- Sfondo: cerchio con gradiente diagonale arancio -> rosa -> viola ---
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)

    c1 = (255, 154, 60)   # #FF9A3C
    c2 = (255, 107, 157)  # #FF6B9D
    c3 = (199, 125, 255)  # #C77DFF

    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)  # 0..1 diagonale
            if t < 0.5:
                tt = t / 0.5
                r = int(c1[0] + (c2[0] - c1[0]) * tt)
                g = int(c1[1] + (c2[1] - c1[1]) * tt)
                b = int(c1[2] + (c2[2] - c1[2]) * tt)
            else:
                tt = (t - 0.5) / 0.5
                r = int(c2[0] + (c3[0] - c2[0]) * tt)
                g = int(c2[1] + (c3[1] - c2[1]) * tt)
                b = int(c2[2] + (c3[2] - c2[2]) * tt)
            bg_draw.point((x, y), fill=(r, g, b, 255))

    # Maschera circolare
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    img.paste(bg, (0, 0), mask)

    draw = ImageDraw.Draw(img)
    s = size / 32.0  # fattore di scala rispetto al viewBox 32x32 dell'SVG

    # --- Occhi: curve a "sorriso" ---
    eye_w = max(1, int(2 * s))
    # Occhio sinistro: arco da (9,13) a (13,13) passando per (11,10)
    draw.line(
        [(9 * s, 13 * s), (10 * s, 11 * s), (11 * s, 10 * s), (12 * s, 11 * s), (13 * s, 13 * s)],
        fill=(255, 255, 255, 255), width=eye_w, joint="curve"
    )
    # Occhio destro: arco da (19,13) a (23,13) passando per (21,10)
    draw.line(
        [(19 * s, 13 * s), (20 * s, 11 * s), (21 * s, 10 * s), (22 * s, 11 * s), (23 * s, 13 * s)],
        fill=(255, 255, 255, 255), width=eye_w, joint="curve"
    )

    # --- Bocca: forma a risata aperta ---
    mouth_points = [
        (9 * s, 19 * s),
        (16 * s, 27 * s),
        (23 * s, 19 * s),
        (16 * s, 23 * s),
    ]
    draw.polygon(mouth_points, fill=(255, 255, 255, 255))

    return img


def main():
    sizes = [16, 32, 48, 64]
    images = [make_face(s) for s in sizes]

    # compress_level=0 evita corruzioni note con Pillow su file ICO multi-size
    images[0].save(
        "favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=images[1:],
    )
    print("favicon.ico generata con successo.")


if __name__ == "__main__":
    main()
