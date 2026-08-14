// --- CONFIGURATION & CONSTANTS ---
import React from 'react';

// Environment Variables থেকে ডেটা রিড করা হচ্ছে
export const APP_NAME = "OS Delivery";
export const MOTTO = "We Cook Bad !!!";
export const DELIVERY_AREA = " Bashundhara R\A ";
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER; 
export const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE; 
export const RIDER_PASSCODE = import.meta.env.VITE_RIDER_PASSCODE; 
export const EXPORT_PASSCODE = import.meta.env.VITE_EXPORT_PASSCODE; 

export const CATEGORIES = [
  { 
    name: 'Rater_menu', 
    title: 'LATE NIGHT MENU', 
    icon: '🌙', 
    type: 'oriental', 
    description: 'সন্ধ্যা ৬টা থেকে ভোর ৪টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/rat1.png',
      'https://osrush.com/image/rat2.png',
      'https://osrush.com/image/rat3.png',
      'https://osrush.com/image/rat4.png',
    ]
  },
  { 
    name: 'Diner_menu', 
    title: 'দিনের মেনু', 
    icon: '☀️', 
    type: 'oriental', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/din1.png',
      'https://osrush.com/image/din2.png',
      'https://osrush.com/image/din3.png',
      'https://osrush.com/image/din4.png',
    ]
  },
  { 
    name: 'Groceries', 
    title: '🛒 Groceries', 
    icon: '🛒', 
    type: 'oriental', 
    description: 'দুপুর 12 টা থেকে রাত 11 টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/grocery2.png',
      'https://osrush.com/image/grocery3.png',
      'https://osrush.com/image/grocery4.png',
      'https://osrush.com/image/masala.png',
      'https://osrush.com/image/Screenshot_1.png',
    ]
  },
  { 
    name: 'Tong_Smokestore', 
    title: 'Tong & Smokestore', 
    icon: '🚬', 
    type: 'oriental', 
    description: 'দুপুর ১ টা থেকে ভোর ৪ টা পর্যন্ত',
    images: [
      'https://osrush.com/image/smoke1.png',
      'https://osrush.com/image/smoke2.png',
      'https://osrush.com/image/others3.png',
    ]
  },
  { 
    name: 'Teheri_Ghor', 
    title: 'Tehari Ghor', 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর 12 টা থেকে রাত 10 টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/teheri_ghor1.png',
      'https://osrush.com/image/teheri_ghor2.png',
    ]
  },
  { 
    name: 'Abesh_Hotel', 
    title: 'Abesh Hotel & Biriyani House', 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/abesh1.png',
      'https://osrush.com/image/abesh2.png',
    ]
  },
  { 
    name: 'Khana_s', 
    title: "Khana's", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/khanas1.png',
      'https://osrush.com/image/khanas2.png',
    ]
  },
  { 
    name: 'Uncle_Bobos', 
    title: "Uncle Bobo's - Bashundhara", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/bobos1.png',
      'https://osrush.com/image/bobos2.png',
    ]
  },
  { 
    name: 'CP_Five_Star', 
    title: "CP Five Star - Bashundhara", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/cp1.png',
      'https://osrush.com/image/cp2.png',
    ]
  },
  { 
    name: 'Shiraj_Chui', 
    title: "Shiraj Chui Gosh - Bashundhara", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/shiraj1.png',
      'https://osrush.com/image/shiraj2.png',
    ]
  },
  { 
    name: 'Crimson_Cup', 
    title: "Crimson Cup - Bashundhara", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/crimson1.png',
      'https://osrush.com/image/crimson2.png',
    ]
  },
  { 
    name: 'Tasty_Treat', 
    title: "Tasty Treat - Apollo", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টাথেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/tasty3.png',
      'https://osrush.com/image/tasty1.png',
    ]
  },
  { 
    name: 'Al_Arabian', 
    title: "Al Arabian Cake & Sweets - Apollo", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/arabian1.png',
      'https://osrush.com/image/arabian2.png',
      'https://osrush.com/image/arabian3.png',
    ]
  },
  { 
    name: 'Teheri_Khan', 
    title: "Teheri Khan", 
    icon: '☀️', 
    type: 'restaurant', 
    description: 'দুপুর ১২ টা থেকে রাত ৯ টা পর্যন্ত।',
    images: [
      'https://osrush.com/image/teheri_khan1.png',
      'https://osrush.com/image/teheri_khan2.png',
    ]
  },
  { 
    name: 'Pharmacy', 
    title: 'Pharmacy', 
    icon: '💊', 
    type: 'emergency', 
    description: 'দুপুর ১২ টা থেকে ভোর ৪ টা পর্যন্ত',
    images: [
       'https://osrush.com/image/pharma1.png',
       'https://osrush.com/image/pharma2.png',
       'https://osrush.com/image/pharma3.png',
       'https://osrush.com/image/pharma4.png',
    ]
  }, 
  { 
    name: 'Sexual', 
    title: 'Sexual Wellness', 
    icon: '💊', 
    type: 'emergency', 
    description: 'দুপুর ১২ টা থেকে ভোর ৪ টা পর্যন্ত',
    images: [
      'https://osrush.com/image/sexual1.png',
      'https://osrush.com/image/sexual2.png',
    ]
  },

  
  { 
    name: 'Tong_Smokestore', 
    title: 'Tong & Smokestore', 
    icon: '🚬', 
    type: 'emergency', 
    description: 'দুপুর ১ টা থেকে ভোর ৪ টা পর্যন্ত',
    images: [
      'https://osrush.com/image/smoke1.png',
      'https://osrush.com/image/smoke2.png',
      'https://osrush.com/image/others3.png',
    ]
  },


];

