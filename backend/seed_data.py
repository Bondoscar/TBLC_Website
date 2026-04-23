"""Seed data — mirrors the original `frontend/src/data/mock.js` content.

Runs idempotently: if a collection already has documents, it is skipped.
Call `await seed_if_empty(db)` at app startup, or POST /api/admin/seed to
(re-)run it manually.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List

from drive_utils import to_direct_file_url, to_direct_image_url

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Initial mock data (copied from frontend/src/data/mock.js + images.js)
# ---------------------------------------------------------------------------
INITIAL_EVENTS: List[Dict[str, Any]] = [
    {
        "title": "Guest Speaker - Barron Longstreth",
        "date": "Sunday, April 19",
        "time": "10AM",
        "description": "Join us for a special Sunday morning with Barron Longstreth as our guest speaker.",
        "image_url": "https://static.wixstatic.com/media/78447e_dab6f75cd6bd45fdbd81c9558621efa9~mv2.jpg/v1/fill/w_432,h_243,q_90,enc_avif,quality_auto/78447e_dab6f75cd6bd45fdbd81c9558621efa9~mv2.jpg",
        "order": 1,
        "published": True,
    },
    {
        "title": "TBLC - A Small Group For New Believers",
        "date": "April 19, 26, May 3",
        "time": "Sunday Mornings",
        "description": "A small group session designed for new believers to grow in faith and community.",
        "image_url": "https://static.wixstatic.com/media/78447e_7e96b4340d9f4d88aacee5df9115ca21~mv2.jpg/v1/fill/w_431,h_243,q_90,enc_avif,quality_auto/78447e_7e96b4340d9f4d88aacee5df9115ca21~mv2.jpg",
        "order": 2,
        "published": True,
    },
]

INITIAL_MINISTRIES: List[Dict[str, Any]] = [
    {
        "slug": "kids",
        "title": "Kids",
        "image_url": "https://static.wixstatic.com/media/c1a9a3_dd54c8d3bffc4274be4fc48c0b4ee16e~mv2.png/v1/fill/w_304,h_112,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2019-BLC-Kids.png",
        "description": "Sunday School begins each week at 10:00. Our check-in station on the main level opens at 9:30, and here you can check your child into the appropriate class. Your kids will love this time each week in their themed class, where they will learn about the Bible in an age-appropriate and fun way! Kids Club is held on Wednesday evenings during Bible Study from 7:00 - 8:30. This large group session for elementary-age children involves skits, Bible lessons, games, and more! Our Nursery is available during all midweek and weekend services.",
        "order": 1,
        "published": True,
    },
    {
        "slug": "couples",
        "title": "Couples",
        "image_url": "https://static.wixstatic.com/media/c1a9a3_16a394f01ab94457a1e2c1ff4b6baae8~mv2_d_3456_5184_s_4_2.jpg/v1/crop/x_37,y_213,w_3410,h_3407/fill/w_330,h_328,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Holding%20Hands.jpg",
        "description": 'Our Couples Ministry is so designated to provide the most specific ministry attention possible to people in this stage of life. The Couples Ministry includes those couples from "nearly-weds" and newlyweds to married adults. Special programs and activities include Home Improvement seminars, banquets (Valentine and others), quarterly activities and fellowships, and various other marriage conferences and seminars. Blended families will feel at home and welcome at The Better Life Church.',
        "order": 2,
        "published": True,
    },
    {
        "slug": "teens",
        "title": "Teens",
        "image_url": "https://static.wixstatic.com/media/78447e_2a0d0f5d8a9b427a8255f75564666f4c~mv2.jpg/v1/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/311817732_466358452191940_7412875038704992251_n.jpg",
        "description": "The Better Life Church Youth is a vibrant and growing department that provides powerful and Christ-centered ministry to youth from ages twelve and up. This ministry offers exciting activities, live music, missions opportunities, and special events throughout the year. The Better Life Church Youth service is held each Wednesday at 7:00pm.",
        "order": 3,
        "published": True,
    },
    {
        "slug": "seniors",
        "title": "Seniors",
        "image_url": "https://static.wixstatic.com/media/78447e_6a21298d435d4de8b6905939e44f0ceb~mv2.jpg/v1/crop/x_0,y_0,w_3453,h_3456/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0984%20(1)_JPG.jpg",
        "description": 'At The Better Life Church, we are blessed with the wisdom and experience of many veteran saints. Our Seniors play a vital role in the ministry of this church; rather than just being retired, they get "re-fired" up for Jesus! This dynamic ministry, called the "KeenAgers" includes all those who are 50 years of age or older. Activities include bus tours, bowling, boat rides, and pot-luck suppers.',
        "order": 4,
        "published": True,
    },
    {
        "slug": "ladies",
        "title": "Ladies",
        "image_url": "https://static.wixstatic.com/media/nsplsh_8cc83991a1144000a7fd0d852bc21f5a~mv2.jpg/v1/crop/x_1632,y_0,w_4019,h_4016/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Ben%20White.jpg",
        "description": "We host regular ladies events throughout the year! From tea parties and retreats to conferences and fellowship evenings, our Ladies Ministry offers a warm community for women to connect, grow, and be encouraged in their walk with Christ.",
        "order": 5,
        "published": True,
    },
    {
        "slug": "missions",
        "title": "Missions & Multi-Cultural",
        "image_url": "https://static.wixstatic.com/media/78447e_cf79aa78e9394d789cc69765f6e6ca6d~mv2.jpg/v1/crop/x_381,y_0,w_918,h_919/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/BLC-October%2006%2C%202019-3068.jpg",
        "description": "We love that we are a multi-cultural church and welcome every nation and culture to worship with us! We hold weekly English language and IELTS prep classes to help those new to arriving in our community. Our congregation is among the top churches in Canada for missions giving, supporting over 110 foreign missionary endeavors as well as home missionaries in Canada.",
        "order": 6,
        "published": True,
    },
    {
        "slug": "worship",
        "title": "Worship & Music",
        "image_url": "https://static.wixstatic.com/media/c1a9a3_a3a2e9f68a9147388e15b8c4f41eef33~mv2.jpg/v1/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/music.jpg",
        "description": "The Music Ministry of The Better Life Church encompasses all ages through annual events, including a Christmas musical and an Easter concert. They also enjoy being involved in community events, such as the Remembrance Day Services, Christmas Tree lighting and more. The mission of the music department is to escort God's presence into our services through worship by His people.",
        "order": 7,
        "published": True,
    },
    {
        "slug": "care",
        "title": "Compassionate Care",
        "image_url": "",
        "description": "Our Care Ministries here at The Better Life Church view the challenging circumstances of life as opportunities to step out and share the love and truth of Jesus Christ in our community. From baskets and flowers to those in the hospital to our Christmas food distribution programs, our Compassion Ministries have always had a heart for the needy.",
        "order": 8,
        "published": True,
    },
]

INITIAL_SERMONS: List[Dict[str, Any]] = [
    {"title": "The House", "speaker": "Barron Longstreth", "duration": "41:10", "youtube_id": "n2Os6jgp8oI", "order": 1, "published": True},
    {"title": "Remember Him", "speaker": "Rayna Longstreth", "duration": "21:04", "youtube_id": "dmCN4uz7IMk", "order": 2, "published": True},
    {"title": "You Are So Valuable", "speaker": "Harold Linder", "duration": "29:51", "youtube_id": "QB1kD5qFhRY", "order": 3, "published": True},
    {"title": "Living & Giving By Faith", "speaker": "Harold Linder", "duration": "43:43", "youtube_id": "nDa3EbG9Bkk", "order": 4, "published": True},
    {"title": "Let's Go Fishing", "speaker": "Harold Linder", "duration": "39:54", "youtube_id": "CLZSJqaqXhw", "order": 5, "published": True},
    {"title": "Jehoiada Must Live", "speaker": "Pastor Matthew Woodward", "duration": "45:39", "youtube_id": "HvDrLoSilLM", "order": 6, "published": True},
    {"title": "There is Victory by the blood of Jesus Christ!", "speaker": "BLC", "duration": "00:47", "youtube_id": "vKV-ZnqrubY", "order": 7, "published": True},
    {"title": "He paid the price, for us!", "speaker": "TBLC", "duration": "00:53", "youtube_id": "DpUmzQaWf4M", "order": 8, "published": True},
    {"title": "All my sins are washed away", "speaker": "TBLC", "duration": "00:54", "youtube_id": "uVPWdiwrMTI", "order": 9, "published": True},
]

INITIAL_PASTORS: List[Dict[str, Any]] = [
    {
        "name": "Pastor Matthew Woodward",
        "role": "Senior Pastor",
        "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "order": 1,
        "published": True,
    },
    {
        "name": "Pastor Rayna Longstreth",
        "role": "Associate Pastor",
        "image_url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "order": 2,
        "published": True,
    },
    {
        "name": "Pastor Barron Longstreth",
        "role": "Youth Pastor",
        "image_url": "https://images.pexels.com/photos/10657877/pexels-photo-10657877.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=650",
        "order": 3,
        "published": True,
    },
]

INITIAL_NEWSLETTERS: List[Dict[str, Any]] = [
    {"month": m, "file_url": "", "order": i + 1, "published": True}
    for i, m in enumerate(
        [
            "April 2026", "March 2026", "February 2026", "January 2026",
            "December 2025", "November 2025", "October 2025", "September 2025",
            "August 2025", "July 2025", "June 2025", "May 2025",
            "April 2025", "March 2025", "February 2025", "January 2025",
        ]
    )
]

INITIAL_SETTINGS: Dict[str, Dict[str, Any]] = {
    "church_info": {
        "address": "527 Queen St, Fredericton, NB E3B 1B8",
        "phone": "(506) 304-1107",
        "email": "Info@thebetterlifechurch.ca",
        "sunday_service": "10:00 AM",
        "bible_study": "Wednesday 7:00 PM",
        "prayer": "Friday 7:00 PM",
    },
    "social_links": {
        "facebook": "https://www.facebook.com/tblccanada/",
        "instagram": "https://www.instagram.com/tblccanada/",
        "youtube": "https://www.youtube.com/@tblccanada",
        "map": "https://share.google/YBiYbqUp1c0OSFojq",
        "podcast": "",
    },
    "about_content": {
        "hero": "Our church is your church.",
        "intro": "The Better Life Church is a progressive, visionary congregation with a passion for real spirituality, a love for family, a heart for community, and a zest for life. We've ministered to families for over thirty years, helping people discover the abundant life Jesus came to give.",
        "mission": "To know Christ and make Him known throughout our community and around the world.",
        "vision": "To be a loving family of believers who reach people with the gospel, grow together in discipleship, and go out in service to our community and beyond.",
        "beliefs": [
            "We believe in one God — Father, Son, and Holy Spirit.",
            "We believe the Bible is the inspired, infallible Word of God.",
            "We believe salvation is by grace through faith in Jesus Christ.",
            "We believe in the baptism of the Holy Spirit and the gifts of the Spirit.",
            "We believe in the second coming of Jesus Christ.",
        ],
    },
    "site_images": {
        "hero": "https://images.pexels.com/photos/34504326/pexels-photo-34504326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=1920",
        "worship": "https://images.unsplash.com/photo-1521547418549-6a31aad7c177?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920",
        "banner": "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&h=600&fit=crop&q=80",
    },
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _enrich_image(doc: Dict[str, Any], key: str = "image_url") -> Dict[str, Any]:
    doc = dict(doc)
    direct_key = key.replace("_url", "_direct_url")
    doc[direct_key] = to_direct_image_url(doc.get(key, ""))
    return doc


def _enrich_file(doc: Dict[str, Any], key: str = "file_url") -> Dict[str, Any]:
    doc = dict(doc)
    direct_key = key.replace("_url", "_direct_url")
    doc[direct_key] = to_direct_file_url(doc.get(key, ""))
    return doc


async def seed_if_empty(db) -> Dict[str, int]:
    """Seed empty collections. Returns count inserted per collection."""
    inserted = {
        "events": 0,
        "ministries": 0,
        "sermons": 0,
        "pastors": 0,
        "newsletters": 0,
        "site_settings": 0,
    }

    import uuid

    # events
    if await db.events.count_documents({}) == 0:
        docs = [
            {
                **_enrich_image(e),
                "id": str(uuid.uuid4()),
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            }
            for e in INITIAL_EVENTS
        ]
        if docs:
            await db.events.insert_many(docs)
            inserted["events"] = len(docs)

    # ministries
    if await db.ministries.count_documents({}) == 0:
        docs = [
            {
                **_enrich_image(m),
                "id": str(uuid.uuid4()),
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            }
            for m in INITIAL_MINISTRIES
        ]
        if docs:
            await db.ministries.insert_many(docs)
            inserted["ministries"] = len(docs)

    # sermons
    if await db.sermons.count_documents({}) == 0:
        docs = [
            {
                **s,
                "id": str(uuid.uuid4()),
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            }
            for s in INITIAL_SERMONS
        ]
        if docs:
            await db.sermons.insert_many(docs)
            inserted["sermons"] = len(docs)

    # pastors
    if await db.pastors.count_documents({}) == 0:
        docs = [
            {
                **_enrich_image(p),
                "id": str(uuid.uuid4()),
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            }
            for p in INITIAL_PASTORS
        ]
        if docs:
            await db.pastors.insert_many(docs)
            inserted["pastors"] = len(docs)

    # newsletters
    if await db.newsletters.count_documents({}) == 0:
        docs = [
            {
                **_enrich_file(n),
                "id": str(uuid.uuid4()),
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            }
            for n in INITIAL_NEWSLETTERS
        ]
        if docs:
            await db.newsletters.insert_many(docs)
            inserted["newsletters"] = len(docs)

    # site_settings (singleton docs keyed by `key`)
    for key, value in INITIAL_SETTINGS.items():
        existing = await db.site_settings.find_one({"key": key})
        if not existing:
            doc: Dict[str, Any] = {
                "key": key,
                "value": value,
                "updated_at": _now_iso(),
            }
            if key == "site_images":
                doc["value"] = {
                    **value,
                    "hero_direct": to_direct_image_url(value.get("hero", "")),
                    "worship_direct": to_direct_image_url(value.get("worship", "")),
                    "banner_direct": to_direct_image_url(value.get("banner", "")),
                }
            await db.site_settings.insert_one(doc)
            inserted["site_settings"] += 1

    logger.info("Seeded site resources: %s", inserted)
    return inserted
