import os
import random
import logging
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageOps
from django.conf import settings
from django.core.mail import EmailMessage

logger = logging.getLogger(__name__)

# Paths
LOGO_PATH = os.path.join(os.path.dirname(__file__), "static", "logo.png")

def generate_student_id(course: str = None, batch_type: str = None) -> str:
    """Generates a unique student ID in format:
    [Course Initial] + [YYMM] + [Batch Initial] + [4 random digits]
    e.g., P2607I1234 for Python course in July 2026, Internship batch.
    """
    if course:
        course_clean = course.strip()
        course_prefix = course_clean[0].upper() if course_clean else "P"
    else:
        course_prefix = "P"

    now = datetime.now()
    date_str = now.strftime("%y%m")

    if batch_type:
        batch_clean = batch_type.strip()
        batch_prefix = batch_clean[0].upper() if batch_clean else "I"
    else:
        batch_prefix = "I"

    rand_digits = "".join(str(random.randint(0, 9)) for _ in range(4))
    return f"{course_prefix}{date_str}{batch_prefix}{rand_digits}"

def get_system_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    """Tries to load a clean system font (Segoe UI or Arial), falling back to default PIL font"""
    font_names = []
    if os.name == 'nt':  # Windows
        font_dir = "C:\\Windows\\Fonts"
        if bold:
            font_names = ["segoeuib.ttf", "arialbd.ttf", "trebucbd.ttf"]
        else:
            font_names = ["segoeui.ttf", "arial.ttf", "trebuc.ttf"]
    else:  # Linux/Mac
        font_dir = "/usr/share/fonts/truetype"
        font_names = [
            "dejavu/DejaVuSans-Bold.ttf" if bold else "dejavu/DejaVuSans.ttf",
            "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
            "LiberationSans-Bold.ttf" if bold else "LiberationSans.ttf"
        ]
        
    for font_name in font_names:
        full_path = os.path.join(font_dir, font_name)
        if os.path.exists(full_path):
            try:
                return ImageFont.truetype(full_path, size)
            except Exception as e:
                logger.warning(f"Could not load font {full_path}: {e}")
                
    # Fallback to default
    logger.info("Using default ImageFont.")
    return ImageFont.load_default()

def get_logo_image(path: str):
    if not os.path.exists(path):
        return None
    try:
        img = Image.open(path).convert("RGBA")
        # Make white background transparent
        datas = img.getdata()
        new_data = []
        for item in datas:
            # If pixel is white or very close to white (threshold 240)
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data.append((255, 255, 255, 0)) # fully transparent
            else:
                new_data.append(item)
        img.putdata(new_data)
        # Resize maintaining aspect ratio
        # Target height 48px, width will scale accordingly
        w, h = img.size
        new_w = int((w / h) * 48)
        img = img.resize((new_w, 48), Image.Resampling.LANCZOS)
        return img
    except Exception as e:
        logger.error(f"Failed to process logo image: {e}")
        return None

