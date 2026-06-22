export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  thumbnail: string;
  demoUrl: string;
  features: string[];
  technologies: string[];
  screenshot: string; // URL screenshot utama
}

export interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  previewImage: string;
  demoUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
