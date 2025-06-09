"use client";
import { useState, useEffect } from "react";
import {
  Star,
  Quote,
  Users,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Testimonial } from ".";

export function TestimonialsInteractive({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(activeTestimonial + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section id="testimonials" className="py-20 md:py-32 relative">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50" />

      <article className="container px-4 md:px-6 relative z-10">
        {/* Enhanced header */}
        <div className="mx-auto text-center md:max-w-[58rem] mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-6">
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Customer Love
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Loved by thousands
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6" />

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our users
            have to say about ZapJot.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">4.9/5 rating</p>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-2xl text-gray-800">10k+</span>
              </div>
              <p className="text-sm text-gray-600">Happy users</p>
            </div>
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <div
            className={`relative p-8 md:p-12 rounded-3xl bg-gradient-to-br ${testimonials[activeTestimonial].bgGradient} border border-white/50 shadow-2xl overflow-hidden`}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />

            <Quote
              className={`w-16 h-16 text-white/30 mb-6 bg-gradient-to-r ${testimonials[activeTestimonial].gradient} p-3 rounded-2xl`}
            />

            <blockquote className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-8">
              &quot;{testimonials[activeTestimonial].quote}&quot;
            </blockquote>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${testimonials[activeTestimonial].gradient} p-0.5`}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {testimonials[activeTestimonial].name}
                </h3>
                <p className="text-gray-600">
                  {testimonials[activeTestimonial].role} at{" "}
                  {testimonials[activeTestimonial].company}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                title="Previous testimonial"
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-sm transition-all duration-300 group cursor-pointer hover:scale-110 hover:outline"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    title={`Testimonial ${index + 1}`}
                    onClick={() => {
                      setActiveTestimonial(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === activeTestimonial
                        ? "bg-gray-700 w-8"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              <button
                title="Next testimonial"
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-sm transition-all duration-300 group cursor-pointer hover:scale-110 hover:outline"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid of testimonials */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group relative p-6 rounded-2xl border bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer ${
                index === 0
                  ? "ring-2 ring-blue-200 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => {
                setActiveTestimonial(
                  testimonials.findIndex((t) => t.id === testimonial.id)
                );
                setIsAutoPlaying(false);
              }}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl`}
              />

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.gradient} p-0.5`}
                  >
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-800">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-700 leading-relaxed">
                  <p>&quot;{testimonial.quote}&quot;</p>
                </blockquote>

                {/* Sparkle effect */}
                <Sparkles
                  className={`absolute top-4 right-4 w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by 10,000+ users
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                4.9/5 average rating
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
