import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), color=(15, 23, 42)) # slate-900
draw = ImageDraw.Draw(img)

# 1. Subtle radial gradient effect in background
for y in range(H):
    factor = y / H
    r = int(15 * (1 - factor) + 20 * factor)
    g = int(23 * (1 - factor) + 18 * factor)
    b = int(42 * (1 - factor) + 60 * factor)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Ambient glow circle
for radius in range(250, 0, -2):
    alpha = int(35 * (radius / 250))
    glow_color = (99, 102, 241) # indigo-500
    # soft draw
    draw.ellipse([W//2 - radius, 120 - radius, W//2 + radius, 120 + radius], outline=glow_color)

# Fonts
font_title = None
font_sub = None
font_badge = None

# Try system korean font (Malgun Gothic)
font_paths = [
    "C:/Windows/Fonts/malgunbd.ttf",
    "C:/Windows/Fonts/malgun.ttf",
    "C:/Windows/Fonts/NanumGothicBold.ttf",
]

for fp in font_paths:
    if os.path.exists(fp):
        try:
            font_logo = ImageFont.truetype(fp, 52)
            font_title = ImageFont.truetype(fp, 68)
            font_sub = ImageFont.truetype(fp, 26)
            font_tag = ImageFont.truetype(fp, 22)
            font_footer = ImageFont.truetype(fp, 20)
            break
        except Exception:
            pass

if not font_title:
    font_title = ImageFont.load_default()
    font_sub = font_title
    font_tag = font_title
    font_footer = font_title
    font_logo = font_title

# 2. Logo Icon "T"
logo_size = 90
logo_x = W // 2 - logo_size // 2
logo_y = 75
draw.rounded_rectangle([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], radius=24, fill=(245, 158, 11), outline=(251, 191, 36), width=3)
draw.text((logo_x + 28, logo_y + 12), "T", fill=(15, 23, 42), font=font_logo)

# 3. Main Title
title_text = "트리비오 (Trivio)"
bbox = draw.textbbox((0, 0), title_text, font=font_title)
tw = bbox[2] - bbox[0]
draw.text(((W - tw) // 2, 195), title_text, fill=(255, 255, 255), font=font_title)

# 4. Slogan & Description
sub_text = "세상의 모든 지식을 시간순으로 맞혀보세요!"
bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
sw = bbox[2] - bbox[0]
draw.text(((W - sw) // 2, 285), sub_text, fill=(245, 158, 11), font=font_sub)

desc_text = "한국사 · 세계사 · 영화 · 비디오게임 · IT테크 · 스포츠 타임라인 퀴즈"
bbox = draw.textbbox((0, 0), desc_text, font=font_tag)
dw = bbox[2] - bbox[0]
draw.text(((W - dw) // 2, 335), desc_text, fill=(203, 213, 225), font=font_tag)

# 5. Feature Badges
badges = [
    ("❤️ 목숨 3개", (239, 68, 68)),
    ("🔄 3D 카드 힌트", (168, 85, 247)),
    ("📅 데일리 챌린지", (59, 130, 246)),
    ("🃏 150종 역사 덱", (16, 185, 129)),
    ("🎵 리얼 사운드", (245, 158, 11)),
]

total_badge_w = len(badges) * 190
start_bx = (W - total_badge_w) // 2
by = 415

for i, (btext, bcolor) in enumerate(badges):
    bx = start_bx + i * 190
    draw.rounded_rectangle([bx, by, bx + 175, by + 56], radius=28, fill=(30, 41, 59), outline=bcolor, width=2)
    bbox = draw.textbbox((0, 0), btext, font=font_footer)
    bw = bbox[2] - bbox[0]
    draw.text((bx + (175 - bw) // 2, by + 16), btext, fill=(241, 245, 249), font=font_footer)

# 6. Bottom Domain Stamp
domain_text = "wikitrivia-ko.vercel.app  |  100% 무료 웹게임 PWA"
bbox = draw.textbbox((0, 0), domain_text, font=font_footer)
dow = bbox[2] - bbox[0]
draw.text(((W - dow) // 2, 535), domain_text, fill=(148, 163, 184), font=font_footer)

# Save
out_dir = "D:/AI-Projects/WikiTrivia/public"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "og-image.png")
img.save(out_path, format="PNG", optimize=True)
print("Saved OG image to:", out_path)
