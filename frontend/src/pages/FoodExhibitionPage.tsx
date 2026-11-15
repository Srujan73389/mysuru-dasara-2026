import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';

interface FoodItem {
  id: string;
  name: string;
  nameKn: string;
  category: 'sweet' | 'tiffin' | 'thali' | 'coastal' | 'beverage';
  origin: string;
  originKn: string;
  desc: string;
  descKn: string;
  price: string;
  priceNum: number;
  tag: string;
  spiceLevel: 'None' | 'Mild' | 'Medium' | 'Spicy';
  isVeg: boolean;
  stallNumber: string;
  icon: string;
}

interface StallItem {
  id: string;
  name: string;
  nameKn: string;
  category: 'silk' | 'craft' | 'metal' | 'forest' | 'spice';
  hall: string;
  hallKn: string;
  desc: string;
  descKn: string;
  origin: string;
  heritageStatus: string;
  icon: string;
}

const ALL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'pak',
    name: 'Original Mysore Pak',
    nameKn: 'ಅಸಲಿ ಮೈಸೂರು ಪಾಕ್',
    category: 'sweet',
    origin: 'Guru Sweets (Royal Palace Kitchen Legacy)',
    originKn: 'ಗುರು ಸ್ವೀಟ್ಸ್ (ಅರಮನೆ ಪಾಕಶಾಲೆ ಪರಂಪರೆ)',
    desc: 'Invented in the royal kitchens of Krishnaraja Wadiyar IV by chef Kakasura Madappa. Made exclusively with pure desi ghee, gram flour, and cardamom sugar syrup with a melt-in-mouth honeycomb texture.',
    descKn: 'ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ ಕಾಲದಲ್ಲಿ ಅರಮನೆಯ ಮುಖ್ಯ ಅಡುಗೆಯವರಾದ ಕಾಕಾಸುರ ಮಾದಪ್ಪನವರಿಂದ ಸೃಷ್ಟಿಯಾದ ಜಗತ್ಪ್ರಸಿದ್ಧ ಸಿಹಿ. ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ, ಕಡಲೆಹಿಟ್ಟು ಮತ್ತು ಏಲಕ್ಕಿ ಸಕ್ಕರೆ ಪಾಕದ ಸಮ್ಮಿಲನ.',
    price: '₹140 / 250g box',
    priceNum: 140,
    tag: 'Royal Heritage',
    spiceLevel: 'None',
    isVeg: true,
    stallNumber: 'Food Pavilion Stall A-04',
    icon: '🧈',
  },
  {
    id: 'dosa',
    name: 'Mysore Masala Dosa',
    nameKn: 'ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ',
    category: 'tiffin',
    origin: 'Mylari & Heritage Darshinis, Nazarbad',
    originKn: 'ಮೈಲಾರಿ ಹಾಗೂ ಹೆರಿಟೇಜ್ ದರ್ಶಿನಿಗಳು, ನಜರ್‌ಬಾದ್',
    desc: 'Crispy golden crepe smeared with signature red chilli-garlic chutney (kempu chutney), filled with spiced potato palya, and generously topped with white butter (benne).',
    descKn: 'ಹೊರಗೆ ಗರಿಗರಿ, ಒಳಗೆ ಮೃದುವಾದ ಕೆಂಪು ಚಟ್ನಿ ಲೇಪಿತ ಮೈಸೂರು ಸ್ಪೆಷಲ್ ಮಸಾಲ ದೋಸೆ. ಜೊತೆಗೆ ರುಚಿಕರ ಆಲೂಗಡ್ಡೆ ಪಲ್ಯ ಮತ್ತು ತಾಜಾ ಬಿಳಿ ಬೆಣ್ಣೆ.',
    price: '₹75 per plate',
    priceNum: 75,
    tag: 'Iconic Tiffin',
    spiceLevel: 'Medium',
    isVeg: true,
    stallNumber: 'Food Pavilion Stall A-01',
    icon: '🥞',
  },
  {
    id: 'vada',
    name: 'Maddur Vada',
    nameKn: 'ಗರಿಗರಿ ಮದ್ದೂರು ವಡೆ',
    category: 'tiffin',
    origin: 'Old Mysore Railway Heritage, Maddur',
    originKn: 'ಮದ್ದೂರು ರೈಲ್ವೆ ಪರಂಪರೆ',
    desc: 'Crunchy savory fritter made from semolina (rava), rice flour, finely sliced onions, curry leaves, ginger, and green chillies, fried to deep amber perfection.',
    descKn: 'ರವ, ಅಕ್ಕಿಹಿಟ್ಟು, ಹೆಚ್ಚಿದ ಈರುಳ್ಳಿ, ಕರಿಬೇವು ಮತ್ತು ಹಸಿಮೆಣಸಿನಕಾಯಿಯ ಗರಿಗರಿಯಾದ ಮದ್ದೂರು ವಡೆ. ಮೈಸೂರು ಹೆದ್ದಾರಿಯ ಜನಪ್ರಿಯ ಸಂಜೆಯ ತಿಂಡಿ.',
    price: '₹35 / pair',
    priceNum: 35,
    tag: 'Highway Legend',
    spiceLevel: 'Mild',
    isVeg: true,
    stallNumber: 'Food Pavilion Stall B-02',
    icon: '🧆',
  },
  {
    id: 'rotti',
    name: 'North Karnataka Jolada Rotti Oota',
    nameKn: 'ಉತ್ತರ ಕರ್ನಾಟಕದ ಜೋಳದ ರೊಟ್ಟಿ ಊಟ',
    category: 'thali',
    origin: 'Hubballi-Dharwad & Vijayapura Stalls',
    originKn: 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಮತ್ತು ವಿಜಯಪುರ ಮಳಿಗೆ',
    desc: 'Wholesome unleavened sorghum flatbread served with stuffed baby brinjal gravy (Badanekayi Yennegai), shenga (peanut) chutney pudi, sprouts palya, and fresh churned curd.',
    descKn: 'ಬಿಸಿಬಿಸಿ ಜೋಳದ ರೊಟ್ಟಿ, ಬದನೆಕಾಯಿ ಎಣ್ಣೆಗಾಯಿ ಪಲ್ಯ, ಶೇಂಗಾ ಚಟ್ನಿ ಪುಡಿ, ಮೊಳಕೆ ಕಾಳು ಪಲ್ಯ ಮತ್ತು ತಾಜಾ ಮೊಸರಿನ ಸಮೃದ್ಧ ಪೌಷ್ಟಿಕ ಊಟ.',
    price: '₹130 complete plate',
    priceNum: 130,
    tag: 'Traditional Thali',
    spiceLevel: 'Spicy',
    isVeg: true,
    stallNumber: 'North Karnataka Zone C-05',
    icon: '🫓',
  },
  {
    id: 'bisibele',
    name: 'Royal Palace Bisi Bele Bath',
    nameKn: 'ಬಿಸಿ ಬಿಸಿ ಬೇಳೆ ಬಾತ್ (ತುಪ್ಪದ ಒಗ್ಗರಣೆ)',
    category: 'tiffin',
    origin: 'Mysore Palace Durbar Kitchen Recipe',
    originKn: 'ಮೈಸೂರು ಅರಮನೆ ಆಸ್ಥಾನ ಪಾಕವಿಧಾನ',
    desc: 'Aromatic one-pot delicacy of rice, toor dal, assorted vegetables, and 16 dry spices slow-cooked together and finished with copious ghee and fried cashews.',
    descKn: 'ಅಕ್ಕಿ, ತೊಗರಿಬೇಳೆ, ತರಕಾರಿಗಳು ಮತ್ತು ೧೬ ಸಂಬಾರ ಪದಾರ್ಥಗಳಿಂದ ಸಿದ್ಧಪಡಿಸಿದ ಅಧಿಕೃತ ಮೈಸೂರು ಬಿಸಿಬೇಳೆಬಾತ್. ಮೇಲೆ ಕಾದ ಹಸುವಿನ ತುಪ್ಪ ಮತ್ತು ಗೋಡಂಬಿ ಒಗ್ಗರಣೆ.',
    price: '₹85 per bowl',
    priceNum: 85,
    tag: 'Royal Recipe',
    spiceLevel: 'Medium',
    isVeg: true,
    stallNumber: 'Food Pavilion Stall A-08',
    icon: '🍲',
  },
  {
    id: 'dharwad-peda',
    name: 'GI-Tagged Dharwad Peda',
    nameKn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ಧಾರವಾಡ ಪೇಡ',
    category: 'sweet',
    origin: 'Line Bazaar, Dharwad Heritage',
    originKn: 'ಲೈನ್ ಬಜಾರ್, ಧಾರವಾಡ',
    desc: 'Caramelized slow-simmered milk khoa sweet created by the Thakur family in the 19th century. Dusted with fine castor sugar, boasting an intensely nutty flavor.',
    descKn: 'ಧಾರವಾಡದ ಲೈನ್ ಬಜಾರ್‌ನ ಪ್ರಸಿದ್ಧ ಠಾಕೂರ್ ಕುಟುಂಬದ ಪಾರಂಪರಿಕ ಸಿಹಿ. ಹಾಲಿನ ಖೋವಾವನ್ನು ಕೆಂಪಗೆ ಹುರಿದು ಸಕ್ಕರೆ ಪುಡಿಯಲ್ಲಿ ಹೊರಳಿಸಿದ ರುಚಿಕರ ಪೇಡ.',
    price: '₹150 / 250g box',
    priceNum: 150,
    tag: 'GI Tagged Sweet',
    spiceLevel: 'None',
    isVeg: true,
    stallNumber: 'Sweet Stalls Zone A-12',
    icon: '🍬',
  },
  {
    id: 'buns',
    name: 'Mangalore Banana Buns & Goli Baje',
    nameKn: 'ಮಂಗಳೂರು ಬನ್ಸ್ ಮತ್ತು ಗೋಳಿಬಜೆ',
    category: 'coastal',
    origin: 'Udupi & Dakshina Kannada Food Stall',
    originKn: 'ಉಡುಪಿ ಮತ್ತು ದಕ್ಷಿಣ ಕನ್ನಡ ಕರಾವಳಿ ತಿನಿಸು',
    desc: 'Mildly sweet, fluffy deep-fried puris made from mashed ripe banana and fermented flour, served alongside crispy coconut-coriander chutney and sambar.',
    descKn: 'ಬಾಳೆಹಣ್ಣು ಮತ್ತು ಮೈದಾದಿಂದ ಹುದುಗು ಬರಿಸಿ ಮಾಡುವ ಮೃದುವಾದ ಸಿಹಿ ಬನ್ಸ್ ಮತ್ತು ಕರಾವಳಿಯ ಪ್ರಸಿದ್ಧ ಗರಿಗರಿ ಗೋಳಿಬಜೆ ಜೊತೆಗೆ ಕಾಯಿ ಚಟ್ನಿ.',
    price: '₹60 / plate (2 pcs)',
    priceNum: 60,
    tag: 'Coastal Treat',
    spiceLevel: 'Mild',
    isVeg: true,
    stallNumber: 'Coastal Food Court D-03',
    icon: '🥟',
  },
  {
    id: 'benne-dosa',
    name: 'Davangere Benne Dosa',
    nameKn: 'ದಾವಣಗೆರೆ ಬೆಣ್ಣೆ ದೋಸೆ',
    category: 'tiffin',
    origin: 'Davangere Heritage Butter Stalls',
    originKn: 'ದಾವಣಗೆರೆ ಪ್ರಸಿದ್ಧ ಬೆಣ್ಣೆ ದೋಸೆ ಮಳಿಗೆ',
    desc: 'Crispy yet spongy artisanal crepe cooked over firewood stoves with immense dollops of fresh white butter, served with spicy mashed potato and fiery coconut chutney.',
    descKn: 'ಕಟ್ಟಿಗೆ ಒಲೆಯ ಮೇಲೆ ಕಾದ ತವೆಯ ಮೇಲೆ ತಾಜಾ ಬೆಣ್ಣೆ ಹಾಕಿ ಬೇಯಿಸುವ ದಾವಣಗೆರೆ ಬೆಣ್ಣೆ ದೋಸೆ. ಜೊತೆಗೆ ಖಾರದ ಆಲೂಗಡ್ಡೆ ಪಲ್ಯ ಮತ್ತು ಸಬ್ಬಕ್ಕಿ ಚಟ್ನಿ.',
    price: '₹80 per plate',
    priceNum: 80,
    tag: 'Local Favorite',
    spiceLevel: 'Medium',
    isVeg: true,
    stallNumber: 'Food Pavilion Stall B-07',
    icon: '🧈',
  },
  {
    id: 'akki-rotti',
    name: 'Malenadu Akki Rotti with Chutney',
    nameKn: 'ಮಲೆನಾಡು ಅಕ್ಕಿ ರೊಟ್ಟಿ ಮತ್ತು ಚಟ್ನಿ',
    category: 'tiffin',
    origin: 'Chikkamagaluru & Shivamogga Stalls',
    originKn: 'ಚಿಕ್ಕಮಗಳೂರು ಮತ್ತು ಶಿವಮೊಗ್ಗ ಗ್ರಾಮೀಣ ಮಳಿಗೆ',
    desc: 'Hand-pressed rice flour flatbread infused with fragrant dill leaves (sabbasige soppu), green chillies, cumin seeds, and onions, served with roasted eggplant mash.',
    descKn: 'ಸಬ್ಬಸಿಗೆ ಸೊಪ್ಪು, ಈರುಳ್ಳಿ, ಜೀರಿಗೆ ಬೆರೆಸಿ ತವೆಗೆ ತಟ್ಟಿ ಬೇಯಿಸಿದ ಬಿಸಿಬಿಸಿ ಅಕ್ಕಿರೊಟ್ಟಿ. ಜೊತೆಗೆ ಸುಟ್ಟ ಬದನೆಕಾಯಿ ಗೊಜ್ಜು ಮತ್ತು ಕಾಯಿ ಚಟ್ನಿ.',
    price: '₹65 / 2 rottis',
    priceNum: 65,
    tag: 'Malenadu Heritage',
    spiceLevel: 'Medium',
    isVeg: true,
    stallNumber: 'Food Pavilion Stall C-01',
    icon: '🌿',
  },
  {
    id: 'filter-coffee',
    name: 'Mysore Kumbakonam Degree Filter Kaapi',
    nameKn: 'ಮೈಸೂರು ಡಿಗ್ರಿ ಫಿಲ್ಟರ್ ಕಾಫಿ',
    category: 'beverage',
    origin: 'Heritage Coffee Brewers of Mysore',
    originKn: 'ಮೈಸೂರು ಪಾರಂಪರಿಕ ಕಾಫಿ ಮನೆ',
    desc: 'Freshly roasted plantation Arabica and Peaberry beans brewed in brass gravity filters, poured back-and-forth from height into a traditional brass davarah-tumbler.',
    descKn: 'ತಾಜಾ ಹುರಿದ ಅರೇಬಿಕಾ-ರೋಬಸ್ಟಾ ಕಾಫಿ ಬೀಜಗಳ ಕಷಾಯ ಮತ್ತು ನೊರೆಹಾಲು ಬೆರೆಸಿದ ಘಮಘಮಿಸುವ ಸಾಂಪ್ರದಾಯಿಕ ಹಿತ್ತಾಳೆ ಲೋಟದ ಫಿಲ್ಟರ್ ಕಾಫಿ.',
    price: '₹30 per cup',
    priceNum: 30,
    tag: 'Aromatic Brew',
    spiceLevel: 'None',
    isVeg: true,
    stallNumber: 'Beverage Kiosk K-01',
    icon: '☕',
  },
  {
    id: 'payasa',
    name: 'Halasina Hannina Payasa',
    nameKn: 'ಹಲಸಿನ ಹಣ್ಣಿನ ಪಾಯಸ',
    category: 'sweet',
    origin: 'Uttara Kannada & Coorg Forest Pavilions',
    originKn: 'ಉತ್ತರ ಕನ್ನಡ ಹಾಗೂ ಕೊಡಗು ಮಳಿಗೆ',
    desc: 'Luscious heritage kheer crafted from naturally sweet ripe jackfruit pulp, thick fresh coconut milk, organic jaggery, cardamom, and ghee-roasted cashews.',
    descKn: 'ನಾಟಿ ಹಲಸಿನ ಹಣ್ಣಿನ ತಿರುಳು, ತಾಜಾ ತೆಂಗಿನಹಾಲು, ಸಾವಯವ ಬೆಲ್ಲ ಮತ್ತು ತುಪ್ಪದಲ್ಲಿ ಹುರಿದ ಗೋಡಂಬಿ ಬೆರೆಸಿ ತಯಾರಿಸಿದ ಮಲೆನಾಡಿನ ಅಮೃತ ಪಾಯಸ.',
    price: '₹55 per cup',
    priceNum: 55,
    tag: 'Forest Sweet',
    spiceLevel: 'None',
    isVeg: true,
    stallNumber: 'Sweet Stalls Zone A-15',
    icon: '🥣',
  },
  {
    id: 'chiroti',
    name: 'Mysore Royal Chiroti with Badam Milk',
    nameKn: 'ಮೈಸೂರು ಚಿರೋಟಿ ಮತ್ತು ಬಾದಾಮಿ ಹಾಲು',
    category: 'sweet',
    origin: 'Wadiyar Royal Wedding Feast Tradition',
    originKn: 'ಒಡೆಯರ್ ರಾಜಮನೆತನದ ಶುಭ ಸಮಾರಂಭದ ಸಿಹಿ',
    desc: 'Delicate multi-layered flaky fried pastry dusted with powdered sugar and bathed in steaming aromatic saffron-almond milk.',
    descKn: 'ಪದರ ಪದರವಾಗಿ ಉದುರುವ ಗರಿಗರಿ ಚಿರೋಟಿಯ ಮೇಲೆ ಸಕ್ಕರೆ ಪುಡಿ ಉದುರಿಸಿ, ಕೇಸರಿ-ಬಾದಾಮಿ ಬೆರೆಸಿದ ಬಿಸಿ ಹಾಲು ಹೊಯ್ದು ಸವಿಯುವ ರಾಜವೈಭವದ ಸಿಹಿ.',
    price: '₹70 per plate',
    priceNum: 70,
    tag: 'Wedding Feast Special',
    spiceLevel: 'None',
    isVeg: true,
    stallNumber: 'Sweet Stalls Zone A-09',
    icon: '🥛',
  },
];

