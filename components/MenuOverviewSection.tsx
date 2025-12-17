"use client";

type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

const categories: Category[] = [
  {
    id: "salads",
    name: "Salads",
    description: "Fresh, nutrient-packed salads with premium ingredients",
    icon: "🥗",
  },
  {
    id: "energy-dishes",
    name: "Energy Dishes",
    description: "High-protein plates with chicken, meat, or fish",
    icon: "🍽️",
  },
  {
    id: "sandwiches",
    name: "Sandwiches",
    description: "Wholesome sandwiches made with quality bread and fillings",
    icon: "🥪",
  },
  {
    id: "breakfast-toast",
    name: "Breakfast & Toast",
    description: "Energizing breakfast options and artisanal toasts",
    icon: "🍞",
  },
  {
    id: "smoothies-juices",
    name: "Smoothies & Juices",
    description: "Fresh, natural beverages for your daily nutrition",
    icon: "🥤",
  },
  {
    id: "smart-snacks",
    name: "Smart Snacks",
    description: "Healthy, satisfying snacks for between meals",
    icon: "🥜",
  },
  {
    id: "sauces",
    name: "Sauces",
    description: "Flavorful, healthy sauces to enhance your meals",
    icon: "🍯",
  },
];

export default function MenuOverviewSection() {
  const handleCategoryClick = (categoryId: string) => {
    const categorySection = document.getElementById(categoryId);
    if (categorySection) {
      categorySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="menu"
      className="relative py-16 md:py-24 bg-drd-bg overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0' fill='%238CBF4F'/%3E%3Cpath d='M20 20m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0' fill='%23FF8A2A'/%3E%3Cpath d='M80 30m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0' fill='%238CBF4F'/%3E%3Cpath d='M30 80m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0' fill='%23FF8A2A'/%3E%3Cpath d='M70 70m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0' fill='%238CBF4F'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            Smart, Balanced Meals
          </h2>
          <p className="text-lg md:text-xl text-drd-muted max-w-3xl mx-auto leading-relaxed">
            Dr.Diet offers calorie-counted, high-protein meals designed for your
            wellness journey. Choose from fresh salads, energy plates with
            chicken, meat, or fish, wholesome sandwiches, energizing breakfasts
            & toasts, refreshing juices & smoothies, smart snacks, and flavorful
            sauces.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group bg-white rounded-2xl p-6 border border-drd-primary/10 hover:border-drd-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left"
            >
              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>

              {/* Category Name */}
              <h3 className="text-lg font-bold font-heading text-drd-text mb-2 group-hover:text-drd-primary transition-colors">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-drd-muted leading-relaxed">
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

