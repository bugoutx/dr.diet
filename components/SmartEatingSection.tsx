"use client";

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    text: "Calorie-counted meals with transparent macros",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    text: "High-protein options for muscle maintenance and satiety",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    text: "Balanced carbs, fats, and fiber",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    text: "Suitable for weight loss, maintenance, and performance",
  },
];

export default function SmartEatingSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            The Science Behind Eating Right
          </h2>
          <p className="text-2xl md:text-3xl text-drd-accent italic tracking-wide font-medium">
            Don't eat less, eat Right.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-8">
          {/* Left Column - Feature Bullets */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl border border-drd-accent/20 hover:border-drd-accent/40 hover:bg-drd-accent/5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-drd-primary/10 text-drd-primary flex items-center justify-center">
                  {feature.icon}
                </div>
                <p className="text-lg text-drd-text leading-relaxed pt-2">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column - Infographic Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-drd-accent/20 to-drd-primary/20 rounded-3xl blur-2xl -z-10" />
            
            {/* Card with neon border */}
            <div className="relative bg-white rounded-3xl p-8 border-2 border-drd-accent/30 shadow-xl">
              <h3 className="text-xl font-bold font-heading text-drd-text mb-6 text-center">
                Ideal Plate Composition
              </h3>

              {/* Plate Visualization */}
              <div className="relative w-full max-w-xs mx-auto mb-6">
                {/* Circular Plate with segments */}
                <div className="relative w-full aspect-square">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full transform -rotate-90"
                  >
                    {/* Veggies - 40% (144 degrees) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="rgb(140, 191, 79)"
                      strokeWidth="40"
                      strokeDasharray={`${(144 / 360) * 502.65} 502.65`}
                      className="opacity-40"
                    />
                    {/* Protein - 35% (126 degrees) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="rgb(255, 138, 42)"
                      strokeWidth="40"
                      strokeDasharray={`${(126 / 360) * 502.65} 502.65`}
                      strokeDashoffset={`-${(144 / 360) * 502.65}`}
                      className="opacity-50"
                    />
                    {/* Smart Carbs - 25% (90 degrees) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="rgb(95, 140, 51)"
                      strokeWidth="40"
                      strokeDasharray={`${(90 / 360) * 502.65} 502.65`}
                      strokeDashoffset={`-${((144 + 126) / 360) * 502.65}`}
                      className="opacity-40"
                    />
                  </svg>
                  {/* Center circle for plate effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-drd-text/10" />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-drd-primary/30 border-2 border-drd-primary" />
                  <span className="text-sm text-drd-text">
                    <span className="font-semibold">40%</span> Veggies
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-drd-accent/40 border-2 border-drd-accent" />
                  <span className="text-sm text-drd-text">
                    <span className="font-semibold">35%</span> Protein
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-drd-primary-dark/30 border-2 border-drd-primary-dark" />
                  <span className="text-sm text-drd-text">
                    <span className="font-semibold">25%</span> Smart Carbs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Micro-copy */}
        <p className="text-center text-sm text-drd-muted max-w-3xl mx-auto pt-4 border-t border-drd-bg">
          Macros based on items like California Salad, Energy Dishes, and Smart
          Snacks from our menu
        </p>
      </div>
    </section>
  );
}