def create_id_card(
    student_id: str,
    name: str,
    course: str,
    batch_type: str,
    joining_date: str,
    role: str,
    photo_file
) -> str:
    """Composes a beautifully themed digital ID card using Pillow with a premium modern dark theme."""
    card_width = 480
    card_height = 720
    
    # Create cards directory inside MEDIA_ROOT
    cards_dir = os.path.join(settings.MEDIA_ROOT, "cards")
    os.makedirs(cards_dir, exist_ok=True)
    
    # Colors
    bg_color_top = (244, 249, 253, 255)     # Light ice blue
    bg_color_bottom = (255, 255, 255, 255)  # Pearl white
    accent_cyan = (14, 165, 233, 255)      # Primary Sky Blue (0EA5E9)
    accent_indigo = (99, 102, 241, 255)    # Electric Indigo (6366F1)
    text_white = (15, 23, 42, 255)         # Deep Slate (900)
    text_grey = (71, 85, 105, 255)         # Muted Slate (600)
    
    image = Image.new("RGBA", (card_width, card_height), bg_color_top)
    draw_bg = ImageDraw.Draw(image)
    
    # Draw linear gradient manually
    for y in range(card_height):
        r = int(bg_color_top[0] + ((bg_color_bottom[0] - bg_color_top[0]) * (y / card_height)))
        g = int(bg_color_top[1] + ((bg_color_bottom[1] - bg_color_top[1]) * (y / card_height)))
        b = int(bg_color_top[2] + ((bg_color_bottom[2] - bg_color_top[2]) * (y / card_height)))
        draw_bg.line([(0, y), (card_width, y)], fill=(r, g, b, 255))
        
    # Create transparent overlay for alpha-blended design elements
    overlay = Image.new("RGBA", (card_width, card_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
        
    # 1b. Draw subtle background glow concentric rings
    glow_cyan = (14, 165, 233, 18)     # Sky blue glow
    glow_indigo = (99, 102, 241, 12)   # Indigo glow
    
    # Top-Left glow rings
    for r in range(150, 350, 40):
        draw.ellipse([-150 + (350-r)//2, -150 + (350-r)//2, r, r], outline=glow_cyan, width=1)
        
    # Bottom-Right glow rings
    for r in range(150, 350, 40):
        draw.ellipse([card_width - r, card_height - r, card_width + 150 - (350-r)//2, card_height + 150 - (350-r)//2], outline=glow_indigo, width=1)

    # 2. Add Corporate Accents & Borders
    # Outer thin bounding border (15px inset)
    draw.rectangle([15, 15, card_width - 15, card_height - 15], outline=(14, 165, 233, 40), width=1)
    
    # Corners
    bracket_len = 25
    draw.line([(15, 15), (15 + bracket_len, 15)], fill=accent_cyan, width=2)
    draw.line([(15, 15), (15, 15 + bracket_len)], fill=accent_cyan, width=2)
    draw.line([(card_width - 15, 15), (card_width - 15 - bracket_len, 15)], fill=accent_cyan, width=2)
    draw.line([(card_width - 15, 15), (card_width - 15, 15 + bracket_len)], fill=accent_cyan, width=2)
    draw.line([(15, card_height - 15), (15 + bracket_len, card_height - 15)], fill=accent_cyan, width=2)
    draw.line([(15, card_height - 15), (15, card_height - 15 - bracket_len)], fill=accent_cyan, width=2)
    draw.line([(card_width - 15, card_height - 15), (card_width - 15 - bracket_len, card_height - 15)], fill=accent_cyan, width=2)
    draw.line([(card_width - 15, card_height - 15), (card_width - 15, card_height - 15 - bracket_len)], fill=accent_cyan, width=2)
    
    # 3. Algonex Branding Header
    font_title = get_system_font(26, bold=True)
    font_subtitle = get_system_font(10, bold=True)
    font_location = get_system_font(9, bold=False)
    
    logo_img = get_logo_image(LOGO_PATH)
    if logo_img:
        logo_w, logo_h = logo_img.size
        draw.rounded_rectangle([32, 26, 32 + logo_w + 14, 26 + 48 + 8], radius=6, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
        logo_x = 32 + 7
        logo_y = 26 + 4
        overlay.paste(logo_img, (logo_x, logo_y), mask=logo_img)
        text_x = 32 + logo_w + 24
        draw.text((text_x, 26), "ALGONEX", fill=text_white, font=font_title)
        draw.text((text_x + 2, 57), "I T   S O L U T I O N S", fill=accent_cyan, font=font_subtitle)
        draw.text((text_x + 2, 71), "Marthahalli, Bangalore", fill=text_grey, font=font_location)
    else:
        logo_x = 75
        logo_y = 38
        draw.polygon([(logo_x + 8, logo_y), (logo_x + 16, logo_y + 12), (logo_x + 8, logo_y + 24), (logo_x, logo_y + 12)], fill=accent_cyan)
        draw.polygon([(logo_x + 16, logo_y + 4), (logo_x + 24, logo_y + 16), (logo_x + 16, logo_y + 28), (logo_x + 8, logo_y + 16)], fill=(99, 102, 241, 220))
        draw.text((logo_x + 36, 30), "ALGONEX", fill=text_white, font=font_title)
        draw.text((logo_x + 38, 63), "I T   S O L U T I O N S", fill=accent_cyan, font=font_subtitle)
        draw.text((logo_x + 38, 77), "Marthahalli, Bangalore", fill=text_grey, font=font_location)
    
    draw.line([(30, 95), (card_width - 30, 95)], fill=(148, 163, 184, 40), width=1)
    
    # 4. Draw Photo
    avatar_size = (150, 150)
    avatar_x = (card_width - avatar_size[0]) // 2
    avatar_y = 120
    
    try:
        if hasattr(photo_file, 'read'):
            photo_file.seek(0)
            raw_photo = Image.open(photo_file).convert("RGBA")
        else:
            raw_photo = Image.open(photo_file).convert("RGBA")
            
        cropped_photo = ImageOps.fit(raw_photo, avatar_size, centering=(0.5, 0.5))
        mask = Image.new("L", avatar_size, 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse([0, 0, avatar_size[0], avatar_size[1]], fill=255)
        
        avatar = Image.new("RGBA", avatar_size)
        avatar.paste(cropped_photo, (0, 0), mask=mask)
        
        draw.ellipse([avatar_x - 6, avatar_y - 6, avatar_x + avatar_size[0] + 6, avatar_y + avatar_size[1] + 6], outline=(14, 165, 233, 50), width=3)
        draw.ellipse([avatar_x - 3, avatar_y - 3, avatar_x + avatar_size[0] + 3, avatar_y + avatar_size[1] + 3], outline=accent_indigo, width=2)
        draw.ellipse([avatar_x - 1, avatar_y - 1, avatar_x + avatar_size[0] + 1, avatar_y + avatar_size[1] + 1], outline=(244, 249, 253, 255), width=2)
        
        overlay.paste(avatar, (avatar_x, avatar_y), mask=avatar)
    except Exception as e:
        logger.error(f"Failed to process ID card photo: {e}")
        draw.ellipse([avatar_x, avatar_y, avatar_x + avatar_size[0], avatar_y + avatar_size[1]], fill=(244, 249, 253, 255), outline=accent_cyan, width=2)
        draw.text((avatar_x + 45, avatar_y + 65), "PHOTO", fill=text_grey)

    # 5. Details Card Box
    details_x = 35
    details_y = 290
    details_w = 410
    details_h = 310
    
    draw.rounded_rectangle([details_x - 4, details_y - 4, details_x + details_w + 4, details_y + details_h + 4], radius=15, fill=None, outline=(14, 165, 233, 18), width=2)
    draw.rounded_rectangle([details_x, details_y, details_x + details_w, details_y + details_h], radius=12, fill=(255, 255, 255, 220), outline=(14, 165, 233, 70), width=1)
    
    # 6. Student Data
    font_bold = get_system_font(12, bold=True)
    font_regular = get_system_font(13, bold=False)
    font_name = get_system_font(20, bold=True)
    font_id = get_system_font(16, bold=True)
    
    name_str = name.upper()
    try:
        n_w = draw.textbbox((0, 0), name_str, font=font_name)[2]
    except AttributeError:
        n_w, _ = draw.textsize(name_str, font=font_name)
    draw.text((details_x + (details_w - n_w) // 2, details_y + 18), name_str, fill=text_white, font=font_name)
    
    role_str = role.upper() if role else "TRAINEE"
    try:
        r_w = draw.textbbox((0, 0), role_str, font=font_bold)[2]
    except AttributeError:
        r_w, _ = draw.textsize(role_str, font=font_bold)
    draw.text((details_x + (details_w - r_w) // 2, details_y + 45), role_str, fill=(168, 85, 247, 255), font=font_bold)
    
    draw.line([(details_x + 20, details_y + 68), (details_x + details_w - 20, details_y + 68)], fill=(226, 232, 240, 255), width=1)
    
    fields = [
        ("STUDENT ID", student_id, accent_cyan), 
        ("COURSE TRACK", course, text_white),
        ("PROGRAM TYPE", batch_type, text_white),
        ("ADMISSION DATE", joining_date, text_white)
    ]
    
    start_y = details_y + 80
    spacing_y = 52
    
    for label, val, val_color in fields:
        draw.text((details_x + 25, start_y), label, fill=text_grey, font=font_bold)
        display_val = val
        if len(val) > 32:
            display_val = val[:29] + "..."
        draw.text((details_x + 25, start_y + 18), display_val, fill=val_color, font=font_regular if label != "STUDENT ID" else font_id)
        if label != "ADMISSION DATE":
            draw.line([(details_x + 25, start_y + 42), (details_x + details_w - 25, start_y + 42)], fill=(226, 232, 240, 255), width=1)
        start_y += spacing_y
        
    tagline = "algonex.co.in"
    font_tag = get_system_font(11, bold=False)
    try:
        t_w = draw.textbbox((0, 0), tagline, font=font_tag)[2]
    except AttributeError:
        t_w, _ = draw.textsize(tagline, font=font_tag)
    draw.text(((card_width - t_w) // 2, card_height - 40), tagline, fill=accent_cyan, font=font_tag)
    
    image = Image.alpha_composite(image, overlay)
    
    output_filename = f"{student_id}.png"
    output_path = os.path.join(cards_dir, output_filename)
    image.save(output_path, "PNG")
    return output_path

def create_invoice(
    student_id: str,
    name: str,
    course: str,
    batch_type: str,
    joining_date: str,
    total_fee: float,
    paid_fee: float,
    balance_fee: float,
    transaction_id: str,
    registration_date: str,
    amount_paid_now: float = None
) -> str:
    """Composes a beautifully themed digital invoice using Pillow."""
    card_width = 600
    card_height = 800
    
    # Create invoices directory inside MEDIA_ROOT
    invoices_dir = os.path.join(settings.MEDIA_ROOT, "invoices")
    os.makedirs(invoices_dir, exist_ok=True)
    
    font_brand = get_system_font(18, bold=True)
    font_sub_brand = get_system_font(9, bold=True)
    font_invoice = get_system_font(22, bold=True)
    font_section_h = get_system_font(11, bold=True)
    font_body = get_system_font(12, bold=False)
    font_body_bold = get_system_font(12, bold=True)
    font_total = get_system_font(14, bold=True)
    
    image = Image.new("RGBA", (card_width, card_height), (255, 255, 255, 255))
    overlay = Image.new("RGBA", (card_width, card_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    draw.rectangle([15, 15, card_width - 15, card_height - 15], outline=(124, 58, 237, 30), width=2)
    
    logo_img = get_logo_image(LOGO_PATH)
    if logo_img:
        logo_w, logo_h = logo_img.size
        logo_x = 40
        logo_y = 35
        overlay.paste(logo_img, (logo_x, logo_y), mask=logo_img)
        text_x = logo_x + logo_w + 12
        draw.text((text_x, logo_y - 2), "ALGONEX IT SOLUTIONS", fill=(12, 6, 28, 255), font=font_brand)
        draw.text((text_x, logo_y + 26), "INNOVATING LEARNING • CUSTOMER RECEIPT", fill=(100, 110, 130, 255), font=font_sub_brand)
    else:
        logo_x, logo_y = 40, 40
        draw.rounded_rectangle([logo_x, logo_y, logo_x + 35, logo_y + 35], radius=6, fill=(124, 58, 237, 255))
        draw.line([(logo_x + 9, logo_y + 17), (logo_x + 16, logo_y + 25), (logo_x + 26, logo_y + 10)], fill=(255, 255, 255, 255), width=3)
        draw.text((90, logo_y), "ALGONEX IT SOLUTIONS", fill=(12, 6, 28, 255), font=font_brand)
        draw.text((90, logo_y + 24), "INNOVATING LEARNING • CUSTOMER RECEIPT", fill=(100, 110, 130, 255), font=font_sub_brand)
    
    try:
        inv_w = draw.textbbox((0, 0), "INVOICE", font=font_invoice)[2]
    except AttributeError:
        inv_w, _ = draw.textsize("INVOICE", font=font_invoice)
    draw.text((card_width - 40 - inv_w, logo_y + 4), "INVOICE", fill=(124, 58, 237, 255), font=font_invoice)
    
    draw.line([(40, 100), (card_width - 40, 100)], fill=(220, 225, 235, 255), width=1)
    
    draw.text((40, 120), "BILLED TO:", fill=(120, 130, 150, 255), font=font_section_h)
    draw.text((40, 140), name.upper(), fill=(12, 6, 28, 255), font=font_brand)
    draw.text((40, 170), f"Student ID: {student_id}", fill=(12, 6, 28, 255), font=font_body_bold)
    draw.text((40, 190), f"Course: {course}", fill=(50, 60, 80, 255), font=font_body)
    draw.text((40, 210), f"Batch: {batch_type}", fill=(50, 60, 80, 255), font=font_body)
    
    try:
        reg_datetime = datetime.fromisoformat(registration_date)
        reg_date_str = reg_datetime.strftime("%d %b %Y, %I:%M %p")
    except Exception:
        reg_date_str = registration_date
        
    try:
        join_date_dt = datetime.strptime(joining_date, "%Y-%m-%d")
        join_date_str = join_date_dt.strftime("%d %b %Y")
    except Exception:
        join_date_str = joining_date
        
    right_x = 340
    draw.text((right_x, 120), "RECEIPT DETAILS:", fill=(120, 130, 150, 255), font=font_section_h)
    
    receipt_id = f"REC-{student_id}"
    details = [
        ("Receipt ID:", receipt_id),
        ("Transaction ID:", transaction_id),
        ("Registration Date:", reg_date_str),
        ("Expected Joining:", join_date_str),
        ("Payment Status:", "Active")
    ]
    
    curr_y = 140
    for label, val in details:
        draw.text((right_x, curr_y), label, fill=(100, 110, 130, 255), font=font_body)
        draw.text((right_x + 105, curr_y), val, fill=(12, 6, 28, 255) if val != "Active" else (16, 185, 129, 255), font=font_body_bold)
        curr_y += 20
        
    draw.line([(40, 250), (card_width - 40, 250)], fill=(220, 225, 235, 255), width=1)
    
    draw.rectangle([40, 270, card_width - 40, 305], fill=(245, 247, 250, 255))
    draw.text((55, 280), "FEE BREAKDOWN & DETAILS", fill=(50, 60, 80, 255), font=font_section_h)
    draw.text((card_width - 150, 280), "AMOUNT (INR)", fill=(50, 60, 80, 255), font=font_section_h)
    
    if amount_paid_now is not None:
        fee_rows = [
            ("Total Course Fee (as agreed)", total_fee),
            ("Amount Paid (in this transaction)", amount_paid_now),
            ("Total Paid to Date", paid_fee),
            ("Balance Due (Outstanding)", balance_fee)
        ]
        total_paid_now = amount_paid_now
    else:
        fee_rows = [
            ("Total Course Fee (as agreed)", total_fee),
            ("Amount Paid (via UPI Gateway)", paid_fee),
            ("Balance Due (Outstanding)", balance_fee)
        ]
        total_paid_now = paid_fee
    
    row_y = 320
    for desc, amt in fee_rows:
        color = (12, 6, 28, 255)
        is_bold_row = "Balance" in desc or "Paid" in desc or "Total Paid" in desc
        if desc == "Balance Due (Outstanding)":
            color = (220, 38, 38, 255)
            
        draw.text((55, row_y + 10), desc, fill=color, font=font_body_bold if is_bold_row else font_body)
        amt_str = f"₹{amt:,.2f}"
        try:
            amt_w = draw.textbbox((0, 0), amt_str, font=font_body_bold if is_bold_row else font_body)[2]
        except AttributeError:
            amt_w, _ = draw.textsize(amt_str, font=font_body_bold if is_bold_row else font_body)
        draw.text((card_width - 55 - amt_w, row_y + 10), amt_str, fill=color, font=font_body_bold if is_bold_row else font_body)
        draw.line([(40, row_y + 35), (card_width - 40, row_y + 35)], fill=(235, 240, 245, 255), width=1)
        row_y += 40
        
    draw.rectangle([40, row_y + 10, card_width - 40, row_y + 60], fill=(124, 58, 237, 12), outline=(124, 58, 237, 40), width=1)
    draw.text((55, row_y + 24), "TOTAL PAID NOW", fill=(124, 58, 237, 255), font=font_total)
    
    total_paid_str = f"₹{total_paid_now:,.2f}"
    try:
        tot_w = draw.textbbox((0, 0), total_paid_str, font=font_total)[2]
    except AttributeError:
        tot_w, _ = draw.textsize(total_paid_str, font=font_total)
    draw.text((card_width - 55 - tot_w, row_y + 24), total_paid_str, fill=(124, 58, 237, 255), font=font_total)
    
    note_y = row_y + 90
    draw.rectangle([40, note_y, card_width - 40, note_y + 80], fill=(254, 243, 199, 255), outline=(252, 211, 77, 255), width=1)
    
    font_note_title = get_system_font(12, bold=True)
    font_note_body = get_system_font(11, bold=False)
    draw.text((55, note_y + 12), "IMPORTANT FEE POLICY NOTE:", fill=(180, 83, 9, 255), font=font_note_title)
    draw.text((55, note_y + 32), "1. This invoice is generated dynamically upon your transaction submission.", fill=(120, 53, 4, 255), font=font_note_body)
    draw.text((55, note_y + 50), "2. Note: Pay balance amount before one month.", fill=(220, 38, 38, 255), font=font_note_title)
    
    cx, cy = 60, note_y + 85
    draw.line([(cx, cy + 12), (cx + 8, cy + 20), (cx + 22, cy + 6)], fill=(16, 185, 129, 255), width=3)
    draw.text((40, note_y + 120), "Authorized Signatory", fill=(100, 110, 130, 255), font=font_body)
    draw.text((40, note_y + 135), "Algonex IT Solutions Private Limited", fill=(12, 6, 28, 255), font=font_body_bold)
    
    # Algonex Stamp Image
    stamp_path = os.path.join(os.path.dirname(__file__), "static", "Algonex Stamp.png")
    if os.path.exists(stamp_path):
        try:
            stamp_img = Image.open(stamp_path).convert("RGBA")
            stamp_size = (120, 120)
            try:
                resample_filter = Image.Resampling.LANCZOS
            except AttributeError:
                resample_filter = Image.ANTIALIAS
            stamp_img = stamp_img.resize(stamp_size, resample_filter)
            overlay.paste(stamp_img, (card_width - 160, note_y + 80), mask=stamp_img)
        except Exception as e:
            logger.warning(f"Could not load or paste stamp image: {e}")
            # Fallback to drawn seal if image loading fails
            draw.ellipse([card_width - 120, note_y + 95, card_width - 50, note_y + 165], outline=(124, 58, 237, 60), width=2)
            font_seal = get_system_font(8, bold=True)
            draw.text((card_width - 108, note_y + 125), "ALGONEX IT", fill=(124, 58, 237, 80), font=font_seal)
    else:
        # Fallback to drawn seal if file not found
        draw.ellipse([card_width - 120, note_y + 95, card_width - 50, note_y + 165], outline=(124, 58, 237, 60), width=2)
        font_seal = get_system_font(8, bold=True)
        draw.text((card_width - 108, note_y + 125), "ALGONEX IT", fill=(124, 58, 237, 80), font=font_seal)
    
    font_disclaimer = get_system_font(10, bold=False)
    disclaimer = "This is a computer-generated document and requires no physical signature."
    try:
        disc_w = draw.textbbox((0, 0), disclaimer, font=font_disclaimer)[2]
    except AttributeError:
        disc_w, _ = draw.textsize(disclaimer, font=font_disclaimer)
    draw.text(((card_width - disc_w) // 2, card_height - 35), disclaimer, fill=(150, 160, 175, 255), font=font_disclaimer)
    
    image = Image.alpha_composite(image, overlay)
    
    invoice_filename = f"invoice_{student_id}_{transaction_id}.png"
    output_path = os.path.join(invoices_dir, invoice_filename)
    image.save(output_path, "PNG")
    return output_path

def send_confirmation_email(
    to_email: str,
    student_name: str,
    student_id: str,
    course: str,
    batch_type: str,
    joining_date: str,
    card_path: str,
    password: str = None,
    invoice_path: str = None
) -> bool:
    """Sends a rich HTML email with the digital ID card attached using Django's core mail system."""
    try:
        subject = f"Welcome to Algonex! Your Student ID is {student_id}"
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@algonex.co.in')

        # HTML Body with Algonex Theme
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Algonex</title>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                    background-color: #0b0518;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #ffffff;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #18092d 0%, #0d031b 100%);
                    border: 2px solid #a855f7;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
                }}
                .header {{
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 20px;
                }}
                .brand {{
                    color: #a855f7;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    margin: 0;
                    text-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
                }}
                .subbrand {{
                    color: #06b6d4;
                    font-size: 12px;
                    letter-spacing: 4px;
                    margin: 5px 0 0 0;
                }}
                .content {{
                    padding: 20px 0;
                    line-height: 1.6;
                }}
                h2 {{
                    color: #06b6d4;
                    font-size: 20px;
                    margin-top: 0;
                }}
                .highlight-box {{
                    background: rgba(168, 85, 247, 0.1);
                    border: 1px solid rgba(168, 85, 247, 0.3);
                    border-left: 4px solid #a855f7;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .details-table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }}
                .details-table td {{
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }}
                .label {{
                    color: #9ca3af;
                    font-weight: bold;
                    width: 150px;
                }}
                .value {{
                    color: #ffffff;
                }}
                .status-badge {{
                    display: inline-block;
                    background-color: #064e3b;
                    color: #34d399;
                    border: 1px solid #059669;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 1px;
                }}
                .footer {{
                    text-align: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 20px;
                    font-size: 12px;
                    color: #6b7280;
                }}
                .btn {{
                    display: inline-block;
                    background: linear-gradient(90deg, #3b82f6 0%, #ec4899 100%);
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: bold;
                    margin: 15px 0;
                    box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
                }}
            </style>
        </head>
        <body>
            <div style="background-color: #05020a; padding: 20px;">
                <div class="container">
                    <div class="header">
                        <p class="brand">ALGONEX</p>
                        <p class="subbrand">IT SOLUTIONS</p>
                    </div>
                    <div class="content">
                        <h2>Congratulations, {student_name}!</h2>
                        <p>Your registration request with Algonex IT Solutions has been successfully received and recorded.</p>
                        
                        <div class="highlight-box">
                            <strong>Unique Student ID:</strong> <span style="font-size: 18px; color: #a855f7; font-weight: bold; font-family: monospace;">{student_id}</span><br>
                            <strong>Registration Status:</strong> <span class="status-badge">ACTIVE</span>
                            {f"<br><br><strong>Application Credentials:</strong><br>Email: <span style='color: #06b6d4; font-family: monospace;'>{to_email}</span><br>Password: <span style='color: #06b6d4; font-family: monospace;'>{password}</span>" if password else ""}
                        </div>
                        
                        <p>Our verification team will review your payment transaction ID and student details within the next 24 hours. Upon verification, you will receive your official onboarding link and course access credentials.</p>
                        
                        <h3>Registration Summary:</h3>
                        <table class="details-table">
                            <tr>
                                <td class="label">Course Track:</td>
                                <td class="value">{course}</td>
                            </tr>
                            <tr>
                                <td class="label">Batch Type:</td>
                                <td class="value">{batch_type}</td>
                            </tr>
                            <tr>
                                <td class="label">Joining Date:</td>
                                <td class="value">{joining_date}</td>
                            </tr>
                        </table>
                        
                        <p>We have generated your digital Student ID Card and Fee Invoice and attached them directly to this email for your reference.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://algonex.co.in/" class="btn">Explore Algonex Portal</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from Algonex IT Solutions.</p>
                        <p>&copy; 2026 Algonex IT Solutions. All rights reserved.</p>
                        <p>Website: <a href="https://algonex.co.in/" style="color: #06b6d4; text-decoration: none;">algonex.co.in</a> | Email: support@algonex.co.in</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        email = EmailMessage(
            subject=subject,
            body=html_content,
            from_email=from_email,
            to=[to_email]
        )
        email.content_subtype = "html"
        
        # Attach the ID Card
        if card_path and os.path.exists(card_path):
            with open(card_path, 'rb') as f:
                email.attach(os.path.basename(card_path), f.read(), 'image/png')
                
        # Attach the Invoice
        if invoice_path and os.path.exists(invoice_path):
            with open(invoice_path, 'rb') as f:
                email.attach(os.path.basename(invoice_path), f.read(), 'image/png')
                
        email.send(fail_silently=False)
        logger.info(f"Successfully sent registration email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {e}")
        return False


def send_payment_receipt_email(
    to_email: str,
    student_name: str,
    student_id: str,
    course: str,
    payment_amount: float,
    transaction_id: str,
    invoice_path: str
) -> bool:
    """Sends a rich HTML email with the payment receipt attached."""
    try:
        subject = f"Payment Receipt Confirmed - Algonex (Student ID: {student_id})"
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@algonex.co.in')

        # HTML Body with Algonex Theme
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Receipt - Algonex</title>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                    background-color: #0b0518;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #ffffff;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #18092d 0%, #0d031b 100%);
                    border: 2px solid #a855f7;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
                }}
                .header {{
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 20px;
                }}
                .brand {{
                    color: #a855f7;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    margin: 0;
                    text-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
                }}
                .subbrand {{
                    color: #06b6d4;
                    font-size: 12px;
                    letter-spacing: 4px;
                    margin: 5px 0 0 0;
                }}
                .content {{
                    padding: 20px 0;
                    line-height: 1.6;
                }}
                h2 {{
                    color: #06b6d4;
                    font-size: 20px;
                    margin-top: 0;
                }}
                .highlight-box {{
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-left: 4px solid #10b981;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .details-table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }}
                .details-table td {{
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }}
                .label {{
                    color: #9ca3af;
                    font-weight: bold;
                    width: 150px;
                }}
                .value {{
                    color: #ffffff;
                }}
                .status-badge {{
                    display: inline-block;
                    background-color: #064e3b;
                    color: #34d399;
                    border: 1px solid #059669;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 1px;
                }}
                .footer {{
                    text-align: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 20px;
                    font-size: 12px;
                    color: #6b7280;
                }}
                .btn {{
                    display: inline-block;
                    background: linear-gradient(90deg, #3b82f6 0%, #ec4899 100%);
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: bold;
                    margin: 15px 0;
                    box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
                }}
            </style>
        </head>
        <body>
            <div style="background-color: #05020a; padding: 20px;">
                <div class="container">
                    <div class="header">
                        <p class="brand">ALGONEX</p>
                        <p class="subbrand">IT SOLUTIONS</p>
                    </div>
                    <div class="content">
                        <h2>Thank you for your payment, {student_name}!</h2>
                        <p>We are pleased to inform you that your payment request has been verified and approved.</p>
                        
                        <div class="highlight-box">
                            <strong>Amount Paid:</strong> <span style="font-size: 18px; color: #10b981; font-weight: bold; font-family: monospace;">₹{payment_amount:,.2f}</span><br>
                            <strong>Transaction / UTR ID:</strong> <span style="font-size: 14px; color: #06b6d4; font-family: monospace;">{transaction_id}</span><br>
                            <strong>Payment Status:</strong> <span class="status-badge">APPROVED</span>
                        </div>
                        
                        <p>Your receipt is attached directly to this email. Your remaining balance and fee ledger have been updated automatically in your profile dashboard.</p>
                        
                        <h3>Payment Details:</h3>
                        <table class="details-table">
                            <tr>
                                <td class="label">Student ID:</td>
                                <td class="value" style="font-family: monospace;">{student_id}</td>
                            </tr>
                            <tr>
                                <td class="label">Course Track:</td>
                                <td class="value">{course}</td>
                            </tr>
                        </table>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://algonex.co.in/profile" class="btn">View Profile Dashboard</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from Algonex IT Solutions.</p>
                        <p>&copy; 2026 Algonex IT Solutions. All rights reserved.</p>
                        <p>Website: <a href="https://algonex.co.in/" style="color: #06b6d4; text-decoration: none;">algonex.co.in</a> | Email: support@algonex.co.in</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        email = EmailMessage(
            subject=subject,
            body=html_content,
            from_email=from_email,
            to=[to_email]
        )
        email.content_subtype = "html"
        
        # Attach the Invoice
        if invoice_path and os.path.exists(invoice_path):
            with open(invoice_path, 'rb') as f:
                email.attach(os.path.basename(invoice_path), f.read(), 'image/png')
                
        email.send(fail_silently=False)
        logger.info(f"Successfully sent payment receipt email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send payment receipt email: {e}")
        return False
