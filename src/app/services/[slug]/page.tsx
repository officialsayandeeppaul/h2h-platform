'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { ArrowRight, ArrowLeft } from "lucide-react";

const servicesData: Record<string, {
  title: string;
  description: string;
  details: string;
  benefits: string[];
  process: { step: string; title: string; description: string }[];
  image: string;
  color: 'cyan' | 'teal';
}> = {
  'sports_rehab': {
    title: 'Sports Rehabilitation',
    description: 'Get back to peak performance with our specialized sports injury treatment and prevention programs designed for athletes of all levels.',
    details: 'Our sports rehabilitation program combines advanced therapeutic techniques with personalized training protocols. We work with professional athletes and weekend warriors alike to ensure optimal recovery and performance enhancement. Our team understands the demands of athletic performance and designs treatment plans that not only heal but also strengthen.',
    benefits: [
      'Faster recovery from sports injuries',
      'Improved athletic performance',
      'Injury prevention strategies',
      'Sport-specific rehabilitation',
      'Return-to-play protocols',
      'Performance optimization'
    ],
    process: [
      { step: '01', title: 'Assessment', description: 'Comprehensive evaluation of your injury and athletic goals' },
      { step: '02', title: 'Treatment Plan', description: 'Customized rehabilitation program designed for your sport' },
      { step: '03', title: 'Active Rehab', description: 'Progressive exercises and manual therapy sessions' },
      { step: '04', title: 'Return to Sport', description: 'Gradual return with performance monitoring' },
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    color: 'cyan',
  },
  'sports-rehabilitation': {
    title: 'Sports Rehabilitation',
    description: 'Get back to peak performance with our specialized sports injury treatment and prevention programs designed for athletes of all levels.',
    details: 'Our sports rehabilitation program combines advanced therapeutic techniques with personalized training protocols. We work with professional athletes and weekend warriors alike to ensure optimal recovery and performance enhancement. Our team understands the demands of athletic performance and designs treatment plans that not only heal but also strengthen.',
    benefits: [
      'Faster recovery from sports injuries',
      'Improved athletic performance',
      'Injury prevention strategies',
      'Sport-specific rehabilitation',
      'Return-to-play protocols',
      'Performance optimization'
    ],
    process: [
      { step: '01', title: 'Assessment', description: 'Comprehensive evaluation of your injury and athletic goals' },
      { step: '02', title: 'Treatment Plan', description: 'Customized rehabilitation program designed for your sport' },
      { step: '03', title: 'Active Rehab', description: 'Progressive exercises and manual therapy sessions' },
      { step: '04', title: 'Return to Sport', description: 'Gradual return with performance monitoring' },
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    color: 'cyan',
  },
  'sports_rehabilitation': {
    title: 'Sports Rehabilitation',
    description: 'Get back to peak performance with our specialized sports injury treatment and prevention programs designed for athletes of all levels.',
    details: 'Our sports rehabilitation program combines advanced therapeutic techniques with personalized training protocols. We work with professional athletes and weekend warriors alike to ensure optimal recovery and performance enhancement. Our team understands the demands of athletic performance and designs treatment plans that not only heal but also strengthen.',
    benefits: [
      'Faster recovery from sports injuries',
      'Improved athletic performance',
      'Injury prevention strategies',
      'Sport-specific rehabilitation',
      'Return-to-play protocols',
      'Performance optimization'
    ],
    process: [
      { step: '01', title: 'Assessment', description: 'Comprehensive evaluation of your injury and athletic goals' },
      { step: '02', title: 'Treatment Plan', description: 'Customized rehabilitation program designed for your sport' },
      { step: '03', title: 'Active Rehab', description: 'Progressive exercises and manual therapy sessions' },
      { step: '04', title: 'Return to Sport', description: 'Gradual return with performance monitoring' },
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    color: 'cyan',
  },
  'pain-management': {
    title: 'Pain Management',
    description: 'Comprehensive pain relief and mobilization therapy for chronic and acute conditions using evidence-based treatment approaches.',
    details: 'We understand that chronic pain affects every aspect of your life. Our pain management specialists use a combination of manual therapy, therapeutic exercises, and modern modalities to help you regain control. We focus on treating the root cause, not just the symptoms.',
    benefits: [
      'Long-term pain relief',
      'Improved mobility and function',
      'Reduced dependency on medication',
      'Better quality of life',
      'Personalized treatment approach',
      'Holistic care methodology'
    ],
    process: [
      { step: '01', title: 'Pain Assessment', description: 'Detailed evaluation of pain patterns and triggers' },
      { step: '02', title: 'Diagnosis', description: 'Identifying the root cause of your pain' },
      { step: '03', title: 'Treatment', description: 'Multi-modal approach to pain relief' },
      { step: '04', title: 'Maintenance', description: 'Long-term strategies for pain management' },
    ],
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
    color: 'teal',
  },
  'pain_management': {
    title: 'Pain Management',
    description: 'Comprehensive pain relief and mobilization therapy for chronic and acute conditions using evidence-based treatment approaches.',
    details: 'We understand that chronic pain affects every aspect of your life. Our pain management specialists use a combination of manual therapy, therapeutic exercises, and modern modalities to help you regain control. We focus on treating the root cause, not just the symptoms.',
    benefits: [
      'Long-term pain relief',
      'Improved mobility and function',
      'Reduced dependency on medication',
      'Better quality of life',
      'Personalized treatment approach',
      'Holistic care methodology'
    ],
    process: [
      { step: '01', title: 'Pain Assessment', description: 'Detailed evaluation of pain patterns and triggers' },
      { step: '02', title: 'Diagnosis', description: 'Identifying the root cause of your pain' },
      { step: '03', title: 'Treatment', description: 'Multi-modal approach to pain relief' },
      { step: '04', title: 'Maintenance', description: 'Long-term strategies for pain management' },
    ],
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
    color: 'teal',
  },
  'physiotherapy': {
    title: 'Physiotherapy',
    description: 'Physical therapy for improved mobility, strength, and overall functional wellness tailored to your specific needs.',
    details: 'Our physiotherapy services address a wide range of conditions from post-surgical recovery to mobility issues. Each treatment plan is customized based on thorough assessment and your personal goals. We use evidence-based techniques to ensure the best outcomes.',
    benefits: [
      'Improved mobility and flexibility',
      'Enhanced strength and endurance',
      'Better posture and balance',
      'Faster post-surgery recovery',
      'Reduced risk of future injuries',
      'Improved daily function'
    ],
    process: [
      { step: '01', title: 'Evaluation', description: 'Comprehensive physical assessment' },
      { step: '02', title: 'Goal Setting', description: 'Define your recovery objectives' },
      { step: '03', title: 'Treatment', description: 'Hands-on therapy and exercises' },
      { step: '04', title: 'Progress Review', description: 'Regular assessment and plan adjustment' },
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    color: 'cyan',
  },
  'home-visits': {
    title: 'Home Physiotherapy',
    description: 'Professional physiotherapy services delivered to your doorstep for maximum comfort and convenience.',
    details: 'Can\'t make it to a clinic? Our certified physiotherapists come to you. We bring all necessary equipment and provide the same quality care you\'d receive at our facility, in the comfort of your home. Ideal for post-surgery patients, elderly individuals, or anyone with mobility challenges.',
    benefits: [
      'Treatment in familiar environment',
      'No travel required',
      'Flexible scheduling',
      'Family involvement in care',
      'Personalized attention',
      'Same quality as clinic visits'
    ],
    process: [
      { step: '01', title: 'Book Visit', description: 'Schedule a convenient time slot' },
      { step: '02', title: 'Home Assessment', description: 'Evaluation in your environment' },
      { step: '03', title: 'Treatment', description: 'Professional therapy at home' },
      { step: '04', title: 'Follow-up', description: 'Regular home visits as needed' },
    ],
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=600&fit=crop',
    color: 'teal',
  },
  'home_visits': {
    title: 'Home Physiotherapy',
    description: 'Professional physiotherapy services delivered to your doorstep for maximum comfort and convenience.',
    details: 'Can\'t make it to a clinic? Our certified physiotherapists come to you. We bring all necessary equipment and provide the same quality care you\'d receive at our facility, in the comfort of your home. Ideal for post-surgery patients, elderly individuals, or anyone with mobility challenges.',
    benefits: [
      'Treatment in familiar environment',
      'No travel required',
      'Flexible scheduling',
      'Family involvement in care',
      'Personalized attention',
      'Same quality as clinic visits'
    ],
    process: [
      { step: '01', title: 'Book Visit', description: 'Schedule a convenient time slot' },
      { step: '02', title: 'Home Assessment', description: 'Evaluation in your environment' },
      { step: '03', title: 'Treatment', description: 'Professional therapy at home' },
      { step: '04', title: 'Follow-up', description: 'Regular home visits as needed' },
    ],
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=600&fit=crop',
    color: 'teal',
  },
  'yoga': {
    title: 'Yoga & Wellness',
    description: 'Therapeutic yoga sessions designed to complement your recovery journey and promote overall mind-body wellness.',
    details: 'Our yoga programs are designed by certified instructors with healthcare backgrounds. Whether you\'re recovering from an injury or seeking preventive care, our sessions adapt to your abilities and goals. We combine traditional yoga with therapeutic techniques for optimal results.',
    benefits: [
      'Improved flexibility',
      'Stress reduction',
      'Better breathing patterns',
      'Enhanced mental clarity',
      'Improved sleep quality',
      'Overall wellness boost'
    ],
    process: [
      { step: '01', title: 'Consultation', description: 'Understand your wellness goals' },
      { step: '02', title: 'Program Design', description: 'Customized yoga routine' },
      { step: '03', title: 'Sessions', description: 'Guided yoga and breathing exercises' },
      { step: '04', title: 'Integration', description: 'Daily practice guidance' },
    ],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    color: 'cyan',
  },
  'yoga-wellness': {
    title: 'Yoga & Wellness',
    description: 'Therapeutic yoga sessions designed to complement your recovery journey and promote overall mind-body wellness.',
    details: 'Our yoga programs are designed by certified instructors with healthcare backgrounds. Whether you\'re recovering from an injury or seeking preventive care, our sessions adapt to your abilities and goals. We combine traditional yoga with therapeutic techniques for optimal results.',
    benefits: [
      'Improved flexibility',
      'Stress reduction',
      'Better breathing patterns',
      'Enhanced mental clarity',
      'Improved sleep quality',
      'Overall wellness boost'
    ],
    process: [
      { step: '01', title: 'Consultation', description: 'Understand your wellness goals' },
      { step: '02', title: 'Program Design', description: 'Customized yoga routine' },
      { step: '03', title: 'Sessions', description: 'Guided yoga and breathing exercises' },
      { step: '04', title: 'Integration', description: 'Daily practice guidance' },
    ],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    color: 'cyan',
  },
  'yoga_wellness': {
    title: 'Yoga & Wellness',
    description: 'Therapeutic yoga sessions designed to complement your recovery journey and promote overall mind-body wellness.',
    details: 'Our yoga programs are designed by certified instructors with healthcare backgrounds. Whether you\'re recovering from an injury or seeking preventive care, our sessions adapt to your abilities and goals. We combine traditional yoga with therapeutic techniques for optimal results.',
    benefits: [
      'Improved flexibility',
      'Stress reduction',
      'Better breathing patterns',
      'Enhanced mental clarity',
      'Improved sleep quality',
      'Overall wellness boost'
    ],
    process: [
      { step: '01', title: 'Consultation', description: 'Understand your wellness goals' },
      { step: '02', title: 'Program Design', description: 'Customized yoga routine' },
      { step: '03', title: 'Sessions', description: 'Guided yoga and breathing exercises' },
      { step: '04', title: 'Integration', description: 'Daily practice guidance' },
    ],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    color: 'cyan',
  },
  'geriatric-care': {
    title: 'Geriatric Care',
    description: 'Specialized physiotherapy for seniors focusing on mobility, balance, fall prevention, and maintaining independence.',
    details: 'Aging brings unique challenges. Our geriatric care specialists understand the specific needs of older adults and provide gentle, effective treatments that improve quality of life and independence. We focus on maintaining mobility, preventing falls, and enhancing daily function.',
    benefits: [
      'Improved balance and stability',
      'Fall prevention',
      'Enhanced mobility',
      'Pain management',
      'Maintained independence',
      'Better quality of life'
    ],
    process: [
      { step: '01', title: 'Assessment', description: 'Comprehensive geriatric evaluation' },
      { step: '02', title: 'Risk Analysis', description: 'Fall risk and mobility assessment' },
      { step: '03', title: 'Treatment', description: 'Gentle, effective therapy' },
      { step: '04', title: 'Home Safety', description: 'Environment modification advice' },
    ],
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop',
    color: 'teal',
  },
  'geriatric_care': {
    title: 'Geriatric Care',
    description: 'Specialized physiotherapy for seniors focusing on mobility, balance, fall prevention, and maintaining independence.',
    details: 'Aging brings unique challenges. Our geriatric care specialists understand the specific needs of older adults and provide gentle, effective treatments that improve quality of life and independence. We focus on maintaining mobility, preventing falls, and enhancing daily function.',
    benefits: [
      'Improved balance and stability',
      'Fall prevention',
      'Enhanced mobility',
      'Pain management',
      'Maintained independence',
      'Better quality of life'
    ],
    process: [
      { step: '01', title: 'Assessment', description: 'Comprehensive geriatric evaluation' },
      { step: '02', title: 'Risk Analysis', description: 'Fall risk and mobility assessment' },
      { step: '03', title: 'Treatment', description: 'Gentle, effective therapy' },
      { step: '04', title: 'Home Safety', description: 'Environment modification advice' },
    ],
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop',
    color: 'teal',
  },
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
            <p className="text-gray-500 mb-8">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/services">View All Services</Link>
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
                  <div className={`w-1 h-12 ${service.color === 'cyan' ? 'bg-cyan-500' : 'bg-teal-500'} rounded-full`} />
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
                  className={`h-12 px-8 text-[14px] font-medium rounded-full ${
                    service.color === 'cyan' 
                      ? 'bg-cyan-500 hover:bg-cyan-600' 
                      : 'bg-teal-500 hover:bg-teal-600'
                  } text-white`}
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
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    service.color === 'cyan' ? 'from-cyan-600/20' : 'from-teal-600/20'
                  } to-transparent`} />
                </div>
                <div className={`absolute -z-10 -right-4 -bottom-4 w-full h-full rounded-2xl ${
                  service.color === 'cyan' ? 'bg-cyan-100' : 'bg-teal-100'
                }`} />
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
                <Highlighter action="underline" color={service.color === 'cyan' ? '#06b6d4' : '#14b8a6'} isView>
                  {service.title}
                </Highlighter>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      service.color === 'cyan' ? 'bg-cyan-500' : 'bg-teal-500'
                    }`} />
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
                  <div className={`w-16 h-16 rounded-2xl ${
                    service.color === 'cyan' ? 'bg-cyan-100' : 'bg-teal-100'
                  } flex items-center justify-center mx-auto mb-4`}>
                    <span className={`text-[20px] font-medium ${
                      service.color === 'cyan' ? 'text-cyan-600' : 'text-teal-600'
                    }`}>{step.step}</span>
                  </div>
                  <h3 className="text-[16px] font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-[14px] text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 ${service.color === 'cyan' ? 'bg-cyan-500' : 'bg-teal-500'}`}>
          <div className="max-w-[1200px] mx-auto px-6 text-center">
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
