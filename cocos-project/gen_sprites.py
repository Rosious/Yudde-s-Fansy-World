from PIL import Image, ImageDraw, ImageFont
import os

base = r"D:\Yudde-Demo\cocos-project\assets\textures"
palette = {
    ("LINE",    "红线团"),   (220, 80, 80),
    ("BUTTON",  "纽扣"),     (80, 160, 220),
    ("SCISSORS","剪刀"),     (180, 180, 60),
    ("TAPE",    "皮尺"),     (120, 200, 120),
    ("SEWING",  "缝纫机"),   (180, 120, 200),
    ("SHUTTLE", "飞梭"),     (255, 215, 0),
    ("IRON",    "熨斗"),     (255, 100, 60),
    ("RAINBOW", "彩虹布"),   (100, 220, 255),
}
colors = {palette[i*3][0]: palette[i*3+2] for i in range(8)}
labels = {palette[i*3][0]: palette[i*3+1] for i in range(8)}

try:
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 16)
except:
    font = ImageFont.load_default()

for name, color in colors.items():
    path = os.path.join(base, name.lower())
    os.makedirs(path, exist_ok=True)
    img = Image.new('RGBA', (128, 128), color + (255,))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([2, 2, 125, 125], radius=16, outline=(255,255,255,180), width=3)
    label = labels[name]
    bbox = draw.textbbox((0,0), label, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text((64-tw/2, 64-th/2-4), label, fill=(255,255,255,240), font=font)
    filepath = os.path.join(path, "spriteFrame.png")
    img.save(filepath)
    print(f"OK: {filepath}")

print("8 placeholder sprites created.")
