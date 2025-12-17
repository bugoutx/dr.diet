"use client";

export default function FooterSection() {
  const handleOrderClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-drd-primary-dark border-t border-drd-accent/20">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
          {/* Left - Wordmark & Tagline */}
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-white mb-2">
              <span className="inline-flex items-baseline">
                <span className="mr-0.5">D</span>
                <span className="inline-block origin-center scale-x-[-1] ml-0.5">
                  R
                </span>
                <span>.DIET</span>
              </span>
            </h3>
            <p className="text-xs text-white/60 italic tracking-wide">
              Don't eat less, eat Right.
            </p>
          </div>

          {/* Center - Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a
              href="#menu"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Menu
            </a>
            <button
              onClick={handleOrderClick}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Order
            </button>
            <a
              href="https://instagram.com/dr.diet.sy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Instagram
            </a>
            <a
              href="#contact"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Right - Copyright & Micro-line */}
          <div className="text-right">
            <p className="text-xs text-white/60 mb-1">
              © {new Date().getFullYear()} DR.DIET. All rights reserved.
            </p>
            <p className="text-xs text-white/40">
              Designed for healthy living
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