const ALL_STALLS: StallItem[] = [
  {
    id: 'silk',
    name: 'KSIC Mysore Silk Sarees (Govt Factory)',
    nameKn: 'ಕೆ.ಎಸ್.ಐ.ಸಿ ಮೈಸೂರು ಸಿಲ್ಕ್ (ಸರ್ಕಾರಿ ಮಳಿಗೆ)',
    category: 'silk',
    hall: 'Pavilion Hall A — Royal Handlooms',
    hallKn: 'ಹಾಲ್ ಎ — ರಾಯಲ್ ನೇಕಾರಿಕೆ ವಿಭಾಗ',
    desc: 'Official government showroom displaying 100% pure natural mulberry silk sarees with hallmarked 24K gold and silver electroplated zari, featuring individual authenticity QR codes.',
    descKn: 'ಶುದ್ಧ ರೇಷ್ಮೆ ಹಾಗೂ ೨೪ ಕ್ಯಾರೆಟ್ ಅಪರಂಜಿ ಜರಿಯಿಂದ ನೇಯ್ದ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮೈಸೂರು ಸಿಲ್ಕ್ ಸೀರೆಗಳ ಭವ್ಯ ಮಳಿಗೆ. ಪ್ರತಿಯೊಂದು ಸೀರೆಗೂ ವಿಶಿಷ್ಟ ಕೋಡ್ ಮತ್ತು ಗ್ಯಾರಂಟಿ.',
    origin: 'Mananthavady Road Factory, Mysuru',
    heritageStatus: 'GI Tagged & Govt Hallmarked',
    icon: '🧵',
  },
  {
    id: 'sandal',
    name: 'Government Sandalwood Oil & Soaps (MSIL)',
    nameKn: 'ಸರ್ಕಾರಿ ಗಂಧದ ಎಣ್ಣೆ ಮತ್ತು ಮೈಸೂರು ಸ್ಯಾಂಡಲ್ ಸೋಪ್',
    category: 'forest',
    hall: 'Forest Pavilion — Hall B',
    hallKn: 'ಹಾಲ್ ಬಿ — ಅರಣ್ಯ ಇಲಾಖೆ ವಿಭಾಗ',
    desc: 'The historic factory founded in 1916 by Nalvadi Krishnaraja Wadiyar. Genuine Santalum album pure essential oil, Mysore Sandal Gold soaps, and pure sandalwood billets.',
    descKn: '೧೯೧೬ ರಲ್ಲಿ ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ ಸ್ಥಾಪಿಸಿದ ಸರ್ಕಾರಿ ಶ್ರೀಗಂಧದ ಕಾರ್ಖಾನೆಯ ಅಧಿಕೃತ ಮಳಿಗೆ. ಶುದ್ಧ ಶ್ರೀಗಂಧದ ಎಣ್ಣೆ, ಧೂಪ ಮತ್ತು ಸಾಬೂನುಗಳು.',
    origin: 'Kuvempunagar Govt Sandalwood Factory',
    heritageStatus: 'Century-Old Royal Heritage',
    icon: '🪵',
  },
  {
    id: 'toys',
    name: 'GI-Tagged Channapatna Lacquerware Toys',
    nameKn: 'ಚನ್ನಪಟ್ಟಣದ ಬಣ್ಣದ ಮರದ ಆಟಿಕೆಗಳು',
    category: 'craft',
    hall: 'Artisans Enclosure — Pavilion C',
    hallKn: 'ಹಾಲ್ ಸಿ — ಕುಶಲಕರ್ಮಿಗಳ ಗ್ರಾಮ',
    desc: 'Traditional lathe-turned wooden toys, rocking horses, and educational puzzles crafted from Ivory Wood and buffed with non-toxic natural vegetable pigments (turmeric, indigo, acacia).',
    descKn: 'ಹಾಲೆ ಮರದಿಂದ ಕೊರೆದು ನೈಸರ್ಗಿಕ ತರಕಾರಿ ಬಣ್ಣಗಳಿಂದ ಹೊಳಪು ನೀಡಿದ ಮಕ್ಕಳ ಆಟಿಕೆಗಳು, ತೊಟ್ಟಿಲುಗಳು ಮತ್ತು ಅಲಂಕಾರಿಕ ವಸ್ತುಗಳು.',
    origin: 'Channapatna Craft Cluster, Ramanagara',
    heritageStatus: 'UNESCO Recognized GI Craft',
    icon: '🪀',
  },
  {
    id: 'bidri',
    name: 'Bidriware Silver Inlay Metalcraft',
    nameKn: 'ಬಿದರಿ ಬೆಳ್ಳಿಯ ಕೆತ್ತನೆ ಕಲೆ',
    category: 'metal',
    hall: 'Handicrafts Development Pavilion — Hall B',
    hallKn: 'ಹಾಲ್ ಬಿ — ಹಸ್ತಕಲಾ ವಿಭಾಗ',
    desc: 'Master artisans demonstrating live chasing of pure silver wire into jet-black oxidized zinc-copper vases, hookahs, and jewellery boxes using Bidar Fort soil.',
    descKn: 'ಬೀದರ್ ಕೋಟೆಯ ಮಣ್ಣಿನಿಂದ ಕಪ್ಪಾಗಿಸಿದ ಮಿಶ್ರಲೋಹದ ಮೇಲೆ ಶುದ್ಧ ಬೆಳ್ಳಿಯ ತಂತಿಗಳನ್ನು ಜಡಿದು ಮಾಡುವ ಅದ್ಭುತ ಕರಕುಶಲ ಕಲಾಕೃತಿಗಳು.',
    origin: 'Bidar Heritage Guild, North Karnataka',
    heritageStatus: 'GI Tagged 500-Year Craft',
    icon: '🏺',
  },
  {
    id: 'rosewood',
    name: 'Mysore Rosewood Inlay & Marquetry',
    nameKn: 'ಮೈಸೂರು ರೋಸ್‌ವುಡ್ ಕೆತ್ತನೆ ಮತ್ತು ಮಾರ್ಕ್ವೆಟ್ರಿ',
    category: 'craft',
    hall: 'Pavilion Hall C — Fine Woodcrafts',
    hallKn: 'ಹಾಲ್ ಸಿ — ಮರಗೆತ್ತನೆ ವಿಭಾಗ',
    desc: 'Intricate wood mosaic artworks depicting Dasara Ambari processions, Lord Krishna, and forest flora inlaid with contrasting seasoned woods and mother-of-pearl.',
    descKn: 'ಕಪ್ಪು ರೋಸ್‌ವುಡ್ ಮರದ ಮೇಲೆ ಜಂಬೂಸವಾರಿ, ದೇವರು ಮತ್ತು ಹೂಬಳ್ಳಿಗಳ ಸೂಕ್ಷ್ಮ ಕೆತ್ತನೆಯ ದಸರಾ ಸ್ಮರಣಿಕೆಗಳು ಮತ್ತು ಫೋಟೋ ಫ್ರೇಮ್‌ಗಳು.',
    origin: 'Mandi Mohalla Woodcraft Guild, Mysuru',
    heritageStatus: 'Royal Wadiyar Court Patronage',
    icon: '🖼️',
  },
  {
    id: 'spices',
    name: 'Coffee Board of India & Kodagu Estate Spices',
    nameKn: 'ಕಾಫಿ ಬೋರ್ಡ್ ಮತ್ತು ಕೊಡಗಿನ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು',
    category: 'spice',
    hall: 'Commodity Pavilion — Hall D',
    hallKn: 'ಹಾಲ್ ಡಿ — ವಾಣಿಜ್ಯ ಮಸಾಲೆ ಮಳಿಗೆ',
    desc: 'Direct-from-estate single-origin Arabica coffee, Malabar tellicherry black pepper, green cardamom pods, cinnamon, and wild Coorg honey.',
    descKn: 'ಕೊಡಗು ಹಾಗೂ ಚಿಕ್ಕಮಗಳೂರಿನ ಕಾಫಿ ತೋಟಗಳಿಂದ ನೇರವಾಗಿ ತಂದ ಶುದ್ಧ ಕಾಫಿ ಪುಡಿ, ಕರಿಮೆಣಸು, ಹಸಿರು ಏಲಕ್ಕಿ, ದಾಲ್ಚಿನ್ನಿ ಮತ್ತು ಕಾಡು ಜೇನುತುಪ್ಪ.',
    origin: 'Madikeri & Chikmagalur Coffee Estates',
    heritageStatus: 'Direct Farmer Cooperatives',
    icon: '☕',
  },
  {
    id: 'ilkal',
    name: 'Ilkal Sarees & Guledgudda Khana',
    nameKn: 'ಇಳಕಲ್ ಸೀರೆಗಳು ಮತ್ತು ಗುಳೇದಗುಡ್ಡ ಖಣ',
    category: 'silk',
    hall: 'Pavilion Hall A — Handloom Pavilion',
    hallKn: 'ಹಾಲ್ ಎ — ಕೈಮಗ್ಗ ವಿಭಾಗ',
    desc: 'Famous handloom cotton-silk sarees featuring the distinctive red embroidered ‘Tope Teni’ temple pallu woven using the ancient Kondi joint technique.',
    descKn: 'ಬಾಗಲಕೋಟೆಯ ಐತಿಹಾಸಿಕ ಇಳಕಲ್ ಸೀರೆಗಳು, ಕೆಂಪು ಟೋಪೆತೆನೆ ಸೆರಗು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ರವಿಕೆ ಖಣದ ಕೈಮಗ್ಗ ಸೀರೆಗಳ ಸಂಗ್ರಹ.',
    origin: 'Ilkal & Guledgudda, Bagalkote',
    heritageStatus: 'GI Tagged Handloom Heritage',
    icon: '🥻',
  },
  {
    id: 'honey',
    name: 'Karnataka Forest Dept Wild Honey & Tribal Herbs',
    nameKn: 'ಅರಣ್ಯ ಇಲಾಖೆ ಜೇನುತುಪ್ಪ ಮತ್ತು ಗಿಡಮೂಲಿಕೆಗಳು',
    category: 'forest',
    hall: 'Forest Pavilion — Hall B',
    hallKn: 'ಹಾಲ್ ಬಿ — ಆದಿವಾಸಿ ಜೇನು ಮಳಿಗೆ',
    desc: 'Sustainably harvested multi-floral wild honey by the Jenu Kuruba tribal cooperative from Bandipur and Nagarahole reserves alongside authentic triphala and ashwagandha.',
    descKn: 'ಬಂಡೀಪುರ ಹಾಗೂ ನಾಗರಹೊಳೆ ಕಾಡುಗಳಿಂದ ಜೇನುಕುರುಬ ಆದಿವಾಸಿಗಳು ಸಂಗ್ರಹಿಸಿದ ನೈಸರ್ಗಿಕ ಹೆಜ್ಜೇನು, ಗಿಡಮೂಲಿಕೆಗಳು ಮತ್ತು ಶುದ್ಧ ಆಯುರ್ವೇದ ಉತ್ಪನ್ನಗಳು.',
    origin: 'Bandipur & Nagarahole Tiger Reserves',
    heritageStatus: 'Eco-Tribal Livelihood Initiative',
    icon: '🍯',
  },
];

