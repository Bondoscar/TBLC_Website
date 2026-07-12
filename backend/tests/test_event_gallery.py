from backend.models import EventCreate


def test_event_create_accepts_gallery_folder_id():
    payload = EventCreate(
        title="Community Day",
        date="Saturday, July 20",
        gallery_folder_id="abc123folder",
    )

    assert payload.gallery_folder_id == "abc123folder"
    assert payload.model_dump()["gallery_folder_id"] == "abc123folder"
