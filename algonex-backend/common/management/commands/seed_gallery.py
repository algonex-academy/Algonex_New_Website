import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings


# Gallery seed data: filename -> title
GALLERY_SEED = [
    {"file": "IMG_20260613_131327093_HDR_1.jpg", "title": "AWS Meetup"},
    {"file": "Scanned_20260523-1750-21.jpg", "title": "Nokia Event"},
    {"file": "IMG_20260627_173915.jpg", "title": "Gallery Image"},
    {"file": "IMG_20260627_180150.jpg", "title": "Gallery Image"},
    {"file": "Scanned_20260523-1750-04.jpg", "title": "Gallery Image"},
    {"file": "IMG_20260530_125225.jpg", "title": "Gallery Image"},
    {"file": "IMG_20260628_155008.jpg", "title": "Gallery Image"},
    {"file": "Screenshot_2026-07-03_182045.png", "title": "Gallery Image"},
    {"file": "Screenshot_2026-07-03_181830.png", "title": "Gallery Image"},
]


class Command(BaseCommand):
    help = "Seed gallery images from fixtures/gallery_seed/ into the database and media folder"

    def handle(self, *args, **options):
        from common.models import Gallery

        seed_dir = os.path.join(settings.BASE_DIR, "fixtures", "gallery_seed")
        media_uploads = os.path.join(settings.MEDIA_ROOT, "uploads")

        if not os.path.exists(seed_dir):
            self.stdout.write(self.style.ERROR(
                f"Seed directory not found: {seed_dir}"
            ))
            return

        os.makedirs(media_uploads, exist_ok=True)

        count = 0
        for item in GALLERY_SEED:
            src = os.path.join(seed_dir, item["file"])
            if not os.path.exists(src):
                self.stdout.write(self.style.WARNING(f"  Skipping missing file: {item['file']}"))
                continue

            # Copy to media/uploads/
            dst = os.path.join(media_uploads, item["file"])
            if not os.path.exists(dst):
                shutil.copy2(src, dst)

            # Check if this image already exists in database using get_or_create
            db_path = f"uploads/{item['file']}"
            gallery_item, created = Gallery.objects.get_or_create(
                image=db_path,
                defaults={"title": item["title"]}
            )
            if created:
                count += 1
                self.stdout.write(f"  + Added: {item['title']} ({item['file']})")
            else:
                self.stdout.write(f"  - Already exists: {item['title']} ({item['file']})")

        self.stdout.write(self.style.SUCCESS(f"\nSeeded {count} new gallery images."))
