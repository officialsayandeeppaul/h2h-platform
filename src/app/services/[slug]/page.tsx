'use client';

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { MARKETING_IMAGES, SERVICE_CATEGORY_IMAGES } from "@/constants/marketing-images";
import { DigitalHealthServiceDetail } from "@/components/services/DigitalHealthServiceDetail";

type ServiceColor = 'red' | 'blue' | 'green' | 'purple' | 'teal' | 'orange' | 'cyan';

const servicesData: Record<string, {
  title: string;
  description: string;
  details: string;
  benefits: string[];
  process: { step: string; title: string; description: string }[];
  image: string;
  /** Tailwind object-* for hero crop (e.g. focus on faces / action) */
  imageObjectClass?: string;
  color: ServiceColor;
}> = {
  // 1. Pain Relief & Physiotherapy Care
  'pain_relief_physiotherapy': {
    title: 'Pain Relief & Physiotherapy Care',
    description:
      'Help for back pain, neck pain, sports niggles, and everyday aches—using hands-on physio and movement you can actually stick to.',
    details:
      'Pain can make simple things—sitting, sleeping, playing with kids—feel impossible. We listen first, then use hands-on treatment, guided exercises, and easy home routines so you move better and hurt less. We focus on what’s causing the pain, not just masking it.',
    benefits: [
      'Less reliance on painkillers when movement and therapy can help',
      'Clear exercises you can repeat at home between visits',
      'A plan built around your job, sport, and daily life',
      'Honest explanations—no confusing jargon',
      'Support for back, neck, joint, and muscle problems',
      'Steps toward lasting relief, not quick fixes that fade',
    ],
    process: [
      { step: '01', title: 'We listen', description: 'You tell us when it hurts, what you’ve tried, and what you want to do again' },
      { step: '02', title: 'We check', description: 'A careful look at how you move so we know what’s going on' },
      { step: '03', title: 'We treat', description: 'Hands-on work plus exercises that fit your body and schedule' },
      { step: '04', title: 'You keep going', description: 'Simple habits and check-ins so progress lasts' },
    ],
    image: SERVICE_CATEGORY_IMAGES.pain_relief_physiotherapy,
    color: 'red',
  },

  // 2. Advanced Rehabilitation & Recovery
  'advanced_rehabilitation': {
    title: 'Advanced Rehabilitation & Recovery',
    description:
      'Structured support after surgery, stroke, or a serious injury—so you rebuild strength and confidence step by step.',
    details:
      'Recovery isn’t linear. Whether you’ve had a joint replaced, a stroke, or a long hospital stay, we set small wins: walking farther, climbing stairs, getting back to work or family life. Your family can be part of the conversation when it helps—we explain what to expect in plain language.',
    benefits: [
      'A roadmap after surgery or major illness—not guesswork',
      'Help for bone, joint, nerve, and post-hospital recovery',
      'Equipment and exercises suited to where you are today',
      'Goals you can feel: distance walked, stairs climbed, confidence back',
      'Regular tweaks to your plan as you improve',
      'Family-friendly explanations when you want support at home',
    ],
    process: [
      { step: '01', title: 'Where you are now', description: 'We see what you can do safely—movement, balance, stamina' },
      { step: '02', title: 'Where you want to go', description: 'Together we pick realistic goals: home, work, hobbies' },
      { step: '03', title: 'Step-by-step rehab', description: 'Structured sessions that gradually ask a bit more of you' },
      { step: '04', title: 'Back to real life', description: 'Practice for daily tasks and transitions home or to work' },
    ],
    image: SERVICE_CATEGORY_IMAGES.advanced_rehabilitation,
    color: 'blue',
  },

  // 3. Nutrition & Lifestyle Care
  'nutrition_lifestyle': {
    title: 'Nutrition & Lifestyle Care',
    description:
      'Practical eating and lifestyle guidance—no fad diets, just habits that fit your routine and your health goals.',
    details:
      'Food should work for your kitchen, your budget, and your culture—not a rigid app or a crash diet. We help with energy, weight, blood sugar, heart health, or fuel for sport. You’ll leave with ideas you can actually cook, not a list of “don’ts” that lasts a week.',
    benefits: [
      'Meal ideas that fit Indian kitchens and busy weeks',
      'Support for weight, energy, diabetes-friendly eating, and more',
      'Sports nutrition explained without supplement hype',
      'Small changes first—so they stick',
      'Someone who listens before handing you a plan',
      'Check-ins so the plan grows with you',
    ],
    process: [
      { step: '01', title: 'What you eat today', description: 'Honest look at meals, snacks, and habits—no judgement' },
      { step: '02', title: 'What you want to change', description: 'Energy, weight, blood tests, sport—we align with your goals' },
      { step: '03', title: 'Your food plan', description: 'Simple swaps, portions, and timing you can follow' },
      { step: '04', title: 'Keep it working', description: 'Follow-ups to adjust when life or travel gets in the way' },
    ],
    image: SERVICE_CATEGORY_IMAGES.nutrition_lifestyle,
    color: 'green',
  },

  // 4. Mental Wellness & Performance Care
  'mental_wellness': {
    title: 'Mental Wellness & Performance Care',
    description:
      'Support for stress, nerves, focus, and motivation—in sport, at work, or when life feels heavy.',
    details:
      'You don’t need a textbook to feel better. We talk about sleep, pressure before a match or presentation, worry that won’t switch off, and confidence that dipped after injury or burnout. Tools are simple—breathing, routines, self-talk—and we go at your pace.',
    benefits: [
      'A safe space to say what’s really going on',
      'Practical tools for nerves, sleep, and focus',
      'Help for athletes, students, and working professionals',
      'No shame, no labels—just conversation that helps',
      'Ways to bounce back after setbacks',
      'Balance between ambition and rest',
    ],
    process: [
      { step: '01', title: 'What’s hard right now', description: 'We map stress, sleep, mood, and goals together' },
      { step: '02', title: 'What might help', description: 'A few strategies chosen for you—not a generic script' },
      { step: '03', title: 'Practice', description: 'Short exercises you can use before games, exams, or tough days' },
      { step: '04', title: 'Real life', description: 'We adjust as seasons, jobs, or family life change' },
    ],
    image: SERVICE_CATEGORY_IMAGES.mental_wellness,
    color: 'purple',
  },

  // 5. Therapeutic Yoga & Wellness
  'therapeutic_yoga': {
    title: 'Therapeutic Yoga & Wellness',
    description:
      'Gentle yoga that respects pain and stiffness—breath, stretching, and strength at the level that’s right for you.',
    details:
      'Not every body bends the same way—and that’s fine. Instructors with a healthcare lens adapt poses for injuries, arthritis, or beginners. We pair movement with breath so you feel steadier, more flexible, and calmer, without forcing shapes that don’t suit you.',
    benefits: [
      'Options and props so poses feel safe for your body',
      'Breathing practices that calm the mind',
      'Better flexibility without competition',
      'Support alongside physio or after injury',
      'Stress relief in a quiet, guided setting',
      'Short routines you can try gently at home',
    ],
    process: [
      { step: '01', title: 'Your story', description: 'Pain, injuries, goals—we meet you where you are' },
      { step: '02', title: 'Your pace', description: 'A sequence that fits your mobility and energy' },
      { step: '03', title: 'Guided class', description: 'Clear cues, modifications, and rest when needed' },
      { step: '04', title: 'Little and often', description: 'Easy home ideas to stay consistent' },
    ],
    image: SERVICE_CATEGORY_IMAGES.therapeutic_yoga,
    imageObjectClass: 'object-cover object-[center_35%]',
    color: 'teal',
  },

  // 6. Sports Performance & Athlete Development
  'sports_performance': {
    title: 'Sports Performance & Athlete Development',
    description:
      'Train smarter for your game—fitness, injury prevention, and coaching through our H2H Absolute Performance programme.',
    details:
      'Whether you play for school, club, or yourself, we look at how you move, where you’re tight or weak, and how to build speed and strength without breaking down. Absolute Performance ties coaching, screening, and rehab thinking together so you stay on the field longer.',
    benefits: [
      'Clear picture of fitness and movement for your sport',
      'Warm-up and strength ideas that match your season',
      'Fewer niggles turning into long injuries',
      'A path back after time off or surgery',
      'Support for academies and teams—not just individuals',
      'Honest talk about load, rest, and recovery',
    ],
    process: [
      { step: '01', title: 'See where you stand', description: 'Movement, strength, and sport demands—we baseline you' },
      { step: '02', title: 'Spot the risks', description: 'What might cause the next strain or sprain' },
      { step: '03', title: 'Train the plan', description: 'Sessions and drills aligned with your calendar' },
      { step: '04', title: 'Stay match-ready', description: 'Check-ins and tweaks through the season' },
    ],
    image: SERVICE_CATEGORY_IMAGES.sports_performance,
    color: 'orange',
  },

  // 7. Digital Health & Web Solutions
  'digital_health': {
    title: 'Digital Health & Web Solutions',
    description:
      'Care when you can’t visit in person—video consults, online exercise plans, and follow-ups from your phone or laptop.',
    details:
      'Life doesn’t always stop at the clinic door. Video visits, shared exercise videos, and quick messages between sessions help you stay on track if you travel, live outside the city, or need support between in-person appointments. You still get real clinicians—not bots.',
    benefits: [
      'Talk to someone from home or while travelling',
      'Flexible times that suit work and family',
      'Exercise demos you can replay',
      'Check-ins so you don’t lose momentum',
      'Less travel when pain or mobility makes trips hard',
      'A bridge between face-to-face visits when you need it',
    ],
    process: [
      { step: '01', title: 'Book online', description: 'Pick a slot and get a simple video link' },
      { step: '02', title: 'First video chat', description: 'We assess and explain next steps clearly' },
      { step: '03', title: 'Your home programme', description: 'Exercises and reminders you can follow remotely' },
      { step: '04', title: 'Stay connected', description: 'Follow-up calls or messages to keep progress going' },
    ],
    image: MARKETING_IMAGES.telehealth,
    color: 'cyan',
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

  if (slug === 'digital_health') {
    return <DigitalHealthServiceDetail />;
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
                <div className="relative h-[min(400px,55vw)] w-full overflow-hidden rounded-2xl sm:h-[400px]">
                  <Image
                    src={service.image}
                    alt={`${service.title} at H2H Healthcare`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className={`${service.imageObjectClass ?? 'object-cover object-center'}`}
                    priority
                  />
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent`} />
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
                Four simple stages—so you always know what happens next
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
