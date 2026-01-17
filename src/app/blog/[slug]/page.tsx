'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, ArrowRight } from 'lucide-react';

const blogData: Record<string, {
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
  image: string;
  color: string;
  textColor: string;
}> = {
  'physiotherapy-benefits': {
    title: 'How Physiotherapy Can Transform Your Daily Life',
    excerpt: 'A deep dive into how regular physiotherapy sessions can improve mobility, reduce pain, and enhance your quality of life.',
    content: [
      'Physiotherapy is more than just a treatment for injuries—it\'s a pathway to better health and improved quality of life. Whether you\'re recovering from surgery, managing chronic pain, or simply looking to improve your mobility, physiotherapy offers personalized solutions tailored to your needs.',
      'One of the most significant benefits of physiotherapy is pain management. Through targeted exercises, manual therapy, and other techniques, physiotherapists help reduce pain without relying solely on medication. This approach addresses the root cause of pain rather than just masking symptoms.',
      'Improved mobility and flexibility are also key outcomes of regular physiotherapy sessions. As we age or recover from injuries, our range of motion can become limited. Physiotherapy exercises are designed to gradually restore and even enhance your flexibility, making everyday activities easier and more comfortable.',
      'For athletes and active individuals, physiotherapy plays a crucial role in injury prevention. By identifying weaknesses and imbalances in your body, physiotherapists can create exercise programs that strengthen vulnerable areas and reduce the risk of future injuries.',
      'Mental health benefits shouldn\'t be overlooked either. The connection between physical and mental well-being is well-documented. Regular physiotherapy sessions can help reduce stress, improve sleep quality, and boost overall mood through the release of endorphins during exercise.',
      'At H2H Healthcare, our team of expert physiotherapists is dedicated to helping you achieve your health goals. We offer personalized treatment plans, home visits, and ongoing support to ensure you get the best possible care.',
    ],
    category: 'Physiotherapy',
    author: 'Dr. Priya Sharma',
    authorImage: 'https://api.dicebear.com/9.x/lorelei/svg?seed=DrPriya&backgroundColor=b6e3f4',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop',
    color: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  'sports-injury-recovery': {
    title: 'Sports Injury Recovery Guide',
    excerpt: 'How we improved recovery time by 40% through specialized rehabilitation programs designed for athletes.',
    content: [
      'Sports injuries can be devastating for athletes at any level. Whether you\'re a professional competitor or a weekend warrior, an injury can sideline you and affect your performance long after you return to play. That\'s why proper rehabilitation is essential.',
      'Our specialized sports rehabilitation program focuses on three key phases: acute care, rehabilitation, and return to sport. Each phase is carefully designed to optimize healing while preventing re-injury.',
      'During the acute phase, we focus on reducing inflammation and pain while protecting the injured area. This might include rest, ice, compression, and elevation (RICE), along with gentle range-of-motion exercises.',
      'The rehabilitation phase is where the real work begins. Through progressive strengthening exercises, balance training, and sport-specific drills, we help rebuild strength and confidence in the injured area.',
      'What sets our program apart is our focus on the return-to-sport phase. We don\'t just get you back to baseline—we work to make you stronger and more resilient than before. This includes performance testing, gradual return protocols, and ongoing monitoring.',
      'Our data shows that athletes who complete our full rehabilitation program have a 40% faster recovery time and significantly lower re-injury rates compared to those who rush back to activity.',
    ],
    category: 'Sports Rehab',
    author: 'Dr. Amit Patel',
    authorImage: 'https://api.dicebear.com/9.x/lorelei/svg?seed=DrAmit&backgroundColor=c0aede',
    date: 'Jan 12, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
    color: 'bg-teal-50',
    textColor: 'text-teal-600',
  },
  'home-exercises': {
    title: '5 Home Exercises for Back Pain',
    excerpt: 'Simple exercises you can do at home to relieve back pain and improve posture without any equipment.',
    content: [
      'Back pain affects millions of people worldwide and is one of the leading causes of disability. The good news is that many cases of back pain can be managed with simple exercises you can do at home.',
      'Exercise 1: Cat-Cow Stretch - Start on your hands and knees. Arch your back up like a cat, then drop your belly toward the floor while lifting your head. Repeat 10-15 times to improve spine flexibility.',
      'Exercise 2: Bird Dog - From hands and knees, extend your right arm and left leg simultaneously, keeping your core engaged. Hold for 5 seconds, then switch sides. This strengthens your core and improves balance.',
      'Exercise 3: Knee-to-Chest Stretch - Lie on your back and pull one knee toward your chest, holding for 20-30 seconds. This stretches the lower back and hip muscles.',
      'Exercise 4: Bridge - Lie on your back with knees bent. Lift your hips off the ground, squeezing your glutes at the top. Hold for 5 seconds and repeat 10-15 times to strengthen your lower back and glutes.',
      'Exercise 5: Child\'s Pose - Kneel on the floor and sit back on your heels, reaching your arms forward on the ground. Hold for 30 seconds to stretch your back and relax your spine.',
      'Remember to consult with a healthcare professional before starting any exercise program, especially if you have chronic pain or underlying conditions.',
    ],
    category: 'Pain Management',
    author: 'Dr. Sneha Reddy',
    authorImage: 'https://api.dicebear.com/9.x/lorelei/svg?seed=DrSneha&backgroundColor=ffd5dc',
    date: 'Jan 10, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  'cardiac-rehabilitation': {
    title: 'Cardiac Rehabilitation: What to Expect',
    excerpt: 'We reimagined cardiac care to make it faster to recover, easier to follow, and actually helpful.',
    content: [
      'Cardiac rehabilitation is a medically supervised program designed to improve cardiovascular health after a heart attack, heart surgery, or other cardiac events. It\'s one of the most effective ways to recover and reduce the risk of future heart problems.',
      'Our cardiac rehab program consists of three main components: exercise training, education, and counseling. Each component is tailored to your specific needs and health status.',
      'Exercise training is the cornerstone of cardiac rehabilitation. Under careful supervision, you\'ll participate in aerobic exercises, strength training, and flexibility work. We start slowly and gradually increase intensity as your heart grows stronger.',
      'Education is equally important. You\'ll learn about heart-healthy nutrition, medication management, stress reduction, and lifestyle modifications that can significantly improve your heart health.',
      'Counseling and support help address the emotional aspects of heart disease. Many patients experience anxiety or depression after a cardiac event, and our team is here to provide the support you need.',
      'Studies show that patients who complete cardiac rehabilitation have a 25% lower risk of dying from heart disease and a significantly improved quality of life. At H2H Healthcare, we\'re committed to helping you achieve the best possible outcomes.',
    ],
    category: 'Cardiac Care',
    author: 'Dr. Rajesh Kumar',
    authorImage: 'https://api.dicebear.com/9.x/lorelei/svg?seed=DrRajesh&backgroundColor=d1d4f9',
    date: 'Jan 8, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=600&fit=crop',
    color: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  'yoga-wellness': {
    title: 'Yoga & Wellness Tips for Better Health',
    excerpt: 'Discover how yoga can complement your physiotherapy journey for holistic wellness and mental peace.',
    content: [
      'Yoga has been practiced for thousands of years, and modern science continues to validate its numerous health benefits. When combined with physiotherapy, yoga can accelerate healing and promote overall wellness.',
      'One of the primary benefits of yoga is improved flexibility. Through gentle stretching and holding poses, yoga helps lengthen muscles and increase range of motion—complementing the goals of physiotherapy.',
      'Yoga also strengthens muscles, particularly the core muscles that support your spine. A strong core is essential for good posture and can help prevent back pain and injuries.',
      'The breathing techniques (pranayama) practiced in yoga have profound effects on the nervous system. Deep, controlled breathing activates the parasympathetic nervous system, reducing stress and promoting relaxation.',
      'Mind-body connection is another key aspect of yoga. By focusing on breath and movement, yoga helps you become more aware of your body, which can aid in identifying and addressing physical issues early.',
      'At H2H Healthcare, we offer yoga and wellness programs that complement our physiotherapy services. Our certified instructors work closely with our physiotherapists to create integrated treatment plans for optimal results.',
    ],
    category: 'Wellness',
    author: 'Dr. Priya Sharma',
    authorImage: 'https://api.dicebear.com/9.x/lorelei/svg?seed=DrPriya&backgroundColor=b6e3f4',
    date: 'Jan 5, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop',
    color: 'bg-green-50',
    textColor: 'text-green-600',
  },
  'geriatric-care': {
    title: 'Geriatric Care: Supporting Elderly Mobility',
    excerpt: 'Specialized care approaches for elderly patients to maintain independence and quality of life.',
    content: [
      'As we age, maintaining mobility becomes increasingly important for independence and quality of life. Geriatric physiotherapy focuses on the unique needs of older adults, helping them stay active and healthy.',
      'Falls are a major concern for elderly individuals, often leading to serious injuries and loss of independence. Our geriatric care program includes balance training and fall prevention strategies to keep you safe.',
      'Joint stiffness and arthritis are common in older adults. Through gentle exercises, manual therapy, and pain management techniques, we help reduce discomfort and improve joint function.',
      'Maintaining muscle strength is crucial as we age. Our strength training programs are designed specifically for older adults, focusing on functional movements that support daily activities.',
      'We also address cognitive aspects of movement. Exercises that challenge both the body and mind can help maintain cognitive function and reduce the risk of dementia.',
      'At H2H Healthcare, we understand that every elderly patient is unique. Our geriatric care specialists create personalized treatment plans that respect your limitations while helping you achieve your goals.',
    ],
    category: 'Geriatric Care',
    author: 'Dr. Rajesh Kumar',
    authorImage: 'https://api.dicebear.com/9.x/lorelei/svg?seed=DrRajesh&backgroundColor=d1d4f9',
    date: 'Jan 3, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop',
    color: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
};

const relatedPosts = [
  { slug: 'physiotherapy-benefits', title: 'How Physiotherapy Can Transform Your Daily Life', category: 'Physiotherapy' },
  { slug: 'sports-injury-recovery', title: 'Sports Injury Recovery Guide', category: 'Sports Rehab' },
  { slug: 'home-exercises', title: '5 Home Exercises for Back Pain', category: 'Pain Management' },
];

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogData[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[32px] font-medium text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-500 mb-8">The article you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-[900px] mx-auto">
              <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium bg-white/90 ${post.textColor} mb-4`}>
                {post.category}
              </span>
              <h1 className="text-[32px] md:text-[44px] font-medium text-white leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[14px] text-white/80">
                <span className="flex items-center gap-2">
                  <img src={post.authorImage} alt={post.author} className="w-8 h-8 rounded-full" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[900px] mx-auto px-6 py-12">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-cyan-600 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-[16px] text-gray-600 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Share & Save */}
          <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-100">
            <Button variant="outline" className="h-10 px-4 rounded-full text-[13px]">
              <Share2 className="mr-2 h-4 w-4" />
              Share Article
            </Button>
            <Button variant="outline" className="h-10 px-4 rounded-full text-[13px]">
              <Bookmark className="mr-2 h-4 w-4" />
              Save for Later
            </Button>
          </div>

          {/* Author Card */}
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-start gap-4">
              <img src={post.authorImage} alt={post.author} className="w-16 h-16 rounded-full" />
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Written by</p>
                <h3 className="text-[18px] font-medium text-gray-900 mb-2">{post.author}</h3>
                <p className="text-[14px] text-gray-500">
                  Expert physiotherapist at H2H Healthcare with over 10 years of experience in rehabilitation and wellness.
                </p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-16">
            <h2 className="text-[24px] font-medium text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.filter(p => p.slug !== slug).slice(0, 3).map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                  <div className="p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                    <span className="text-[11px] text-cyan-600 font-medium">{relatedPost.category}</span>
                    <h3 className="text-[15px] font-medium text-gray-900 mt-2 group-hover:text-cyan-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[13px] text-gray-400 mt-3 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl text-center">
            <h2 className="text-[24px] font-medium text-white mb-3">Need Expert Guidance?</h2>
            <p className="text-[15px] text-white/80 mb-6 max-w-md mx-auto">
              Book a consultation with our specialists and start your journey to better health.
            </p>
            <Button className="h-11 px-8 bg-white text-cyan-600 hover:bg-gray-100 rounded-full text-[14px] font-medium" asChild>
              <Link href="/booking">
                Book Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
