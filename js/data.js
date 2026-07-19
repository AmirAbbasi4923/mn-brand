const products = [];

const perfumeData = [
  { id: 'p1', name: 'White Oud', sizes: [{size: '30ml', price: 1800}, {size: '50ml', price: 2400}] },
  { id: 'p2', name: 'Office for Man', sizes: [{size: '30ml', price: 1800}, {size: '50ml', price: 2400}] },
  { id: 'p3', name: 'Janan', sizes: [{size: '30ml', price: 1800}, {size: '50ml', price: 2400}] },
  { id: 'p4', name: 'Zarar', sizes: [{size: '30ml', price: 1800}, {size: '50ml', price: 2400}] },
  { id: 'p5', name: 'Alfaris', sizes: [{size: '30ml', price: 1600}, {size: '50ml', price: 2200}] },
  { id: 'p6', name: 'Sabaya', sizes: [{size: '30ml', price: 1600}, {size: '50ml', price: 2200}] },
  { id: 'p7', name: 'Fog Paradise', sizes: [{size: '30ml', price: 1600}, {size: '50ml', price: 2200}] },
  { id: 'p8', name: 'Blue Sea', sizes: [{size: '30ml', price: 1600}, {size: '50ml', price: 2200}] },
  { id: 'p9', name: 'Taigar', sizes: [{size: '30ml', price: 1500}, {size: '50ml', price: 2000}] },
  { id: 'p10', name: 'Rose', sizes: [{size: '30ml', price: 1500}, {size: '50ml', price: 2000}] },
  { id: 'p11', name: 'David Begam', sizes: [{size: '30ml', price: 1500}, {size: '50ml', price: 2000}] },
  { id: 'p12', name: 'Open', sizes: [{size: '30ml', price: 1800}, {size: '50ml', price: 2300}] },
  { id: 'p13', name: 'Marj', sizes: [{size: '30ml', price: 2200}, {size: '50ml', price: 2800}] },
  { id: 'p14', name: 'Motiya', sizes: [{size: '30ml', price: 1500}, {size: '50ml', price: 2000}] },
  { id: 'p15', name: 'Azaro Wanted', sizes: [{size: '30ml', price: 1650}, {size: '50ml', price: 2100}] }
];

perfumeData.forEach(item => {
  products.push({
    id: item.id,
    name: item.name,
    category: 'perfume',
    image: 'images/luxury_perfume.png',
    description: 'Premium Luxury Fragrance',
    sizes: item.sizes
  });
});

const watchData = [
  { id: 'alfajar1', brand: 'Al Fajr', name: "Beautiful Azan Muslim Al Fajr Gift Prayer Alarms Holy Qur'an Bookmark Mecca Sensor Qibla Compass Digital Waterproof Watch", price: 12000, image: 'images/alfajar1.avif', description: 'Luxury Al Fajr timepiece' },
  { id: 'alfajar2', brand: 'Al Fajr', name: 'Al Fajr WQ-18 Compass Watch (Grey)', price: 12000, image: 'images/alfajar2.jpg', description: 'Luxury Al Fajr timepiece' },
  { id: 'alfajar3', brand: 'Al Fajr', name: 'Al Fajar Stainless Steel Dual Time Watch with Azan, Qibla, Prayer Alarm', price: 12000, image: 'images/alfajar3.webp', description: 'Luxury Al Fajr timepiece' },
  { id: 'alfajar4', brand: 'Al Fajr', name: 'ALFAJR PREMIER 360 STONE DIAL', price: 12000, image: 'images/alfjar3.webp', description: 'Luxury Al Fajr timepiece' },
  { id: 'patek1', brand: 'Patek Philippe', name: "Patek Philippe 5711/1A-010 Automatic Black-Blue Dial Luxury Men's Watch, Mechanical, Self-winding", price: 3000, image: 'images/patek1.jpg', description: 'Exclusive Patek Philippe design' },
  { id: 'patek2', brand: 'Patek Philippe', name: 'Patek Philippe Geneve Nautilus Series Wrist Watch For Men', price: 2900, image: 'images/patek2.webp', description: 'Exclusive Patek Philippe design' },
  { id: 'patek3', brand: 'Patek Philippe', name: 'PATEK PHILIPPE NAUTILUS DIAMONDS TIFFANY & Co Blue Dial Limited Edition Watch', price: 2900, image: 'images/patek3.jpg', description: 'Exclusive Patek Philippe design' },
  { id: 'patek4', brand: 'Patek Philippe', name: "Patek Philippe Ladies' Nautilus 7118 Diamond-set Bezel — Brand New", price: 2900, image: 'images/patek4.jfif', description: 'Exclusive Patek Philippe design' },
  { id: 'rolex1', brand: 'Rolex', name: 'RLX Oyster Perpetual Luxury Chain Watch', price: 2800, image: 'images/rolex1.webp', description: 'Classic Rolex elegance' },
  { id: 'rolex2', brand: 'Rolex', name: 'Rolex Submariner 116610LV – The Hulk', price: 2800, image: 'images/rolex2.jpg', description: 'Classic Rolex elegance' },
  { id: 'rolex3', brand: 'Rolex', name: 'Rolex Submariner 41 126610', price: 2800, image: 'images/rolex3.webp', description: 'Classic Rolex elegance' }
];

watchData.forEach(item => {
  products.push({
    id: item.id,
    name: item.name,
    category: 'watch',
    brand: item.brand,
    image: item.image,
    description: item.description,
    price: item.price
  });
});

// Generate Electronics
const electronicsData = [
  { name: 'TWS Wireless Earbuds', price: 1500, desc: 'High-quality wireless earbuds with charging case and touch control.' }
];

electronicsData.forEach((item, index) => {
  products.push({
    id: `e${index + 1}`,
    name: item.name,
    category: 'electronics',
    image: 'images/luxury_electronics.png',
    description: item.desc,
    price: item.price
  });
});
