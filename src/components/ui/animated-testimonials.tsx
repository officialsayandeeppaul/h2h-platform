'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "H2H Healthcare completely transformed my recovery journey. After my ACL injury, I thought my cricket career was over. But their expert physiotherapists got me back on the field in record time!",
    name: "Rahul Sharma",
    role: "Professional Cricketer",
    initials: "RS",
    gradient: "from-blue-500 to-cyan-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Rahul&backgroundColor=b6e3f4"
  },
  {
    quote: "Finally found relief from chronic back pain! The personalized treatment plan was exactly what I needed.",
    name: "Priya Patel",
    role: "IT Professional",
    initials: "PP",
    gradient: "from-teal-500 to-emerald-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Priya&backgroundColor=c0aede"
  },
  {
    quote: "Sports rehab team is amazing! They understood my goals and helped me achieve them faster than expected.",
    name: "Amit Kumar",
    role: "Fitness Enthusiast",
    initials: "AK",
    gradient: "from-emerald-500 to-teal-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Amit&backgroundColor=d1d4f9"
  },
  {
    quote: "Best physiotherapy experience ever. The personalized care is unmatched. Highly recommend H2H!",
    name: "Sneha Mehta",
    role: "Yoga Instructor",
    initials: "SM",
    gradient: "from-cyan-500 to-teal-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sneha&backgroundColor=ffd5dc"
  },
  {
    quote: "Post-surgery recovery was smooth! The team was supportive throughout my rehabilitation journey.",
    name: "Vikram Rao",
    role: "Business Owner",
    initials: "VR",
    gradient: "from-emerald-500 to-cyan-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Vikram&backgroundColor=ffdfbf"
  },
  {
    quote: "Excellent care for my knee injury! Professional staff and state-of-the-art facilities.",
    name: "Ravi Kapoor",
    role: "Marathon Runner",
    initials: "RK",
    gradient: "from-cyan-500 to-blue-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Ravi&backgroundColor=b6e3f4"
  },
  {
    quote: "The home visit service is a game-changer. Quality physiotherapy without leaving my house!",
    name: "Ananya Singh",
    role: "Working Mother",
    initials: "AS",
    gradient: "from-blue-500 to-teal-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Ananya&backgroundColor=c0aede"
  },
  {
    quote: "My shoulder pain is completely gone after just 8 sessions. The exercises they taught me are invaluable.",
    name: "Deepak Verma",
    role: "Software Engineer",
    initials: "DV",
    gradient: "from-teal-500 to-cyan-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Deepak&backgroundColor=d1d4f9"
  },
  {
    quote: "Outstanding rehabilitation program. The progress tracking app kept me motivated throughout.",
    name: "Meera Joshi",
    role: "Dance Instructor",
    initials: "MJ",
    gradient: "from-cyan-500 to-emerald-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Meera&backgroundColor=ffd5dc"
  },
  {
    quote: "After my stroke, H2H helped me regain mobility. Forever grateful to the neuro-rehab team!",
    name: "Suresh Nair",
    role: "Retired Teacher",
    initials: "SN",
    gradient: "from-emerald-500 to-blue-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Suresh&backgroundColor=ffdfbf"
  },
  {
    quote: "The pediatric physiotherapy for my son was exceptional. Patient and caring therapists.",
    name: "Kavita Reddy",
    role: "Parent",
    initials: "KR",
    gradient: "from-blue-500 to-emerald-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Kavita&backgroundColor=c0aede"
  },
  {
    quote: "Quick recovery from my sports injury. The team's expertise in sports medicine is top-notch!",
    name: "Arjun Malhotra",
    role: "Tennis Player",
    initials: "AM",
    gradient: "from-teal-500 to-blue-500",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Arjun&backgroundColor=b6e3f4"
  }
];

function TestimonialCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <div className={cn(
      "group relative bg-gray-800/80 rounded-2xl p-5 border border-gray-700/40",
      "hover:border-cyan-500/40 transition-all duration-300",
      "cursor-default select-none",
      className
    )}>
      {/* Avatar and name at top */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10 ring-2 ring-cyan-500/30">
          <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="bg-gray-700" />
          <AvatarFallback className={cn(
            "text-[12px] font-medium text-white",
            `bg-gradient-to-br ${testimonial.gradient}`
          )}>
            {testimonial.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[13px] font-medium text-white">{testimonial.name}</p>
          <p className="text-[11px] text-gray-500">{testimonial.role}</p>
        </div>
      </div>
      {/* Quote */}
      <p className="text-[13px] text-gray-300 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </div>
  );
}

function MarqueeColumn({ 
  testimonials, 
  duration = 25,
  reverse = false,
  className 
}: { 
  testimonials: Testimonial[]; 
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 overflow-hidden", className)}>
      <div 
        className={cn(
          "flex flex-col gap-4",
          reverse ? "animate-marquee-up-reverse" : "animate-marquee-up"
        )}
        style={{ 
          animationDuration: `${duration}s`,
        }}
      >
        {[...testimonials, ...testimonials].map((testimonial, idx) => (
          <TestimonialCard key={idx} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export function AnimatedTestimonials() {
  const col1 = testimonials.slice(0, 3);
  const col2 = testimonials.slice(3, 6);
  const col3 = testimonials.slice(6, 9);
  const col4 = testimonials.slice(9, 12);

  return (
    <section className="relative py-20 bg-gray-950 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          {/* <p className="text-[13px] text-cyan-400 mb-3">Testimonials</p> */}
          <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-4 leading-tight tracking-tight">
            What Our{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Patients</span>
            {' '}Say
          </h2>
          <p className="text-[15px] text-gray-400 max-w-2xl mx-auto">
            Real stories from patients who transformed their health with H2H Healthcare.
          </p>
        </div>

        <div className="relative h-[550px] overflow-hidden">
          {/* Top fade gradient only */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 to-transparent z-10 pointer-events-none" />
          {/* Bottom fade gradient only */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent z-10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            <MarqueeColumn testimonials={col1} duration={22} />
            <MarqueeColumn testimonials={col2} duration={26} reverse />
            <MarqueeColumn testimonials={col3} duration={20} className="hidden md:flex" />
            <MarqueeColumn testimonials={col4} duration={24} reverse className="hidden lg:flex" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnimatedTestimonials;
