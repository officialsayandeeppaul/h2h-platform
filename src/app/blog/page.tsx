'use client';

import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Highlighter } from '@/components/ui/highlighter';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';

const blogPosts = [
  {
    slug: 'physiotherapy-benefits',
    title: 'How Physiotherapy Can Transform Your Daily Life',
    excerpt: 'A deep dive into how regular physiotherapy sessions can improve mobility, reduce pain, and enhance your quality of life.',
    category: 'Physiotherapy',
    author: 'Dr. Priya Sharma',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop',
    color: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    slug: 'sports-injury-recovery',
    title: 'Sports Injury Recovery Guide',
    excerpt: 'How we improved recovery time by 40% through specialized rehabilitation programs designed for athletes.',
    category: 'Sports Rehab',
    author: 'Dr. Amit Patel',
    date: 'Jan 12, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
    color: 'bg-teal-50',
    textColor: 'text-teal-600',
  },
  {
    slug: 'home-exercises',
    title: '5 Home Exercises for Back Pain',
    excerpt: 'Simple exercises you can do at home to relieve back pain and improve posture without any equipment.',
    category: 'Pain Management',
    author: 'Dr. Sneha Reddy',
    date: 'Jan 10, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    slug: 'cardiac-rehabilitation',
    title: 'Cardiac Rehabilitation: What to Expect',
    excerpt: 'We reimagined cardiac care to make it faster to recover, easier to follow, and actually helpful.',
    category: 'Cardiac Care',
    author: 'Dr. Rajesh Kumar',
    date: 'Jan 8, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=500&fit=crop',
    color: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    slug: 'yoga-wellness',
    title: 'Yoga & Wellness Tips for Better Health',
    excerpt: 'Discover how yoga can complement your physiotherapy journey for holistic wellness and mental peace.',
    category: 'Wellness',
    author: 'Dr. Priya Sharma',
    date: 'Jan 5, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
    color: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    slug: 'geriatric-care',
    title: 'Geriatric Care: Supporting Elderly Mobility',
    excerpt: 'Specialized care approaches for elderly patients to maintain independence and quality of life.',
    category: 'Geriatric Care',
    author: 'Dr. Rajesh Kumar',
    date: 'Jan 3, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop',
    color: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1200px] mt-24 mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* <p className="text-[13px] text-cyan-600 font-medium mb-3">Our Blog</p> */}
            <h1 className="text-[36px] md:text-[48px] font-medium text-gray-900 tracking-tight leading-tight mb-6">
              Health{' '}
              <Highlighter action="highlight" color="#87CEFA" isView>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                  Insights & Tips
                </span>
              </Highlighter>
            </h1>
            <p className="text-[16px] text-gray-600 max-w-2xl mx-auto">
              Explore our collection of articles on health, wellness, recovery tips, and expert advice from our medical professionals.
            </p>
          </div>

          {/* Featured Post */}
          <Link href={`/blog/${blogPosts[0].slug}`} className="block mb-12 group">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-3xl overflow-hidden">
              <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium ${blogPosts[0].color} ${blogPosts[0].textColor} mb-4`}>
                  {blogPosts[0].category}
                </span>
                <h2 className="text-[28px] font-medium text-gray-900 mb-4 leading-tight group-hover:text-cyan-600 transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-[13px] text-gray-400 mb-6">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {blogPosts[0].author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-cyan-600 font-medium group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-medium ${post.color} ${post.textColor}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[17px] font-medium text-gray-900 mb-2 leading-tight group-hover:text-cyan-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-[12px] text-gray-400">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
