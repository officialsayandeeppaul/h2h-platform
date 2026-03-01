'use client';

import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { ArrowRight } from "lucide-react";

const services = [
  {
    id: 'pain_relief_physiotherapy',
    title: 'Pain Relief & Physiotherapy Care',
    description: 'Comprehensive pain relief and mobilization therapy for chronic and acute conditions using evidence-based treatment approaches.',
    details: 'Our pain management specialists use a combination of manual therapy, therapeutic exercises, and modern modalities to help you regain control of your life. From back pain to joint issues, we provide personalized care.',
    color: 'red',
  },
  {
    id: 'advanced_rehabilitation',
    title: 'Advanced Rehabilitation & Recovery',
    description: 'Specialized rehabilitation for orthopedic, neurological, and post-surgical conditions with comprehensive recovery programs.',
    details: 'Our advanced rehabilitation services address complex conditions including stroke recovery, spinal cord injuries, and post-surgical rehabilitation. Each program is designed by expert physiotherapists for optimal outcomes.',
    color: 'blue',
  },
  {
    id: 'nutrition_lifestyle',
    title: 'Nutrition & Lifestyle Care',
    description: 'Personalized nutrition plans and lifestyle modification coaching for athletes and health-conscious individuals.',
    details: 'Our certified nutritionists work with you to create sustainable eating habits and lifestyle changes. From sports nutrition to weight management, we provide science-backed guidance for your health goals.',
    color: 'green',
  },
  {
    id: 'mental_wellness',
    title: 'Mental Wellness & Performance Care',
    description: 'Sports psychology, stress management, and mental performance coaching for peak mental fitness.',
    details: 'Mental health is crucial for overall wellbeing and performance. Our specialists help athletes and professionals manage stress, anxiety, and optimize their mental game through proven psychological techniques.',
    color: 'purple',
  },
  {
    id: 'therapeutic_yoga',
    title: 'Therapeutic Yoga & Wellness',
    description: 'Yoga sessions designed for healing, rehabilitation, and promoting overall mind-body wellness.',
    details: 'Our yoga programs are designed by certified instructors with healthcare backgrounds. Whether you\'re recovering from an injury or seeking preventive care, our sessions adapt to your abilities and goals.',
    color: 'teal',
  },
  {
    id: 'sports_performance',
    title: 'Sports Performance & Athlete Development',
    description: 'Integrated sports performance analysis, injury prevention, and athletic training programs.',
    details: 'Our sports performance team combines biomechanical analysis, strength conditioning, and injury prevention to help athletes reach their peak potential. From amateur to professional, we elevate your game.',
    color: 'orange',
  },
  {
    id: 'digital_health',
    title: 'Digital Health & Web Solutions',
    description: 'Tele-rehabilitation, virtual assessments, and remote health monitoring for convenient care.',
    details: 'Access quality healthcare from anywhere with our digital health solutions. Our tele-rehabilitation services, virtual consultations, and remote monitoring ensure you stay on track with your health goals.',
    color: 'cyan',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-8">
              {/* <p className="text-[13px] text-cyan-600 font-medium mb-3">Our Services</p> */}
              <h1 className="text-[36px] md:text-[48px] font-medium text-gray-900 tracking-tight leading-tight mb-6">
                Comprehensive{' '}
                <Highlighter action="highlight" color="#06b6d4" isView>
                  <span className="text-white">Healthcare Services</span>
                </Highlighter>
              </h1>
              <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
                 your needs. From sports injuries to chronic pain management, our expert team provides personalized care.
              </p>
            </div>
          </div>
        </section>

        {/* Individual Service Sections - Alternating Layout */}
        {services.map((service, index) => (
          <section 
            key={service.id} 
            className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                {/* Content Side - Always on left for even, right for odd */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-1 h-10 rounded-full bg-cyan-500" />
                    <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-900 tracking-tight">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-[16px] text-gray-700 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                    {service.details}
                  </p>
                  
                  <Link 
                    href={`/services/${service.id}`} 
                    className="inline-flex items-center gap-2 text-[14px] font-medium transition-colors text-cyan-600 hover:text-cyan-700"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Visual/Mockup Side */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {/* Mockup Container */}
                  <div className="relative bg-gray-100 rounded-2xl p-8 flex items-center justify-center min-h-[450px]">
                    {/* Corner Diamonds */}
                    <div className="absolute top-4 left-4 w-2 h-2 bg-gray-300 rotate-45" />
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gray-300 rotate-45" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-gray-300 rotate-45" />
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-gray-300 rotate-45" />
                    
                    {/* Mockup Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-[320px] w-full">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-[13px] font-medium text-gray-900">{service.title}</div>
                        <div className="text-[11px] text-gray-400">H2H Healthcare</div>
                      </div>
                      
                      {/* Progress/Status Items */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-100">
                            <div className="w-3 h-3 rounded-full bg-cyan-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[12px] font-medium text-gray-700">Assessment</div>
                            <div className="text-[11px] text-gray-400">Initial evaluation</div>
                          </div>
                          <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full bg-cyan-200" />
                            <div className="w-5 h-5 rounded-full bg-cyan-300" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-100">
                            <div className="w-3 h-3 rounded-full bg-cyan-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[12px] font-medium text-gray-700">Treatment Plan</div>
                            <div className="text-[11px] text-gray-400">Personalized care</div>
                          </div>
                          <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full bg-gray-200" />
                            <div className="w-5 h-5 rounded-full bg-gray-300" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[12px] font-medium text-gray-700">Recovery</div>
                            <div className="text-[11px] text-gray-400">Progress tracking</div>
                          </div>
                          <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full bg-gray-200" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Stats */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[11px] text-gray-400">Success Rate</div>
                            <div className="text-[16px] font-medium text-gray-900">98%</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-8 rounded-full bg-cyan-500" />
                            <div className="h-1.5 w-6 rounded-full bg-cyan-300" />
                            <div className="h-1.5 w-4 rounded-full bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Testimonials Section - Dark */}
        <section className="py-24 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px]" />
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <p className="text-[13px] text-cyan-400 font-medium mb-3">Testimonials</p>
              <h2 className="text-[32px] md:text-[44px] font-medium text-white tracking-tight mb-4">
                What Our{' '}
                <span className="text-cyan-400">Patients Say</span>
              </h2>
              <p className="text-[15px] text-gray-400 max-w-xl mx-auto">
                Real stories from real patients who have experienced our care
              </p>
            </div>
            
            {/* Custom Testimonial Cards (Tweet-style) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <img 
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=rahul&backgroundColor=b6e3f4" 
                    alt="Rahul Kumar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-[14px]">Rahul Kumar</span>
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-[13px]">@rahul_athlete</span>
                  </div>
                </div>
                <p className="text-gray-300 text-[14px] leading-relaxed mb-4">
                  After my ACL injury, I thought my cricket career was over. The team at <span className="text-cyan-400">@H2HHealthcare</span> got me back on the field in record time. Their sports rehab program is world-class! 🏏
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-[12px]">
                  <span>Sports Rehabilitation</span>
                  <span>•</span>
                  <span>Mumbai</span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <img 
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=priya&backgroundColor=c0aede" 
                    alt="Priya Sharma"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-[14px]">Priya Sharma</span>
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-[13px]">@priya_wellness</span>
                  </div>
                </div>
                <p className="text-gray-300 text-[14px] leading-relaxed mb-4">
                  Living with chronic back pain for 5 years was exhausting. <span className="text-cyan-400">@H2HHealthcare</span> pain management team changed my life. I can finally play with my kids again! 💚
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-[12px]">
                  <span>Pain Management</span>
                  <span>•</span>
                  <span>Delhi</span>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <img 
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=amit&backgroundColor=d1d4f9" 
                    alt="Amit Mehta"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-[14px]">Amit Mehta</span>
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-[13px]">@amit_senior</span>
                  </div>
                </div>
                <p className="text-gray-300 text-[14px] leading-relaxed mb-4">
                  My father needed physiotherapy but couldn't travel. <span className="text-cyan-400">@H2HHealthcare</span> home visits were a blessing. Professional, caring, and so convenient! Highly recommend 🙏
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-[12px]">
                  <span>Home Physiotherapy</span>
                  <span>•</span>
                  <span>Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-cyan-500 to-teal-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <h2 className="text-[32px] md:text-[44px] font-medium text-white tracking-tight mb-6">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-[15px] text-white/80 max-w-2xl mx-auto mb-10">
              Our experts can help you find the right treatment plan. Book a free consultation to discuss your health concerns and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="h-12 px-8 text-[14px] font-medium bg-white hover:bg-gray-100 text-gray-900 rounded-full"
                asChild
              >
                <Link href="/booking">
                  Book Free Consultation
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
