# Image Resources Guide

## Directory Structure

```
public/
└── resources/
    └── img/
        ├── hero-banner.jpg
        ├── worship.jpg
        ├── banner.jpg
        ├── events/
        │   ├── guest-speaker.jpg
        │   ├── small-group.jpg
        │   ├── child-dedication.jpg
        │   └── easter.jpg
        └── ministries/
            ├── kids.png
            ├── couples.jpg
            ├── teens.jpg
            ├── seniors.jpg
            ├── ladies.jpg
            ├── missions.jpg
            ├── worship.jpg
            └── care.jpg
```

## Usage

All images are managed through a centralized configuration in `src/data/images.js`. 

### How to Use Images in Components

```javascript
// Import the images configuration
import { images, getImageUrl } from '@/data/images';

// Use images in your components
<img 
  src={getImageUrl(images.hero, images.heroFallback)} 
  alt="Hero Banner"
/>

// Or for events
<img 
  src={getImageUrl(images.events.guestSpeaker, images.events.guestSpeakerFallback)} 
  alt="Guest Speaker Event"
/>

// Or for ministries
<img 
  src={getImageUrl(images.ministries.kids, images.ministries.kidsFallback)} 
  alt="Kids Ministry"
/>
```

## Adding New Images

1. **Add the image file** to the appropriate folder under `public/resources/img/`
2. **Update `src/data/images.js`** with the new image reference:
   ```javascript
   export const images = {
     // ... existing images
     newCategory: '/resources/img/new-image.jpg',
     newCategoryFallback: 'https://external-url.com/image.jpg',
   };
   ```
3. **Import and use** in your components as shown above

## Benefits

- **Centralized Management**: All images in one place for easy updates
- **Fallback Support**: Fallback to external URLs if local images aren't available
- **Consistency**: Ensures all components use the same image references
- **Easy Migration**: Simple to transition from external URLs to local assets
- **Path Consistency**: All image paths follow the same pattern via the configuration file

## Notes

- Images with fallback URLs will display the fallback if the local image is not found
- Organize images by category (events, ministries, etc.) for easy navigation
- Use the `@` path alias in imports (e.g., `@/data/images`)
