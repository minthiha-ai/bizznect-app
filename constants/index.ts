import home from '@/assets/icons/home.png';
import banner from '@/assets/images/banner.png';
import logo from '@/assets/images/logo.png';
import { Feather } from '@expo/vector-icons';

export const images = {
    logo,
    home
}

type FeatherIconName = keyof typeof Feather.glyphMap;

export const categories: { id: string; name: string; icon: FeatherIconName }[] = [
    { id: 'cat1', name: 'Gift', icon: 'gift' },
    { id: 'cat2', name: 'Fruits', icon: 'droplet' },
    { id: 'cat3', name: 'Tech', icon: 'cpu' },
    { id: 'cat4', name: 'Clothes', icon: 'shopping-bag' },
    { id: 'cat5', name: 'Books', icon: 'book-open' },
    { id: 'cat6', name: 'Beauty', icon: 'feather' },
    { id: 'cat7', name: 'Sports', icon: 'activity' },
];
export const categoryData = [
    { id: "c1", name: "Category", icon: "gift", color: "#F4EBFF", iconColor: "#A187DF" },
    { id: "c2", name: "Category", icon: "droplet", color: "#FFEAEA", iconColor: "#FF6363" },
    { id: "c3", name: "Category", icon: "coffee", color: "#FFF8E1", iconColor: "#FFB300" },
    // repeat as needed for demo grid
    { id: "c4", name: "Category", icon: "gift", color: "#F4EBFF", iconColor: "#A187DF" },
    { id: "c5", name: "Category", icon: "droplet", color: "#FFEAEA", iconColor: "#FF6363" },
    { id: "c6", name: "Category", icon: "coffee", color: "#FFF8E1", iconColor: "#FFB300" },
    { id: "c7", name: "Category", icon: "gift", color: "#F4EBFF", iconColor: "#A187DF" },
    { id: "c8", name: "Category", icon: "droplet", color: "#FFEAEA", iconColor: "#FF6363" },
    { id: "c9", name: "Category", icon: "coffee", color: "#FFF8E1", iconColor: "#FFB300" },
    { id: "c10", name: "Category", icon: "gift", color: "#F4EBFF", iconColor: "#A187DF" },
    { id: "c11", name: "Category", icon: "droplet", color: "#FFEAEA", iconColor: "#FF6363" },
    { id: "c12", name: "Category", icon: "coffee", color: "#FFF8E1", iconColor: "#FFB300" },
];
export const promoBanners = [
    {
        id: 'promo1',
        title: 'Super Flash Sale!',
        subtitle: 'Up to 50% off selected items.',
        image: banner,
        cta: 'Shop Now',
        backgroundColor: '#016FAE',
    },
    {
        id: 'promo2',
        title: 'Buy 1 Get 1 Free',
        subtitle: 'Limited time only. Don\'t miss out!',
        image: banner,
        cta: 'Grab Deal',
        backgroundColor: '#DC661F',
    },
];

export const ecomProducts = [
    {
        id: 'p1',
        name: 'Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
        price: '49,000 MMK',
        tag: 'Best Seller',
    },
    {
        id: 'p2',
        name: 'Smart Watch',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        price: '79,000 MMK',
        tag: 'Hot',
    },
    {
        id: 'p3',
        name: 'Bluetooth Speaker',
        image: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&w=400',
        price: '39,000 MMK',
    },
    {
        id: 'p4',
        name: 'Powerbank 20000mAh',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        price: '25,000 MMK',
    },
];

export const restaurantProducts = [
    {
        id: 'r1',
        name: 'Classic Burger',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
        desc: 'Classic burger with fries',
        price: '8,000 MMK',
    },
    {
        id: 'r2',
        name: 'Sushi Set',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        desc: 'Deluxe Sushi Set',
        price: '15,000 MMK',
    },
    {
        id: 'r3',
        name: 'Spicy Noodles',
        image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400',
        desc: 'Spicy Noodles',
        price: '6,000 MMK',
    },
    {
        id: 'r4',
        name: 'Chicken Salad',
        image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400',
        desc: 'Grilled Chicken Salad',
        price: '7,500 MMK',
    },
];

