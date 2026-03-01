'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { ArrowRight, ArrowLeft } from "lucide-react";

type ServiceColor = 'red' | 'blue' | 'green' | 'purple' | 'teal' | 'orange' | 'cyan';

const servicesData: Record<string, {
  title: string;
  description: string;
  details: string;
  benefits: string[];
  process: { step: string; title: string; description: string }[];
  image: string;
  color: ServiceColor;
}> = {
  // 1. Pain Relief & Physiotherapy Care
  'pain_relief_physiotherapy': {
    title: 'Pain Relief & Physiotherapy Care',
    description: 'Comprehensive pain relief and mobilization therapy for chronic and acute conditions using evidence-based treatment approaches.',
    details: 'We understand that chronic pain affects every aspect of your life. Our pain management specialists use a combination of manual therapy, therapeutic exercises, and modern modalities to help you regain control. We focus on treating the root cause, not just the symptoms, ensuring long-term relief and improved quality of life.',
    benefits: [
      'Long-term pain relief without dependency on medication',
      'Improved mobility and functional capacity',
      'Personalized treatment plans for your specific condition',
      'Evidence-based therapeutic approaches',
      'Home exercise programs for continued improvement',
      'Holistic care addressing physical and lifestyle factors'
    ],
    process: [
      { step: '01', title: 'Pain Assessment', description: 'Detailed evaluation of pain patterns, triggers, and impact on daily life' },
      { step: '02', title: 'Diagnosis', description: 'Identifying the root cause using clinical examination and diagnostic tools' },
      { step: '03', title: 'Treatment', description: 'Multi-modal approach combining manual therapy, exercises, and modalities' },
      { step: '04', title: 'Maintenance', description: 'Long-term strategies and home programs for sustained relief' },
    ],
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
    color: 'red',
  },

  // 2. Advanced Rehabilitation & Recovery
  'advanced_rehabilitation': {
    title: 'Advanced Rehabilitation & Recovery',
    description: 'Specialized rehabilitation for orthopedic, neurological, and post-surgical conditions with comprehensive recovery programs.',
    details: 'Our advanced rehabilitation services address complex conditions including stroke recovery, spinal cord injuries, joint replacements, and post-surgical rehabilitation. Each program is designed by expert physiotherapists using the latest evidence-based protocols to ensure optimal outcomes and faster return to normal life.',
    benefits: [
      'Faster recovery from surgeries and injuries',
      'Specialized neurological rehabilitation protocols',
      'Advanced equipment and therapeutic techniques',
      'Multidisciplinary approach to complex conditions',
      'Regular progress monitoring and plan adjustments',
      'Family education and involvement in care'
    ],
    process: [
      { step: '01', title: 'Comprehensive Assessment', description: 'Detailed evaluation of functional limitations and recovery potential' },
      { step: '02', title: 'Goal Setting', description: 'Collaborative goal-setting with patient and family' },
      { step: '03', title: 'Intensive Therapy', description: 'Structured rehabilitation with progressive challenges' },
      { step: '04', title: 'Transition Planning', description: 'Preparation for return to daily activities and independence' },
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    color: 'blue',
  },

  // 3. Nutrition & Lifestyle Care
  'nutrition_lifestyle': {
    title: 'Nutrition & Lifestyle Care',
    description: 'Personalized nutrition plans and lifestyle modification coaching for athletes and health-conscious individuals.',
    details: 'Our certified nutritionists work with you to create sustainable eating habits and lifestyle changes. From sports nutrition to weight management, diabetes care to heart health, we provide science-backed guidance tailored to your health goals and lifestyle preferences.',
    benefits: [
      'Personalized nutrition plans based on your goals',
      'Sports-specific nutrition for peak performance',
      'Weight management with sustainable approaches',
      'Disease-specific dietary guidance',
      'Lifestyle modification coaching',
      'Regular monitoring and plan adjustments'
    ],
    process: [
      { step: '01', title: 'Nutritional Assessment', description: 'Comprehensive evaluation of current diet and health status' },
      { step: '02', title: 'Goal Definition', description: 'Setting realistic and achievable nutrition goals' },
      { step: '03', title: 'Plan Creation', description: 'Customized meal plans and dietary recommendations' },
      { step: '04', title: 'Follow-up', description: 'Regular check-ins and plan optimization' },
    ],
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
    color: 'green',
  },

  // 4. Mental Wellness & Performance Care
  'mental_wellness': {
    title: 'Mental Wellness & Performance Care',
    description: 'Sports psychology, stress management, and mental performance coaching for peak mental fitness.',
    details: 'Mental health is crucial for overall wellbeing and performance. Our specialists help athletes and professionals manage stress, anxiety, and optimize their mental game through proven psychological techniques. We address performance anxiety, burnout, and help develop mental resilience.',
    benefits: [
      'Enhanced mental performance and focus',
      'Stress and anxiety management techniques',
      'Improved sleep quality and recovery',
      'Performance anxiety resolution',
      'Mental resilience building',
      'Work-life balance optimization'
    ],
    process: [
      { step: '01', title: 'Mental Assessment', description: 'Evaluation of mental health status and performance barriers' },
      { step: '02', title: 'Strategy Development', description: 'Creating personalized mental performance strategies' },
      { step: '03', title: 'Skill Training', description: 'Learning and practicing mental techniques' },
      { step: '04', title: 'Integration', description: 'Applying skills in real-world situations' },
    ],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    color: 'purple',
  },

  // 5. Therapeutic Yoga & Wellness
  'therapeutic_yoga': {
    title: 'Therapeutic Yoga & Wellness',
    description: 'Yoga sessions designed for healing, rehabilitation, and promoting overall mind-body wellness.',
    details: 'Our yoga programs are designed by certified instructors with healthcare backgrounds. Whether you\'re recovering from an injury, managing chronic conditions, or seeking preventive care, our sessions adapt to your abilities and goals. We combine traditional yoga with therapeutic techniques for optimal results.',
    benefits: [
      'Improved flexibility and mobility',
      'Stress reduction and mental clarity',
      'Better breathing and respiratory health',
      'Enhanced body awareness',
      'Improved sleep quality',
      'Complementary support for rehabilitation'
    ],
    process: [
      { step: '01', title: 'Consultation', description: 'Understanding your health status and wellness goals' },
      { step: '02', title: 'Program Design', description: 'Creating a customized yoga routine for your needs' },
      { step: '03', title: 'Guided Sessions', description: 'Expert-led yoga and breathing exercises' },
      { step: '04', title: 'Home Practice', description: 'Guidance for daily practice and integration' },
    ],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    color: 'teal',
  },

  // 6. Sports Performance & Athlete Development
  'sports_performance': {
    title: 'Sports Performance & Athlete Development',
    description: 'Integrated sports performance analysis, injury prevention, and athletic training programs.',
    details: 'Our sports performance team combines biomechanical analysis, strength conditioning, and injury prevention to help athletes reach their peak potential. From amateur to professional, we use cutting-edge technology and evidence-based training methods to elevate your game and keep you injury-free.',
    benefits: [
      'Comprehensive performance assessment',
      'Biomechanical analysis and correction',
      'Sport-specific training programs',
      'Injury prevention strategies',
      'Return-to-sport protocols',
      'Performance monitoring and optimization'
    ],
    process: [
      { step: '01', title: 'Performance Testing', description: 'Comprehensive fitness and movement assessment' },
      { step: '02', title: 'Analysis', description: 'Biomechanical and performance data analysis' },
      { step: '03', title: 'Training Program', description: 'Customized training for your sport and goals' },
      { step: '04', title: 'Progress Tracking', description: 'Regular testing and program optimization' },
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    color: 'orange',
  },

  // 7. Digital Health & Web Solutions
  'digital_health': {
    title: 'Digital Health & Web Solutions',
    description: 'Tele-rehabilitation, virtual assessments, and remote health monitoring for convenient care.',
    details: 'Access quality healthcare from anywhere with our digital health solutions. Our tele-rehabilitation services, virtual consultations, and remote monitoring ensure you stay on track with your health goals. Perfect for busy professionals, remote locations, or those who prefer the convenience of home-based care.',
    benefits: [
      'Access care from anywhere',
      'Flexible scheduling options',
      'Video consultations with experts',
      'Remote progress monitoring',
      'Digital exercise programs',
      'Wearable device integration'
    ],
    process: [
      { step: '01', title: 'Virtual Consultation', description: 'Initial assessment via video call' },
      { step: '02', title: 'Digital Assessment', description: 'Remote evaluation using digital tools' },
      { step: '03', title: 'Online Treatment', description: 'Guided sessions and exercise programs' },
      { step: '04', title: 'Remote Monitoring', description: 'Track progress with digital tools' },
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    color: 'cyan',
  },
};

// Color utility function
const getColorClasses = (color: ServiceColor) => {
  const colors = {
    red: { bg: 'bg-red-500', bgLight: 'bg-red-100', text: 'text-red-600', hover: 'hover:bg-red-600', hex: '#ef4444' },
    blue: { bg: 'bg-blue-500', bgLight: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-600', hex: '#3b82f6' },
    green: { bg: 'bg-green-500', bgLight: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-600', hex: '#22c55e' },
    purple: { bg: 'bg-purple-500', bgLight: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-600', hex: '#a855f7' },
    teal: { bg: 'bg-teal-500', bgLight: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-600', hex: '#14b8a6' },
    orange: { bg: 'bg-orange-500', bgLight: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-600', hex: '#f97316' },
    cyan: { bg: 'bg-cyan-500', bgLight: 'bg-cyan-100', text: 'text-cyan-600', hover: 'hover:bg-cyan-600', hex: '#06b6d4' },
  };
  return colors[color] || colors.cyan;
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[32px] font-medium text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-500 mb-8">The service you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const colors = getColorClasses(service.color);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-700 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-12 bg-cyan-500 rounded-full" />
                  <h1 className="text-[36px] md:text-[48px] font-semibold text-gray-900 tracking-tight leading-tight">
                    {service.title}
                  </h1>
                </div>
                <p className="text-[17px] text-gray-700 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                  {service.details}
                </p>
                <Button 
                  className="h-12 px-8 text-[14px] font-medium rounded-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  asChild
                >
                  <Link href={`/booking?service=${slug}`}>
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent`} />
                </div>
                <div className="absolute -z-10 -right-4 -bottom-4 w-full h-full rounded-2xl bg-cyan-100" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-[28px] md:text-[36px] font-medium text-gray-900 tracking-tight mb-4">
                Benefits of{' '}
                <Highlighter action="underline" color="#06b6d4" isView>
                  {service.title}
                </Highlighter>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full mt-2 bg-cyan-500" />
                    <p className="text-[15px] text-gray-700">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-[28px] md:text-[36px] font-medium text-gray-900 tracking-tight mb-4">
                Our Process
              </h2>
              <p className="text-[15px] text-gray-500 max-w-xl mx-auto">
                A structured approach to ensure the best outcomes for your recovery
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-[20px] font-medium text-cyan-600">{step.step}</span>
                  </div>
                  <h3 className="text-[16px] font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-[14px] text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-cyan-500 to-teal-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <h2 className="text-[28px] md:text-[36px] font-medium text-white tracking-tight mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[15px] text-white/80 max-w-xl mx-auto mb-8">
              Book your appointment today and take the first step towards recovery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="h-12 px-8 text-[14px] font-medium bg-white hover:bg-gray-100 text-gray-900 rounded-full"
                asChild
              >
                <Link href={`/booking?service=${slug}`}>
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                className="h-12 px-8 text-[14px] font-medium bg-transparent border border-white/50 text-white hover:bg-white/10 rounded-full"
                asChild
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
