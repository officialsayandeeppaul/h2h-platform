import {
  Activity,
  Heart,
  Dumbbell,
  Leaf,
  Video,
  Calendar,
  MapPin,
  Phone,
  Users,
  Award,
  Trophy,
} from "lucide-react";

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Heart,
  Dumbbell,
  Leaf,
};

export const stats = [
  { label: "Happy Patients", value: 1000, suffix: "+", icon: Users },
  { label: "Expert Doctors", value: 50, suffix: "+", icon: Award },
  { label: "Cities", value: 8, suffix: "+", icon: MapPin },
  { label: "Success Rate", value: 98, suffix: "%", icon: Trophy },
];

export const features = [
  {
    title: "Expert Physiotherapists",
    description: "Certified professionals with 10+ years of clinical experience",
    icon: Video,
  },
  {
    title: "Home Visits Available",
    description: "Get treated in the comfort of your home, no travel needed",
    icon: Calendar,
  },
  {
    title: "Personalized Care Plans",
    description: "Treatment tailored to your specific condition and goals",
    icon: MapPin,
  },
  {
    title: "Quick Recovery Focus",
    description: "Evidence-based methods for faster, lasting results",
    icon: Phone,
  },
];

export const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Professional Cricketer",
    content: "H2H helped me recover from my ACL injury in record time. The physiotherapists are world-class!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "IT Professional",
    content: "After years of back pain, I finally found relief with their pain management program.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Fitness Enthusiast",
    content: "The sports rehab team understood my needs perfectly. Back to my routine in no time!",
    rating: 5,
  },
];

export const trustedTeams = [
  'Mumbai Indians',
  'Chennai Super Kings',
  'Royal Challengers',
  'Delhi Capitals',
  'Kolkata Knight Riders',
  'Punjab Kings',
  'Rajasthan Royals',
  'Sunrisers Hyderabad',
  'Indian Cricket Team',
  'ISL Teams',
];

export const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
];

export const treatmentSteps = [
  { step: '01', title: 'Assessment', desc: 'Comprehensive evaluation of your condition', color: 'cyan' },
  { step: '02', title: 'Custom Plan', desc: 'Personalized treatment plan for you', color: 'blue' },
  { step: '03', title: 'Treatment', desc: 'Expert-guided therapy sessions', color: 'teal' },
  { step: '04', title: 'Recovery', desc: 'Ongoing support for lasting results', color: 'emerald' },
];

export const timeSlots = ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'];

export const blogPosts = [
  {
    href: '/blog/physiotherapy-benefits',
    title: 'How Physiotherapy Can Transform Your Daily Life',
    description: 'A deep dive into how regular physiotherapy sessions can improve mobility, reduce pain, and enhance your quality of life.',
    color: 'cyan',
    size: 'large',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=300&fit=crop',
  },
  {
    href: '/blog/sports-injury-recovery',
    title: 'Sports Injury Recovery Guide',
    description: 'How we improved recovery time by 40% through specialized rehabilitation programs.',
    color: 'teal',
    size: 'small',
  },
  {
    href: '/blog/home-exercises',
    title: '5 Home Exercises for Back Pain',
    description: 'Simple exercises you can do at home to relieve back pain and improve posture.',
    color: 'orange',
    size: 'small',
  },
  {
    href: '/blog/cardiac-rehabilitation',
    title: 'Cardiac Rehabilitation: What to Expect',
    description: 'We reimagined cardiac care to make it faster to recover, easier to follow, and actually helpful.',
    color: 'purple',
    size: 'medium',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=150&h=150&fit=crop',
  },
  {
    href: '/blog/yoga-wellness',
    title: 'Yoga & Wellness Tips',
    description: 'Discover how yoga can complement your physiotherapy journey for holistic wellness.',
    color: 'green',
    size: 'small',
  },
];

export const galleryItems = [
  { id: '1', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', height: 280, title: 'Modern Equipment', description: 'Latest physiotherapy tools' },
  { id: '2', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=500&fit=crop', height: 350, title: 'Therapy Rooms', description: 'Private treatment spaces' },
  { id: '3', img: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=350&fit=crop', height: 240, title: 'Rehabilitation Center', description: 'Full recovery support' },
  { id: '4', img: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop', height: 320, title: 'Exercise Area', description: 'Guided workout sessions' },
  { id: '5', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=380&fit=crop', height: 260, title: 'Gym Facilities', description: 'Strength training equipment' },
  { id: '6', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=420&fit=crop', height: 300, title: 'Consultation Room', description: 'Expert assessments' },
  { id: '7', img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=350&fit=crop', height: 250, title: 'Hydrotherapy', description: 'Water-based treatments' },
  { id: '8', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', height: 280, title: 'Recovery Zone', description: 'Rest and recuperation' },
];

export const mapMarkers = [
  { lat: 28.6139, lng: 77.209, size: 0.8 },   // New Delhi - HQ (larger)
  { lat: 19.076, lng: 72.8777, size: 0.5 },   // Mumbai
  { lat: 12.9716, lng: 77.5946, size: 0.5 },  // Bangalore
  { lat: 13.0827, lng: 80.2707, size: 0.4 },  // Chennai
  { lat: 22.5726, lng: 88.3639, size: 0.4 },  // Kolkata
  { lat: 17.385, lng: 78.4867, size: 0.4 },   // Hyderabad
  { lat: 25.2048, lng: 55.2708, size: 0.35 }, // Dubai
  { lat: 1.3521, lng: 103.8198, size: 0.35 }, // Singapore
  { lat: 51.5074, lng: -0.1278, size: 0.35 }, // London
  { lat: 40.7128, lng: -74.006, size: 0.35 }, // New York
];

export const globePositions = [
  { top: 50, left: 95 },      // 0°
  { top: 89, left: 72.5 },    // 60°
  { top: 89, left: 27.5 },    // 120°
  { top: 50, left: 5 },       // 180°
  { top: 11, left: 27.5 },    // 240°
  { top: 11, left: 72.5 },    // 300°
];

export const avatarUrls = [
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=RS&backgroundColor=b6e3f4",
    profileUrl: "#",
  },
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PP&backgroundColor=c0aede",
    profileUrl: "#",
  },
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AK&backgroundColor=d1d4f9",
    profileUrl: "#",
  },
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MS&backgroundColor=ffd5dc",
    profileUrl: "#",
  },
];

export const loreleiAvatars = [
  { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient1&backgroundColor=b6e3f4', profileUrl: '#' },
  { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient2&backgroundColor=c0aede', profileUrl: '#' },
  { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient3&backgroundColor=d1d4f9', profileUrl: '#' },
  { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient4&backgroundColor=ffd5dc', profileUrl: '#' },
];