export const businesses = [
    {
        id: "biz1",
        name: "CodeCraft Co.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        city: "Yangon",
        tag: "Top Rated",
        desc: "Web & app development studio with a creative edge.",
        category: "IT & Software",
    },
    {
        id: "biz2",
        name: "Lotus Spa & Wellness",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        city: "Mandalay",
        tag: "Popular",
        desc: "Relax, recharge, and rejuvenate at our spa center.",
        category: "Health & Beauty",
    },
    {
        id: "biz3",
        name: "Green Grocers",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        city: "Naypyidaw",
        tag: "Organic",
        desc: "Fresh produce and organic groceries daily.",
        category: "Food & Grocery",
    },
    {
        id: "biz4",
        name: "TechFix Mobile",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
        city: "Yangon",
        tag: "Trusted",
        desc: "Phone & electronics repairs you can count on.",
        category: "Electronics",
    },
    {
        id: "biz5",
        name: "Cafe Azure",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        city: "Mandalay",
        tag: "Cozy",
        desc: "Your neighborhood spot for coffee and chill.",
        category: "Cafe & Bakery",
    },
    {
        id: "biz6",
        name: "City Bookstore",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
        city: "Naypyidaw",
        tag: "Readers' Choice",
        desc: "A wide selection of books and magazines.",
        category: "Books & Stationery",
    },
    {
        id: "biz7",
        name: "Eco Cleaners",
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
        city: "Yangon",
        tag: "Eco Friendly",
        desc: "Environmentally friendly laundry & dry cleaning.",
        category: "Cleaning Services",
    },
    {
        id: "biz8",
        name: "Elite Fitness",
        image: "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
        city: "Mandalay",
        tag: "Premium",
        desc: "Modern gym with professional trainers.",
        category: "Fitness",
    },
    {
        id: "biz9",
        name: "Sunrise Florist",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        city: "Naypyidaw",
        tag: "Fresh Daily",
        desc: "Bouquets for all occasions, delivery available.",
        category: "Flowers & Gifts",
    },
    {
        id: "biz10",
        name: "Trendy Styles",
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
        city: "Yangon",
        tag: "Fashion",
        desc: "Latest trends in men’s and women’s apparel.",
        category: "Clothing & Fashion",
    },
    {
        id: "biz11",
        name: "Speedy Delivery",
        image: "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
        city: "Mandalay",
        tag: "Express",
        desc: "Fast, reliable courier and delivery services.",
        category: "Logistics",
    },
    {
        id: "biz12",
        name: "Pixel Studio",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        city: "Yangon",
        tag: "Creative",
        desc: "Photography, design, and creative branding.",
        category: "Media & Design",
    },
    {
        id: "biz13",
        name: "Urban Motors",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
        city: "Naypyidaw",
        tag: "Certified",
        desc: "Quality used cars with warranty.",
        category: "Automotive",
    },
    {
        id: "biz14",
        name: "Golden Travels",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
        city: "Yangon",
        tag: "Top Agent",
        desc: "Custom tour packages and visa services.",
        category: "Travel & Tour",
    },
    {
        id: "biz15",
        name: "Rainbow Kids",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
        city: "Mandalay",
        tag: "Family",
        desc: "Toys, games, and kids’ activities.",
        category: "Children",
    },
    {
        id: "biz16",
        name: "IT Warehouse",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        city: "Naypyidaw",
        tag: "B2B",
        desc: "Wholesale computer and electronics supply.",
        category: "IT & Electronics",
    },
];

export const restaurants = [
    {
        id: 'r1',
        name: 'Sunrise Café',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        tag: 'Breakfast',
        city: 'Yangon',
        desc: 'Best for coffee and fresh pastries.',
        category: 'Cafe',
    },
    {
        id: 'r2',
        name: 'Lotus Thai Cuisine',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        tag: 'Hot',
        city: 'Mandalay',
        desc: 'Authentic Thai food, spicy and aromatic.',
        category: 'Thai',
    },
    {
        id: 'r3',
        name: 'Golden Sushi Bar',
        image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        tag: 'Best Seller',
        city: 'Naypyidaw',
        desc: 'Fresh sushi, sashimi, and rolls.',
        category: 'Japanese',
    },
    {
        id: 'r4',
        name: 'Bamboo Hotpot',
        image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
        tag: 'Family',
        city: 'Yangon',
        desc: 'Hearty hotpot with fresh ingredients.',
        category: 'Chinese',
    },
    {
        id: 'r5',
        name: 'Urban Grill',
        image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
        tag: 'Grill',
        city: 'Mandalay',
        desc: 'Steak, burgers, and BBQ specials.',
        category: 'Grill',
    },
    {
        id: 'r6',
        name: 'Fresh Greens Salad Bar',
        image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
        tag: 'Healthy',
        city: 'Naypyidaw',
        desc: 'Custom salads and fresh juices.',
        category: 'Salad Bar',
    },
    {
        id: 'r7',
        name: 'Riverside Pizza',
        image: 'https://images.unsplash.com/photo-1547592180-5c0b6ae46b7d?auto=format&fit=crop&w=400&q=80',
        tag: 'Pizza',
        city: 'Yangon',
        desc: 'Classic and creative pizzas by the river.',
        category: 'Italian',
    },
    {
        id: 'r8',
        name: 'Happy Bowl Noodle',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        tag: 'Noodles',
        city: 'Mandalay',
        desc: 'Homemade noodles, Asian soups, and sides.',
        category: 'Asian',
    },
];

export const coupons = [
    {
        id: 'c1',
        title: 'Save with vouchers',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        amount: '1000 MMK Off',
        type: 'ecommance offers',
        code: 'ENJOY2025',
        bgColor: 'bg-blue-100'
    },
    {
        id: 'c2',
        title: 'Rainy Season Promotion',
        image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
        amount: '20% Off',
        type: 'ecommance offers',
        code: 'RAIN2025',
        bgColor: 'bg-gray-200'
    },
    {
        id: 'c3',
        title: 'This Month Promotion',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        amount: '3000 MMK Off',
        type: 'ecommance offers',
        code: 'MONTH2025',
        bgColor: 'bg-gray-200'
    },
    {
        id: 'c4',
        title: 'Rainy Season Promotion',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
        amount: '10% Off',
        type: 'ecommance offers',
        code: 'RAIN2025',
        bgColor: 'bg-gray-200'
    },
];
