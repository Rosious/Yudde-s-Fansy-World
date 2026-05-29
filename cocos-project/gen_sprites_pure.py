"""纯 Python 生成 128x128 RGBA PNG 占位方块（无 PIL 依赖）"""
import struct, zlib, os

def make_png(width, height, r, g, b, a=255, label="", label_color=(255,255,255)):
    """生成 RGBA PNG 字节"""
    # 像素数据
    raw = b""
    for y in range(height):
        raw += b"\x00"  # filter byte
        for x in range(width):
            # 边框: 4px 白色半透明
            if x < 4 or x >= width-4 or y < 4 or y >= height-4:
                raw += struct.pack("BBBB", 255, 255, 255, 120)
            # 圆角简化: 8px 角
            elif (x < 12 and y < 12) or (x >= width-12 and y < 12) or (x < 12 and y >= height-12) or (x >= width-12 and y >= height-12):
                cx = 10 if x < 12 else width-11
                cy = 10 if y < 12 else height-11
                if (x-cx)**2 + (y-cy)**2 > 64:
                    raw += struct.pack("BBBB", 0, 0, 0, 0)
                else:
                    raw += struct.pack("BBBB", r, g, b, a)
            else:
                raw += struct.pack("BBBB", r, g, b, a)

    def chunk(ctype, data):
        c = ctype + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    idat = chunk(b"IDAT", zlib.compress(raw))
    iend = chunk(b"IEND", b"")
    return sig + ihdr + idat + iend

base = r"D:\Yudde-Demo\cocos-project\assets\textures"
sprites = [
    ("line",     220, 80, 80),
    ("button",    80, 160, 220),
    ("scissors", 180, 180, 60),
    ("tape",     120, 200, 120),
    ("sewing",   180, 120, 200),
    ("shuttle",  255, 215, 0),
    ("iron",     255, 100, 60),
    ("rainbow",  100, 220, 255),
]

for name, r, g, b in sprites:
    path = os.path.join(base, name)
    os.makedirs(path, exist_ok=True)
    png = make_png(128, 128, r, g, b, label=name.upper())
    filepath = os.path.join(path, "spriteFrame.png")
    with open(filepath, "wb") as f:
        f.write(png)
    print(f"OK: {filepath} ({len(png)} bytes)")

print(f"\n{len(sprites)} placeholder sprites created!")
