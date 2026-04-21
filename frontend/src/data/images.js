// Centralized image resources configuration
// All images are organized by category for easy management

export const images = {
  // Hero and banner images
  hero: '/resources/img/hero-banner.jpg',
  heroFallback: 'https://images.pexels.com/photos/34504326/pexels-photo-34504326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=1920',
  
  worship: '/resources/img/worship.jpg',
  worshipFallback: 'https://images.unsplash.com/photo-1521547418549-6a31aad7c177?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920',
  
  banner: '/resources/img/banner.jpg',
  bannerFallback: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&h=600&fit=crop&q=80',

  // Events
  events: {
    guestSpeaker: '/resources/img/events/guest-speaker.jpg',
    guestSpeakerFallback: 'https://static.wixstatic.com/media/78447e_dab6f75cd6bd45fdbd81c9558621efa9~mv2.jpg/v1/fill/w_432,h_243,q_90,enc_avif,quality_auto/78447e_dab6f75cd6bd45fdbd81c9558621efa9~mv2.jpg',
    
    smallGroup: '/resources/img/events/small-group.jpg',
    smallGroupFallback: 'https://static.wixstatic.com/media/78447e_7e96b4340d9f4d88aacee5df9115ca21~mv2.jpg/v1/fill/w_431,h_243,q_90,enc_avif,quality_auto/78447e_7e96b4340d9f4d88aacee5df9115ca21~mv2.jpg',
    
    childDedication: '/resources/img/events/child-dedication.jpg',
    childDedicationFallback: 'https://static.wixstatic.com/media/78447e_fd167b9fb7bd480089f449705bfbbdfc~mv2.jpg/v1/fill/w_411,h_232,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/78447e_fd167b9fb7bd480089f449705bfbbdfc~mv2.jpg',
    
    easter: '/resources/img/events/easter.jpg',
    easterFallback: 'https://static.wixstatic.com/media/78447e_397dde528b564b779ca41cd9013c67d8~mv2.jpg/v1/fill/w_788,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/78447e_397dde528b564b779ca41cd9013c67d8~mv2.jpg',
  },

  // Ministries
  ministries: {
    kids: '/resources/img/ministries/kids.png',
    kidsFallback: 'https://static.wixstatic.com/media/c1a9a3_dd54c8d3bffc4274be4fc48c0b4ee16e~mv2.png/v1/fill/w_304,h_112,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2019-BLC-Kids.png',
    
    couples: '/resources/img/ministries/couples.jpg',
    couplesFallback: 'https://static.wixstatic.com/media/c1a9a3_16a394f01ab94457a1e2c1ff4b6baae8~mv2_d_3456_5184_s_4_2.jpg/v1/crop/x_37,y_213,w_3410,h_3407/fill/w_330,h_328,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Holding%20Hands.jpg',
    
    teens: '/resources/img/ministries/teens.jpg',
    teensFallback: 'https://static.wixstatic.com/media/78447e_2a0d0f5d8a9b427a8255f75564666f4c~mv2.jpg/v1/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/311817732_466358452191940_7412875038704992251_n.jpg',
    
    seniors: '/resources/img/ministries/seniors.jpg',
    seniorsFallback: 'https://static.wixstatic.com/media/78447e_6a21298d435d4de8b6905939e44f0ceb~mv2.jpg/v1/crop/x_0,y_0,w_3453,h_3456/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0984%20(1)_JPG.jpg',
    
    ladies: '/resources/img/ministries/ladies.jpg',
    ladiesFallback: 'https://static.wixstatic.com/media/nsplsh_8cc83991a1144000a7fd0d852bc21f5a~mv2.jpg/v1/crop/x_1632,y_0,w_4019,h_4016/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Ben%20White.jpg',
    
    missions: '/resources/img/ministries/missions.jpg',
    missionsFallback: 'https://static.wixstatic.com/media/78447e_cf79aa78e9394d789cc69765f6e6ca6d~mv2.jpg/v1/crop/x_381,y_0,w_918,h_919/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/BLC-October%2006%2C%202019-3068.jpg',
    
    worship: '/resources/img/ministries/worship.jpg',
    worshipFallback: 'https://static.wixstatic.com/media/c1a9a3_a3a2e9f68a9147388e15b8c4f41eef33~mv2.jpg/v1/fill/w_330,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/music.jpg',
  },
};

/**
 * Helper function to get image with fallback
 * Prioritizes fallback URLs since local images may not be available in all environments.
 * This ensures images render reliably using external CDN sources.
 * @param {string} imagePath - The local image path (optional)
 * @param {string} fallbackUrl - The fallback external URL (primary)
 * @returns {string} The image URL to use
 */
export const getImageUrl = (imagePath, fallbackUrl) => {
  return fallbackUrl || imagePath;
};
