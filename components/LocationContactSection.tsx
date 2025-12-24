"use client";

export default function LocationContactSection() {
  // Google Maps embed URL for G733+8G5, Damascus, Syria
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4152.1623094196175!2d36.25385544105741!3d33.503343381899114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6fc344fceac893aa!2sG733%2B8G5%2C%20Damas%2C%20Syria!5e0!3m2!1sen!2sus!4v1766573200924!5m2!1sen!2sus";
  const mapLinkUrl = "https://maps.google.com/?q=G733+8G5+Damascus+Syria";

  return (
    <section 
      id="contact" 
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #8BC34A, #7CB342)",
      }}
    >
      {/* Subtle noise/grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Container with rounded corners and shadow */}
        <div className="bg-white/95 backdrop-blur-sm rounded-[28px] p-8 md:p-12 shadow-2xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-drd-text mb-3">
              Visit or Order
            </h2>
            <p className="text-lg text-drd-muted">
              Dine in, takeaway, or get it delivered.
            </p>
          </div>

          {/* Two-Column Layout - Stack on mobile, map first */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Find Us (Map first on mobile) */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-lg transition-all duration-200 hover:translate-y-[-4px] hover:shadow-xl border-2 border-transparent hover:border-drd-primary/30 flex flex-col md:order-1">
              <h3 className="text-2xl font-bold font-heading text-drd-text mb-6">
                Find us
              </h3>

              <div className="space-y-6 flex-grow">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-drd-primary/10 text-drd-primary flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-drd-text font-medium leading-relaxed">
                      G733+8G5, Damascus, Syria
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-drd-primary/10 text-drd-primary flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <a
                      href="tel:0997920789"
                      className="text-drd-primary font-semibold hover:text-drd-primary-dark transition-colors"
                    >
                      0997 920 789
                    </a>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-drd-primary/10 text-drd-primary flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-drd-muted text-sm">
                      Dine-in · Takeaway · Delivery
                    </p>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="relative w-full h-[220px] md:h-[260px] rounded-2xl overflow-hidden bg-neutral-100 shadow-lg mt-4">
                  <iframe
                    src={mapEmbedUrl}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0 block"
                    title="Dr.Diet Location - G733+8G5, Damascus, Syria"
                  />
                </div>

                {/* Open in Google Maps Link */}
                <a
                  href={mapLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#7CB342] hover:underline transition-all mt-3 font-medium"
                >
                  Open in Google Maps
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column - Order Now */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-lg transition-all duration-200 hover:translate-y-[-4px] hover:shadow-xl border-2 border-transparent hover:border-drd-primary/30 flex flex-col md:order-2">
              <h3 className="text-2xl font-bold font-heading text-drd-text mb-6">
                Order now
              </h3>

              <p className="text-drd-muted mb-8 leading-relaxed">
                Order your favorite healthy meals via phone call or through our
                delivery partner apps. Fast, convenient, and always fresh.
              </p>

              <div className="space-y-4 flex-grow flex flex-col justify-end">
                {/* BeeOrder Button */}
                <a
                  href="#"
                  className="group relative block w-full px-6 py-4 bg-gradient-to-r from-drd-primary to-drd-primary text-white rounded-full font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] overflow-hidden"
                  style={{
                    background: "linear-gradient(to right, #8BC34A, #7CB342)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, #FF9800, #F57C00)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, #8BC34A, #7CB342)";
                  }}
                >
                  <div className="relative flex items-center justify-center gap-2">
                    {/* BeeOrder Icon */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Order on BeeOrder
                  </div>
                </a>

                {/* Movo Delivery Button */}
                <a
                  href="#"
                  className="group relative block w-full px-6 py-4 border-2 border-drd-primary text-drd-primary rounded-full font-bold text-center transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, #8BC34A, #7CB342)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  <div className="relative flex items-center justify-center gap-2">
                    {/* Movo Delivery Icon */}
                    <svg
                      className="w-5 h-5"
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
                    Order on Movo Delivery
                  </div>
                </a>

                {/* PDF Download Button */}
                <a
                  href="/menu.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 text-drd-text rounded-full font-semibold hover:bg-drd-bg transition-all duration-300 text-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Full Menu PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

