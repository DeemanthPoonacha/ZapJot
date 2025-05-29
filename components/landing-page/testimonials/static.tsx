// app/components/TestimonialsStatic.tsx
import { Star } from "lucide-react";
import { Testimonial } from ".";

export function TestimonialsStatic({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section id="testimonials" className="py-20 md:py-32">
      <h2 className="text-4xl font-bold text-center mb-8">
        Loved by thousands static
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 border rounded-xl bg-white shadow">
            <p className="text-gray-700">"{t.quote}"</p>
            <p className="mt-4 font-semibold">{t.name}</p>
            <p className="text-sm text-gray-500">{t.role}</p>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