export default function FoodExhibitionPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'exhibition' | 'grounds'>('food');
  const [foodCategory, setFoodCategory] = useState<string>('all');
  const [stallCategory, setStallCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trail, setTrail] = useState<string[]>(['pak', 'dosa', 'filter-coffee']);
  const [showTrailModal, setShowTrailModal] = useState<boolean>(false);

  // Toggle item in food trail
  const toggleTrailItem = (id: string) => {
    audioManager.playBellSound();
    setTrail((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered Food Items
  const filteredFoods = useMemo(() => {
    return ALL_FOOD_ITEMS.filter((item) => {
      const matchesCat = foodCategory === 'all' || item.category === foodCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.nameKn.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [foodCategory, searchQuery]);

  // Filtered Stalls
  const filteredStalls = useMemo(() => {
    return ALL_STALLS.filter((s) => {
      const matchesCat = stallCategory === 'all' || s.category === stallCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.nameKn.toLowerCase().includes(q) ||
        s.hall.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [stallCategory, searchQuery]);

  // Trail Total Calculation
  const trailItems = ALL_FOOD_ITEMS.filter((f) => trail.includes(f.id));
  const trailTotal = trailItems.reduce((acc, curr) => acc + curr.priceNum, 0);

  return (
    <div className="min-h-screen pt-20 pb-36 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Food & Exhibition Explorer"
        titleKn="ದಸರಾ ಆಹಾರ ಮೇಳ ಮತ್ತು ವಸ್ತುಪ್ರದರ್ಶನ"
        subtitle="Savor royal palace sweets, authentic tiffins, and North Karnataka thalis at Aahara Mela. Discover hallmark KSIC silk, pure sandalwood, and GI handicrafts at Doddakere Exhibition Grounds."
      />

      {/* Main Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 mb-6">
        {/* Experience Switcher */}
        <div className="glass p-1.5 rounded-2xl border border-amber-400/30 flex flex-wrap gap-1.5 bg-slate-950/80 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('food');
              audioManager.playDrumBeat(0.5);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'food'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-gold-glow scale-102 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🍛</span>
            <span>Aahara Mela (12 Dishes)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('exhibition');
              audioManager.playDrumBeat(0.5);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'exhibition'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-gold-glow scale-102 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎪</span>
            <span>Exhibition Stalls (8 Pavilions)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('grounds');
              audioManager.playBellSound();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'grounds'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-gold-glow scale-102 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🗺️</span>
            <span>Grounds Guide</span>
          </button>
        </div>

        {/* Trail Floating Badge / Quick Drawer Button */}
        {activeTab === 'food' && (
          <button
            onClick={() => setShowTrailModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-amber-400 hover:text-black border border-amber-400/40 text-amber-300 transition-all shadow-md flex items-center gap-2 text-xs font-bold cursor-pointer group"
          >
            <span className="text-base group-hover:scale-110 transition-transform">📋</span>
            <span>My Tasting Trail</span>
            <span className="bg-amber-500/20 text-amber-200 group-hover:bg-black/30 group-hover:text-black px-2 py-0.5 rounded-full font-mono text-[11px]">
              {trail.length} items (₹{trailTotal})
            </span>
          </button>
        )}
      </div>

      {/* Real-Time Search Bar */}
      <div className="mb-6 relative max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeTab === 'food'
              ? 'Search delicacies (e.g. Mysore Pak, Dosa, ರೊಟ್ಟಿ, Coffee)...'
              : 'Search stalls (e.g. KSIC Silk, Sandalwood, ಬಿದರಿ, Honey)...'
          }
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900/80 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-400 backdrop-blur-md transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. AAHARA MELA (FOOD FESTIVAL) TAB */}
      {/* ========================================================= */}
      {activeTab === 'food' && (
        <div className="space-y-6">
          {/* Sub-Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Delicacies', icon: '🍽️' },
              { id: 'sweet', label: 'Royal Sweets', icon: '🍬' },
              { id: 'tiffin', label: 'Iconic Tiffins', icon: '🥞' },
              { id: 'thali', label: 'Regional Thalis', icon: '🫓' },
              { id: 'coastal', label: 'Coastal Karavali', icon: '🥥' },
              { id: 'beverage', label: 'Beverages & Brews', icon: '☕' },
            ].map((cat) => {
              const isActive = foodCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? ALL_FOOD_ITEMS.length
                  : ALL_FOOD_ITEMS.filter((f) => f.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setFoodCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-amber-400 text-black border-amber-300 shadow-gold-glow font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFoods.map((item) => {
              const inTrail = trail.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`glass p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between relative group ${
                    inTrail
                      ? 'bg-slate-900/90 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)] ring-1 ring-amber-400/40'
                      : 'bg-slate-950/60 border-white/10 hover:border-amber-400/40 hover:bg-slate-900/80 shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: Tags & Price */}
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          {item.tag}
                        </span>
                        {item.isVeg && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                            <span>🟢</span>
                            <span>Pure Veg</span>
                          </span>
                        )}
                        {item.spiceLevel !== 'None' && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/25">
                            🌶️ {item.spiceLevel}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-black text-amber-300 font-mono">
                        {item.price.split(' ')[0]}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="flex items-start gap-2.5 mb-2">
                      <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-amber-400/90 font-kannada font-medium mt-0.5">
                          {item.nameKn}
                        </p>
                      </div>
                    </div>

                    {/* Heritage Origin */}
                    <p className="text-[11px] text-amber-200/90 font-medium mb-2 flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate">{item.origin}</span>
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-300/80 leading-relaxed mb-3 line-clamp-3">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Bottom: Stall Location & Trail Toggle */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                      {item.stallNumber}
                    </span>

                    <button
                      onClick={() => toggleTrailItem(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                        inTrail
                          ? 'bg-amber-400 text-black shadow-sm font-extrabold'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15'
                      }`}
                    >
                      <span>{inTrail ? '✓ Added' : '+ Add to Trail'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DASARA EXHIBITION STALLS TAB */}
      {/* ========================================================= */}
      {activeTab === 'exhibition' && (
        <div className="space-y-6">
          {/* Sub-Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Pavilions', icon: '🎪' },
              { id: 'silk', label: 'Pure Silk & Handlooms', icon: '🧵' },
              { id: 'craft', label: 'GI Wood & Stone Crafts', icon: '🪀' },
              { id: 'metal', label: 'Bidriware & Metal Inlay', icon: '🏺' },
              { id: 'forest', label: 'Sandalwood & Forest Honey', icon: '🪵' },
              { id: 'spice', label: 'Coffee & Spices', icon: '☕' },
            ].map((cat) => {
              const isActive = stallCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? ALL_STALLS.length
                  : ALL_STALLS.filter((s) => s.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setStallCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-amber-400 text-black border-amber-300 shadow-gold-glow font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Exhibition Stalls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredStalls.map((s) => (
              <div
                key={s.id}
                className="glass p-6 rounded-3xl border border-white/10 hover:border-amber-400/40 bg-slate-950/60 hover:bg-slate-900/80 shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                      {s.hall}
                    </span>
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {s.icon}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors leading-tight">
                    {s.name}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-kannada font-medium mt-0.5 mb-2">
                    {s.nameKn}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/25">
                      ⭐ {s.heritageStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      📍 {s.origin}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Doddakere Maidan, Opp. Palace South Gate</span>
                  <span className="text-amber-300 font-semibold flex items-center gap-1 font-mono">
                    <span>⏰</span>
                    <span>10:30 AM – 9:30 PM</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. GROUNDS GUIDE & PAVILION DIRECTORY TAB */}
      {/* ========================================================= */}
      {activeTab === 'grounds' && (
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-amber-400/30 bg-slate-950/70 shadow-xl">
            <h3 className="text-base font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2 font-mono">
              <span>🏛️ Doddakere Exhibition Grounds Master Directory</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              The historic <strong>Dasara Exhibition Grounds</strong> span 80 sprawling acres opposite the South Gate of Mysore Palace. Initiated in 1880 by Maharaja Chamarajendra Wadiyar X, the exhibition runs for 90 days showcasing Karnataka’s industrial, agricultural, and cultural achievements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>🏛️</span>
                  <span>Pavilion Hall A & B</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Government departments, KSIC Silk, MSIL Sandalwood, Forest Dept, and Cauvery Arts & Crafts.
                </p>
                <span className="text-[10px] font-mono text-emerald-300 block">Open: 10:30 AM – 9:30 PM</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>🍛</span>
                  <span>Aahara Mela Food Court</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Over 120 regional food stalls representing Old Mysore, Malenadu, Karavali, and North Karnataka.
                </p>
                <span className="text-[10px] font-mono text-emerald-300 block">Open: 11:00 AM – 10:30 PM</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>🎡</span>
                  <span>Amusement & Carnival</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Giant Ferris Wheel with panoramic palace views, Colombian rides, and cultural stage shows.
                </p>
                <span className="text-[10px] font-mono text-emerald-300 block">Open: 3:00 PM – 10:00 PM</span>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎟️</span>
                <div>
                  <p className="font-bold text-white">Exhibition Entry Ticket: Adults ₹30 • Children ₹20</p>
                  <p className="text-slate-400 text-[11px]">Free entry for senior citizens and uniformed students on weekdays.</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs font-mono">
                Govt Regulated
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TASTING TRAIL MODAL DRAWER */}
      {/* ========================================================= */}
      {showTrailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-amber-400/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar relative">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="text-base font-extrabold text-amber-300 uppercase font-mono">
                    My Dasara Tasting Trail
                  </h3>
                  <p className="text-xs text-slate-400">
                    {trail.length} curated delicacies selected for your visit
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTrailModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {trailItems.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <span className="text-3xl">🍽️</span>
                <p className="text-xs text-slate-300 font-semibold">Your tasting trail is empty</p>
                <p className="text-[11px] text-slate-400">
                  Click "+ Add to Trail" on any delicacy in Aahara Mela to build your food plan.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {trailItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.stallNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        ₹{item.priceNum}
                      </span>
                      <button
                        onClick={() => toggleTrailItem(item.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                        title="Remove from trail"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* Total Summary */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 uppercase tracking-wider font-mono">
                    Estimated Budget:
                  </span>
                  <span className="text-base text-amber-300 font-mono font-extrabold">
                    ₹{trailTotal}
                  </span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setTrail([])}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
              >
                Clear Trail
              </button>

              <button
                onClick={() => {
                  audioManager.playRoyalFanfare();
                  setShowTrailModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold cursor-pointer shadow-gold-glow hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                Done (Save Trail)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
