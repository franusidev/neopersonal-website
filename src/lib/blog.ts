// Blog-related constants and utility functions

interface CategoryColors {
  [key: string]: string;
}

export const categoryColors: CategoryColors = {
  Infrastructure: "bg-red-500",
  Security: "bg-green-500", 
  Observability: "bg-purple-500",
  Automation: "bg-orange-500",
};

export const categories = ["All", "Infrastructure", "Security", "Observability", "Automation"];

// Consistently random color for unknown categories
export function getCategoryColor(category: string): string {
  if (categoryColors[category]) {
    return categoryColors[category];
  }
  
  // Generate a hash from the category name
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Pick from a palette of tailwind bg colors
  const palette = [
    "bg-blue-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-fuchsia-500",
    "bg-emerald-500",
    "bg-sky-500"
  ];
  
  const idx = Math.abs(hash) % palette.length;
  return palette[idx];
}

// Format date for blog posts
export function formatBlogDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).toUpperCase();
}

// Format short date for blog posts
export function formatShortBlogDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).toUpperCase();
}
