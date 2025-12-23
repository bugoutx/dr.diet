"use client";

type Testimonial = {
  name: string;
  tag: string;
  content: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    tag: "Gym Member",
    content:
      "Dr.Diet has transformed my relationship with food. Every meal is delicious and perfectly balanced for my fitness goals. I've never felt better!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    tag: "Office Worker",
    content:
      "I love that they show protein and calories on every meal. It makes tracking so easy, and the food actually tastes amazing. Perfect for my busy lifestyle.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    tag: "Health Coach",
    content:
      "As a nutritionist, I recommend Dr.Diet to all my clients. The meal plans are scientifically sound, delicious, and the macros are always transparent.",
    rating: 5,
  },
  {
    name: "Ahmed Al-Mahmoud",
    tag: "Fitness Enthusiast",
    content:
      "The consistency is incredible. Every meal is fresh, perfectly portioned, and the high-protein options keep me full and energized throughout the day.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative pt-64 pb-16 md:pt-72 md:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            Loved by Healthy Food Lovers
          </h2>
          <p className="text-lg text-drd-muted max-w-2xl mx-auto">
            People choose Dr.Diet for everyday balanced meals that fuel their
            active lifestyles
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-white to-drd-bg/30 rounded-2xl p-6 border border-drd-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Opening Quotation Mark */}
              <div className="absolute top-4 left-4 text-4xl text-drd-accent/30 font-serif leading-none">
                "
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < testimonial.rating
                        ? "bg-drd-accent"
                        : "bg-drd-accent/20"
                    }`}
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-drd-text mb-6 leading-relaxed relative z-10">
                {testimonial.content}
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-drd-primary/10">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-drd-primary font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-drd-text text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-drd-muted">{testimonial.tag}</p>
                </div>
              </div>

              {/* Closing Quotation Mark */}
              <div className="absolute bottom-16 right-4 text-4xl text-drd-accent/30 font-serif leading-none">
                "
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

