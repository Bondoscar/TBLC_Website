// Mock data for The Better Life Church clone
import { images, getImageUrl } from './images';

export const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  // { name: 'MINISTRIES', path: '/ministries' },
  { name: 'MEDIA', path: '/media' },
  { name: 'EVENTS', path: '/events' },
  { name: 'DONATE', path: '/Donate' },
  // { name: 'RESOURCES', path: '/resources' },
];

export const socialLinks = {
  facebook: 'https://www.facebook.com/tblccanada/',
  instagram: 'https://www.instagram.com/tblccanada/',
  youtube: 'https://www.youtube.com/@tblccanada',
  map: 'https://share.google/YBiYbqUp1c0OSFojq',  
};

export const heroImage = getImageUrl(images.hero, images.heroFallback);

export const worshipImage = getImageUrl(images.worship, images.worshipFallback);

export const bannerImage = getImageUrl(images.banner, images.bannerFallback);

export const upcomingEvents = [
  {
    id: 1,
    title: 'Guest Speaker - Barron Longstreth',
    date: 'Sunday, April 19',
    time: '10AM',
    image: getImageUrl(images.events.guestSpeaker, images.events.guestSpeakerFallback),
    description: 'Join us for a special Sunday morning with Barron Longstreth as our guest speaker.',
  },
  {
    id: 2,
    title: 'TBLC - A Small Group For New Believers',
    date: 'April 19, 26, May 3',
    time: 'Sunday Mornings',
    image: getImageUrl(images.events.smallGroup, images.events.smallGroupFallback),
    description: 'A small group session designed for new believers to grow in faith and community.',
  },
  // {
  //   id: 3,
  //   title: 'Child & Baby Dedication',
  //   date: 'Sunday, May 10',
  //   time: '10AM',
  //   image: getImageUrl(images.events.childDedication, images.events.childDedicationFallback),
  //   description: 'Dedicate your children to the Lord in a beautiful ceremony with our church family.',
  // },
  // {
  //   id: 4,
  //   title: 'Easter Sunday Celebration',
  //   date: 'Sunday, April 21',
  //   time: '11AM',
  //   image: getImageUrl(images.events.easter, images.events.easterFallback),
  //   description: 'Celebrate the resurrection of Jesus with our church family in a powerful Easter service.',
  // },
];

export const ministries = [
  {
    id: 'kids',
    title: 'Kids',
    image: getImageUrl(images.ministries.kids, images.ministries.kidsFallback),
    description: 'Sunday School begins each week at 10:00. Our check-in station on the main level opens at 9:30, and here you can check your child into the appropriate class. Your kids will love this time each week in their themed class, where they will learn about the Bible in an age-appropriate and fun way! Kids Club is held on Wednesday evenings during Bible Study from 7:00 - 8:30. This large group session for elementary-age children involves skits, Bible lessons, games, and more! Our Nursery is available during all midweek and weekend services.',
  },
  {
    id: 'couples',
    title: 'Couples',
    image: getImageUrl(images.ministries.couples, images.ministries.couplesFallback),
    description: 'Our Couples Ministry is so designated to provide the most specific ministry attention possible to people in this stage of life. The Couples Ministry includes those couples from "nearly-weds" and newlyweds to married adults. Special programs and activities include Home Improvement seminars, banquets (Valentine and others), quarterly activities and fellowships, and various other marriage conferences and seminars. Blended families will feel at home and welcome at The Better Life Church.',
  },
  {
    id: 'teens',
    title: 'Teens',
    image: getImageUrl(images.ministries.teens, images.ministries.teensFallback),
    description: 'The Better Life Church Youth is a vibrant and growing department that provides powerful and Christ-centered ministry to youth from ages twelve and up. This ministry offers exciting activities, live music, missions opportunities, and special events throughout the year. The Better Life Church Youth service is held each Wednesday at 7:00pm.',
  },
  {
    id: 'seniors',
    title: 'Seniors',
    image: getImageUrl(images.ministries.seniors, images.ministries.seniorsFallback),
    description: 'At The Better Life Church, we are blessed with the wisdom and experience of many veteran saints. Our Seniors play a vital role in the ministry of this church; rather than just being retired, they get "re-fired" up for Jesus! This dynamic ministry, called the "KeenAgers" includes all those who are 50 years of age or older. Activities include bus tours, bowling, boat rides, and pot-luck suppers.',
  },
  {
    id: 'ladies',
    title: 'Ladies',
    image: getImageUrl(images.ministries.ladies, images.ministries.ladiesFallback),
    description: 'We host regular ladies events throughout the year! From tea parties and retreats to conferences and fellowship evenings, our Ladies Ministry offers a warm community for women to connect, grow, and be encouraged in their walk with Christ.',
  },
  {
    id: 'missions',
    title: 'Missions & Multi-Cultural',
    image: getImageUrl(images.ministries.missions, images.ministries.missionsFallback),
    description: 'We love that we are a multi-cultural church and welcome every nation and culture to worship with us! We hold weekly English language and IELTS prep classes to help those new to arriving in our community. Our congregation is among the top churches in Canada for missions giving, supporting over 110 foreign missionary endeavors as well as home missionaries in Canada.',
  },
  {
    id: 'worship',
    title: 'Worship & Music',
    image: getImageUrl(images.ministries.worship, images.ministries.worshipFallback),
    description: 'The Music Ministry of The Better Life Church encompasses all ages through annual events, including a Christmas musical and an Easter concert. They also enjoy being involved in community events, such as the Remembrance Day Services, Christmas Tree lighting and more. The mission of the music department is to escort God\'s presence into our services through worship by His people.',
  },
  {
    id: 'care',
    title: 'Compassionate Care',
    image: '/resources/img/ministries/care.jpg',
    description: 'Our Care Ministries here at The Better Life Church view the challenging circumstances of life as opportunities to step out and share the love and truth of Jesus Christ in our community. From baskets and flowers to those in the hospital to our Christmas food distribution programs, our Compassion Ministries have always had a heart for the needy.',
  },
];

