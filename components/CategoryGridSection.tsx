"use client";

import Image from "next/image";

type MenuItem = {
  name: string;
  macros: string;
  ingredients: string;
  label?: "High Protein" | "Low Cal" | "High Fiber" | "Keto";
};

type Category = {
  id: string;
  name: string;
  heading: string;
  description: string;
  items: MenuItem[];
};

const categories: Category[] = [
  {
    id: "salads",
    name: "Salads",
    heading: "Signature Salads",
    description:
      "Fresh, crisp salads packed with premium vegetables, proteins, and our house-made dressings. Each salad is carefully balanced for optimal nutrition and flavor.",
    items: [
      {
        name: "California Salad",
        macros: "35g protein · 473 cal",
        ingredients: "Arugula, tomato, avocado, rice, corn & grilled chicken",
        label: "High Protein",
      },
      {
        name: "Mediterranean Quinoa",
        macros: "28g protein · 420 cal",
        ingredients: "Quinoa, cucumber, feta, olives & lemon-herb dressing",
        label: "High Fiber",
      },
      {
        name: "Garden Fresh Bowl",
        macros: "22g protein · 320 cal",
        ingredients: "Mixed greens, cherry tomatoes, bell peppers & tahini",
        label: "Low Cal",
      },
    ],
  },
  {
    id: "energy-dishes",
    name: "Energy Dishes",
    heading: "Energy Plates",
    description:
      "High-protein plates featuring grilled chicken, lean meats, or fresh fish, paired with sautéed vegetables and smart carbohydrates for sustained energy.",
    items: [
      {
        name: "Dr.Diet Energy Plate",
        macros: "48g protein · 350 cal",
        ingredients: "Grilled chicken, sautéed vegetables & smart carbs",
        label: "High Protein",
      },
      {
        name: "Grilled Salmon Delight",
        macros: "42g protein · 380 cal",
        ingredients: "Fresh salmon, roasted vegetables & lemon herb sauce",
        label: "High Protein",
      },
      {
        name: "Beef Power Bowl",
        macros: "45g protein · 420 cal",
        ingredients: "Lean beef, brown rice, broccoli & teriyaki glaze",
        label: "High Protein",
      },
    ],
  },
  {
    id: "sandwiches",
    name: "Sandwiches",
    heading: "Wholesome Sandwiches",
    description:
      "Satisfying sandwiches made with quality bread, fresh ingredients, and premium proteins. Perfect for a quick, nutritious meal on the go.",
    items: [
      {
        name: "Chicken Avocado Wrap",
        macros: "32g protein · 450 cal",
        ingredients: "Grilled chicken, avocado, lettuce & whole grain wrap",
        label: "High Protein",
      },
      {
        name: "Turkey Club",
        macros: "28g protein · 380 cal",
        ingredients: "Roasted turkey, bacon, lettuce, tomato & whole wheat",
        label: "High Protein",
      },
      {
        name: "Veggie Delight",
        macros: "18g protein · 320 cal",
        ingredients: "Hummus, roasted vegetables, sprouts & multigrain bread",
        label: "Low Cal",
      },
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast & Toast",
    heading: "Breakfast & Toast",
    description:
      "Start your day right with our energizing breakfast options and artisanal toasts. Fuel your morning with balanced nutrition and delicious flavors.",
    items: [
      {
        name: "Protein Power Toast",
        macros: "25g protein · 380 cal",
        ingredients: "Whole grain toast, eggs, avocado & cherry tomatoes",
        label: "High Protein",
      },
      {
        name: "Overnight Oats Bowl",
        macros: "20g protein · 350 cal",
        ingredients: "Oats, Greek yogurt, berries & honey",
        label: "High Fiber",
      },
      {
        name: "Avocado Smash Toast",
        macros: "15g protein · 320 cal",
        ingredients: "Sourdough, smashed avocado, feta & poached egg",
        label: "Low Cal",
      },
    ],
  },
  {
    id: "smoothies",
    name: "Smoothies & Juices",
    heading: "Smoothies & Juices",
    description:
      "Fresh, natural beverages packed with vitamins and nutrients. Our smoothies and juices are made with real fruits and vegetables for clean, refreshing energy.",
    items: [
      {
        name: "Radiance Smoothie",
        macros: "12g protein · 343 cal",
        ingredients: "Low-fat milk, avocado, banana & honey",
        label: "High Fiber",
      },
      {
        name: "Green Power Juice",
        macros: "5g protein · 180 cal",
        ingredients: "Spinach, apple, cucumber, lemon & ginger",
        label: "Low Cal",
      },
      {
        name: "Protein Boost Smoothie",
        macros: "28g protein · 320 cal",
        ingredients: "Protein powder, berries, almond milk & chia seeds",
        label: "High Protein",
      },
    ],
  },
  {
    id: "snacks",
    name: "Smart Snacks",
    heading: "Smart Snacks",
    description:
      "Healthy, satisfying snacks perfect for between meals. Nutrient-dense options that keep you energized without compromising your wellness goals.",
    items: [
      {
        name: "Protein Energy Balls",
        macros: "8g protein · 120 cal",
        ingredients: "Dates, almonds, protein powder & coconut",
        label: "High Protein",
      },
      {
        name: "Veggie Sticks & Hummus",
        macros: "6g protein · 150 cal",
        ingredients: "Fresh vegetables & house-made hummus",
        label: "Low Cal",
      },
      {
        name: "Trail Mix Delight",
        macros: "10g protein · 200 cal",
        ingredients: "Nuts, seeds, dried fruits & dark chocolate chips",
        label: "High Fiber",
      },
    ],
  },
  {
    id: "sauces",
    name: "Sauces",
    heading: "Flavorful Sauces",
    description:
      "Enhance your meals with our house-made sauces. Each sauce is crafted with wholesome ingredients to add flavor without excess calories.",
    items: [
      {
        name: "Lemon Herb Dressing",
        macros: "2g protein · 45 cal",
        ingredients: "Fresh lemon, herbs, olive oil & garlic",
        label: "Low Cal",
      },
      {
        name: "Tahini Sauce",
        macros: "4g protein · 80 cal",
        ingredients: "Tahini, lemon, garlic & water",
        label: "High Fiber",
      },
      {
        name: "Spicy Chipotle",
        macros: "1g protein · 35 cal",
        ingredients: "Chipotle peppers, yogurt & lime",
        label: "Low Cal",
      },
    ],
  },
];

export default function CategoryGridSection() {
  return (
    <section className="relative">
      {categories.map((category, index) => (
        <div
          key={category.id}
          id={category.id}
          className={`py-16 md:py-24 ${
            index % 2 === 0 ? "bg-white" : "bg-drd-bg"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 lg:px-6">
            {/* Category Label Chip */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-drd-primary/10 text-drd-primary text-sm font-semibold rounded-full">
                {category.name}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-drd-text mb-4">
              {category.heading}
            </h2>

            {/* Description */}
            <p className="text-lg text-drd-muted max-w-3xl mb-10 leading-relaxed">
              {category.description}
            </p>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="group relative rounded-2xl p-0.5 bg-gradient-to-br from-drd-primary/30 via-drd-primary/20 to-drd-accent/30 hover:from-drd-primary/50 hover:to-drd-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 h-full">
                  {/* Label Badge */}
                  {item.label && (
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.label === "High Protein"
                            ? "bg-drd-primary/20 text-drd-primary"
                            : item.label === "Low Cal"
                            ? "bg-drd-accent/20 text-drd-accent"
                            : "bg-drd-primary/15 text-drd-primary-dark"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  )}

                  {/* Image Placeholder */}
                  <div className="relative w-full h-40 rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-drd-primary/10 to-drd-accent/10 flex items-center justify-center">
                    <span className="text-drd-muted text-xs font-medium">
                      Food photo
                    </span>
                  </div>

                  {/* Dish Name */}
                  <h3 className="text-xl font-bold font-heading text-drd-text mb-2 group-hover:text-drd-primary transition-colors">
                    {item.name}
                  </h3>

                  {/* Macros */}
                  <p className="text-sm font-medium text-drd-muted mb-3">
                    {item.macros}
                  </p>

                  {/* Ingredients */}
                  <p className="text-sm text-drd-muted mb-4 leading-relaxed">
                    {item.ingredients}
                  </p>

                  {/* Order Button */}
                  <button className="w-full px-4 py-2.5 border-2 border-drd-primary/30 text-drd-primary rounded-lg font-semibold hover:bg-drd-primary hover:text-white hover:border-drd-primary transition-all duration-300">
                    Order this
                  </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

