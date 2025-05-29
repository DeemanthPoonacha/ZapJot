import { testimonials } from "../data";
import { TestimonialsInteractive } from "./interactive";
import { TestimonialsStatic } from "./static";
import { Suspense } from "react";

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  highlight: string;
  gradient: string;
  bgGradient: string;
};

export function Testimonials() {
  return (
    <Suspense fallback={<TestimonialsStatic testimonials={testimonials} />}>
      <TestimonialsInteractive testimonials={testimonials} />
    </Suspense>
  );
}
