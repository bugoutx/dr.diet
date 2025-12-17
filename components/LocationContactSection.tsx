"use client";

export default function LocationContactSection() {
  return (
    <section id="contact" className="relative py-16 md:py-24 bg-drd-primary">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-12 text-center">
          Visit or Order
        </h2>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Find Us */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
            <h3 className="text-2xl font-bold font-heading text-drd-text mb-6">
              Find us
            </h3>

            <div className="space-y-6">
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
                    Mazzeh – Uptown, Damascus, Syria
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

              {/* Map Placeholder */}
              <div className="relative w-full h-48 rounded-xl bg-gray-200 overflow-hidden mt-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-2"
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
                    <p className="text-xs text-gray-500">Map placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Now */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
            <h3 className="text-2xl font-bold font-heading text-drd-text mb-6">
              Order now
            </h3>

            <p className="text-drd-muted mb-8 leading-relaxed">
              Order your favorite healthy meals via phone call or through our
              delivery partner apps. Fast, convenient, and always fresh.
            </p>

            <div className="space-y-4">
              {/* BeeOrder Button */}
              <a
                href="#"
                className="block w-full px-6 py-4 bg-drd-primary text-white rounded-full font-bold text-center hover:bg-drd-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Order on BeeOrder
              </a>

              {/* Movo Delivery Button */}
              <a
                href="#"
                className="block w-full px-6 py-4 border-2 border-drd-primary text-drd-primary rounded-full font-bold text-center hover:bg-drd-primary hover:text-white transition-all duration-300 hover:scale-[1.02]"
              >
                Order on Movo Delivery
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
    </section>
  );
}