export const SUBCATEGORIES = {
    Rater_menu: [
        { name: 'Kabab', title: 'কাবাব আইটেম', icon: '🍗' },
        { name: 'HeavyMeal', title: 'হেভি মিল (বিরিয়ানি/ভাত)', icon: '🍚' },
        { name: 'LateSnacks', title: 'লেট নাইট স্ন্যাকস', icon: '🍟' },
        { name: 'Drinks', title: 'ড্রিংকস ও জুস', icon: '🥤' },
    ],
    Diner_menu: [
        { name: 'bangla_item', title: 'Bangla Item', icon: '🍽️' },
        { name: 'platter', title: 'Set Menu', icon: '🍱' },
        { name: 'FastFood', title: 'ফাস্ট ফুড', icon: '🍔' },
        { name: 'Snacks', title: 'Snacks', icon: '🍟' },
        
        { name: 'Desserts', title: 'ডেজার্ট', icon: '🍰' },
    ],
    Groceries: [
        { name: 'Meat', title: '🍗 ফ্রেশ মাংস ও চিকেন', icon: '🥩🦐' },
        { name: 'Vegetables', title: '🥬টাটকা শাক-সবজি ও ফলমূল', icon: '🥭🥦' },
        { name: 'Daily_Essentials', title: '🍚 চাল, ডাল ও তেল', icon: '🌾' },
        { name: 'Dairy_Eggs', title: '🥚 দুধ ও ডিম', icon: '🥛' },
        { name: 'Drinks', title: '🥤 ড্রিংকস ও জুস', icon: '🧃' },
        { name: 'Spices', title: '🌶️ মসলা ও সস', icon: '🧂' },
        { name: 'Hygiene', title: '🧼 Soap & Cleaning', icon: '🧽' },
        { name: 'Personal_Care', title: '🧴 লোশন ও শ্যাম্পু', icon: '🪥' },
        { name: 'Baby_Care', title: '👶 Baby Care', icon: '🍼' },
    ],
    Pharmacy: [
        { name: 'Cough_Cold', title: '🤧 Cough, Cold & Flu', icon: '💊🌡️' },
        { name: 'Sanitary_Pads', title: '🌸 Sanitary Pads', icon: '🎀' },
        { name: 'All_Meds', title: '💊 All Meds', icon: '📦' },
        { name: 'Fever_Pain', title: '🤒 Fever & Pain', icon: '🩹' },
        { name: 'Diabetes', title: '🩸 Diabetes Care', icon: '💉' },
        { name: 'Digestive', title: '🤢 Allergy,Digestive Health', icon: '🧪' },
        { name: 'Skin_Hair', title: '🧴 Skin & Hair', icon: '✨' },
        { name: 'Infection', title: '🛡️ Infection Control', icon: '🧼' },
        { name: 'Insulin', title: '💉 Insulin & Syringes', icon: '🧪' },
    ],
    Sexual: [
        { name: 'Condoms', title: 'Condoms', icon: '📦' },
        { name: 'Contraceptive_Pills', title: 'Contraceptive Pills', icon: '💊' },
        { name: 'Pregnancy_Tests', title: 'Pregnancy Tests', icon: '🧪' },
        { name: 'Performance_Enhancer', title: 'Performance Enhancer', icon: '⚡' },
        { name: 'Lubricants', title: 'Lubricants', icon: '🧴' },
    ],
    Tong_Smokestore: [
        { name: 'Smokes', title: 'Smokes', icon: '🚬' },
        { name: 'lighter', title: 'Lighters', icon: '🔥' },
    ],
    Teheri_Ghor: [
        { name: 'Tehari_Special', title: '🍛 Signature Tehari', icon: '🔥' },
        { name: 'Pulao_Items', title: '🍚 Shahi Pulao', icon: '✨' },
        { name: 'Kacchi_Platter', title: '🍖 Kacchi Special', icon: '🥘' },
        { name: 'Borhani_Chutney', title: '🥛 Borhani & Chutney', icon: '🍯' },
    ],
    Abesh_Hotel: [
        { name: 'Popular', title: 'Popular Items', icon: '⭐' },
        { name: 'Kabab', title: 'কাবাব আইটেম', icon: '🍗' },
        { name: 'Teheri_Pulao', title: 'Teheri & Pulao', icon: '🍛' },
        { name: 'Bhorta_Dal', title: 'Bhorta & Dal', icon: '🥣' },
        { name: 'Curry', title: 'Curry Specials', icon: '🥘' },
        { name: 'Sides_Extras', title: 'Sides & Salad', icon: '🥗' },
        { name: 'Dessert', title: 'Desserts', icon: '🍮' },
        { name: 'Beverage', title: 'Beverages', icon: '🥤' },
    ],
    Shiraj_Chui: [
        { name: 'Popular', title: 'Popular Items', icon: '⭐' },
        { name: 'Kabab', title: 'কাবাব আইটেম', icon: '🍗' },
        { name: 'Teheri_Pulao', title: 'Teheri & Pulao', icon: '🍛' },
        { name: 'Bhorta_Dal', title: 'Bhorta & Dal', icon: '🥣' },
        { name: 'Curry', title: 'Curry Specials', icon: '🥘' },
        { name: 'Sides_Extras', title: 'Sides & Salad', icon: '🥗' },
        { name: 'Dessert', title: 'Desserts', icon: '🍮' },
        { name: 'Beverage', title: 'Beverages', icon: '🥤' },
    ],
    CP_Five_Star: [
        { name: 'Fried_Chicken', title: 'Fried Chicken', icon: '🍗' },
        { name: 'Burgers_Sandwich', title: 'Burgers & Sandwiches', icon: '🍔' },
        { name: 'Sausage_Nuggets', title: 'Sausage & Nuggets', icon: '🌭' },
        { name: 'Rice_Bowls', title: 'Rice Bowls', icon: '🍛' },
        { name: 'Snacks_Sides', title: 'Snacks & Sides', icon: '🍟' },
        { name: 'Drinks', title: 'Beverages', icon: '🥤' },
    ],
    Khana_s: [
        { name: 'Cold_Coffee', title: 'Cold Coffee', icon: '🧋' },
        { name: 'Burgers', title: 'Gourmet Burgers', icon: '🍔' },
        { name: 'Chicken_Fry', title: 'Crispy Chicken', icon: '🍗' },
        { name: 'Platters', title: 'Meal Platters', icon: '🍱' },
        { name: 'Sides_Appetizers', title: 'Sides & Snacks', icon: '🍟' },
        { name: 'Beverages', title: 'Drinks', icon: '🥤' },
    ],
    Uncle_Bobos: [
        { name: 'Popular', title: 'Popular Items', icon: '⭐' },
        { name: 'Classic_Burgers', title: 'Classic Burgers', icon: '🍔' },
        { name: 'Premium_Burgers', title: 'Premium Series', icon: '👑' },
        { name: 'Crispy_Chicken', title: 'Fried Chicken', icon: '🍗' },
        { name: 'Sides_Appetizers', title: 'Sides & Snacks', icon: '🍟' },
        { name: 'Shakes_Drinks', title: 'Shakes & Drinks', icon: '🥤' },
    ],
    Crimson_Cup: [
        { name: 'Hot_Coffee', title: 'Hot Beverages', icon: '☕' },
        { name: 'Cold_Coffee', title: 'Iced Coffee & Chillers', icon: '🧊' },
        { name: 'Crimson_Specials', title: 'Signature Drinks', icon: '👑' },
        { name: 'Bakery_Sweets', title: 'Cakes & Bakery', icon: '🍰' },
        { name: 'Savory_Snacks', title: 'Savory Bites', icon: '🥪' },
        { name: 'Tea_Others', title: 'Tea & Non-Coffee', icon: '🍵' },
    ],
    Tasty_Treat: [
        { name: 'Cakes_Pastries', title: 'Cakes & Pastries', icon: '🍰' },
        { name: 'Fast_Food', title: 'Burgers & Pizzas', icon: '🍔' },
        { name: 'Fried_Chicken', title: 'Fried Chicken', icon: '🍗' },
        { name: 'Savory_Snacks', title: 'Puffs & Rolls', icon: '🥐' },
        { name: 'Sweets_Desserts', title: 'Traditional Sweets', icon: '🍯' },
        { name: 'Beverages', title: 'Cold Drinks & Shakes', icon: '🥤' },
    ],
    Al_Arabian: [
        { name: 'Sweets_Mithai', title: 'Traditional Sweets', icon: '🍯' },
        { name: 'Cakes_Celebration', title: 'Celebration Cakes', icon: '🎂' },
        { name: 'Pastries_Desserts', title: 'Pastries & Desserts', icon: '🍰' },
        { name: 'Cookies_Biscuits', title: 'Premium Cookies', icon: '🍪' },
        { name: 'Savory_Bakery', title: 'Bakery Snacks', icon: '🥯' },
        { name: 'Gift_Boxes', title: 'Sweet Gift Boxes', icon: '🎁' },
    ],
    Teheri_Khan: [
        { name: 'Popular', title: 'Popular Picks', icon: '⭐' },
        { name: 'Signature_Teheri', title: 'Signature Teheri', icon: '🍛' },
        { name: 'Kacchi_Pulao', title: 'Kacchi & Pulao', icon: '🍗' },
        { name: 'Curry_Items', title: 'Special Curries', icon: '🥘' },
        { name: 'Sides_Extras', title: 'Sides & Salad', icon: '🥗' },
        { name: 'Drinks_Borhani', title: 'Drinks & Borhani', icon: '🥛' },
    ],
};