export const sermons = [
  { id: 1, title: 'The House', speaker: 'Barron Longstreth', duration: '41:10', youtubeId: 'n2Os6jgp8oI' },
  { id: 2, title: 'Remember Him', speaker: 'Rayna Longstreth', duration: '21:04', youtubeId: 'dmCN4uz7IMk' },
  { id: 3, title: 'You Are So Valuable', speaker: 'Harold Linder', duration: '29:51', youtubeId: 'QB1kD5qFhRY' },
  { id: 4, title: 'Living & Giving By Faith', speaker: 'Harold Linder', duration: '43:43', youtubeId: 'nDa3EbG9Bkk' },
  { id: 5, title: 'Let\'s Go Fishing', speaker: 'Harold Linder', duration: '39:54', youtubeId: 'CLZSJqaqXhw' },
  { id: 6, title: 'Jehoiada Must Live', speaker: 'Pastor Matthew Woodward', duration: '45:39', youtubeId: 'HvDrLoSilLM' },
  { id: 7, title: 'There is Victory by the blood of Jesus Christ!', speaker: 'BLC', duration: '00:47', youtubeId: 'vKV-ZnqrubY' },
  { id: 8, title: 'He paid the price, for us!', speaker: 'TBLC', duration: '00:53', youtubeId: 'DpUmzQaWf4M' },
  { id: 9, title: 'All my sins are washed away', speaker: 'TBLC', duration: '00:54', youtubeId: 'uVPWdiwrMTI' },
];

export const aboutContent = {
  hero: 'Our church is your church.',
  intro: 'The Better Life Church is a progressive, visionary congregation with a passion for real spirituality, a love for family, a heart for community, and a zest for life. We\'ve ministered to families for over thirty years, helping people discover the abundant life Jesus came to give.',
  mission: 'To know Christ and make Him known throughout our community and around the world.',
  vision: 'To be a loving family of believers who reach people with the gospel, grow together in discipleship, and go out in service to our community and beyond.',
  beliefs: [
    'We believe in one God — Father, Son, and Holy Spirit.',
    'We believe the Bible is the inspired, infallible Word of God.',
    'We believe salvation is by grace through faith in Jesus Christ.',
    'We believe in the baptism of the Holy Spirit and the gifts of the Spirit.',
    'We believe in the second coming of Jesus Christ.',
  ],
  pastors: [
    { name: 'Pastor Matthew Woodward', role: 'Senior Pastor', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85&w=600' },
    { name: 'Pastor Rayna Longstreth', role: 'Associate Pastor', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=600' },
    { name: 'Pastor Barron Longstreth', role: 'Youth Pastor', image: 'https://images.pexels.com/photos/10657877/pexels-photo-10657877.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=650' },
  ],
};

export const newsletters = [
  { month: 'April 2026', url: '#' },
  { month: 'March 2026', url: '#' },
  { month: 'February 2026', url: '#' },
  { month: 'January 2026', url: '#' },
  { month: 'December 2025', url: '#' },
  { month: 'November 2025', url: '#' },
  { month: 'October 2025', url: '#' },
  { month: 'September 2025', url: '#' },
  { month: 'August 2025', url: '#' },
  { month: 'July 2025', url: '#' },
  { month: 'June 2025', url: '#' },
  { month: 'May 2025', url: '#' },
  { month: 'April 2025', url: '#' },
  { month: 'March 2025', url: '#' },
  { month: 'February 2025', url: '#' },
  { month: 'January 2025', url: '#' },
];

export const churchInfo = {
  address: '527 Queen St, Fredericton, NB E3B 1B8',
  phone: '(506) 304-1107',
  email: 'Info@thebetterlifechurch.ca',
  sundayService: '10:00 AM',
  bibleStudy: 'Wednesday 7:00 PM',
  prayer: 'Friday 7:00 PM',
};