// --- TIME LOGIC ---
const isTimeInRange = (startHour, endHour) => {
  const now = new Date();
  const currentHour = now.getHours();

  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour < endHour;
  } else {
    return currentHour >= startHour || currentHour < endHour;
  }
};

// --- MENU AVAILABILITY ---
export const getMenuAvailability = (category) => {
  switch (category) {
    case 'Rater_menu':
      if (isTimeInRange(18, 4)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (৬টা সন্ধ্যা - ৪টা ভোর)" };
      return { available: false, message: "অর্ডার করা যাবে সন্ধ্যা ৬টা থেকে।" };

    case 'Diner_menu':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর ১২ টা - রাত ৯টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Tong_Smokestore':
      if (isTimeInRange(13, 4)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর ১২ টা - রাত ৪টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Groceries':
      if (isTimeInRange(12, 23)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর ১২ টা - রাত 11 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

      //  restaurant


    case 'Teheri_Ghor':
      if (isTimeInRange(12, 22)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 10 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Abesh_Hotel':
      if (isTimeInRange(12, 22)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Khana_s':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Uncle_Bobos':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'CP_Five_Star':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Shiraj_Chui':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Crimson_Cup':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Tasty_Treat':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Al_Arabian':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Teheri_Khan':
      if (isTimeInRange(12, 21)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - রাত 9 টা)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };


    // emergencies  


    case 'Pharmacy':
      if (isTimeInRange(13, 10)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - ৪টা ভোর)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ টা থেকে।" };

    case 'Sexual':
      if (isTimeInRange(13, 4)) 
        return { available: true, message: "এখন অর্ডার করা যাবে (দুপুর 12 টা - ৪টা ভোর)" };
      return { available: false, message: "অর্ডার করা যাবে দুপুর ১২ থেকে।" };

 


    default:
      return { available: true, message: "Available" };
  }
};

// --- WHATSAPP MESSAGE GENERATOR ---
export const generateWhatsAppLink = (order, isRiderView = false) => {
  // এখানে আইটেমের নামের সাথে shopName যোগ করা হয়েছে
  const itemsList = order.items
    .map(item => {
      const shop = item.shopName || "Oriental Street"; // যদি shopName না থাকে তবেই ডিফল্ট নাম বসবে
      return `${item.name} (x${item.quantity}) - [দোকান: ${shop}] @ ${item.price} Taka`;
    })
    .join('\n* ');

  const charge = order.customerDetails.deliveryCharge || 0;
  const targetPhoneNumber = isRiderView ? (order.customerDetails.phone || WHATSAPP_NUMBER) : WHATSAPP_NUMBER;

  let message;
  if (isRiderView) {
    message = `সুপ্রভাত/শুভ সন্ধ্যা, আমি ${APP_NAME} থেকে বলছি। আপনার অর্ডারের (ID: ${order.id.substring(0, 8)}...) ডেলিভারির জন্য যোগাযোগ করছি।`;
  } else {
    message =
      `*${APP_NAME} নতুন অর্ডার নিশ্চিতকরণ*\n\n` +
      `আমি আমার অর্ডারটি নিশ্চিত করছি। বিস্তারিত:\n` +
      `*ID:* ${order.id}\n` +
      `*খাবারের মোট:* ${order.totalAmount - charge} Taka\n` +
      `*ডেলিভারি চার্জ:* ${charge} Taka\n` +
      `*গ্র্যান্ড টোটাল:* ${order.totalAmount} Taka\n\n` +
      `*ডেলিভারির ঠিকানা:*\n` +
      `নাম: ${order.customerDetails.name}\n` +
      `ফোন: ${order.customerDetails.phone}\n` +
      `ঠিকানা: ${order.customerDetails.location}\n` +
      `রোড: ${order.customerDetails.road}\n` +
      `ব্লক: ${order.customerDetails.block}\n` +
      `হাউজ: ${order.customerDetails.house}\n` +
      `মন্তব্য: ${order.customerDetails.comment || 'N/A'}\n\n` +
      `*অর্ডার করা খাবার:*\n* ${itemsList}`; // এখানে এখন শপ নেমসহ লিস্ট দেখাবে
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${targetPhoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
};