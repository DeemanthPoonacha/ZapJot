import React from "react";
import { Mail, MessageSquare, Sparkles, Heart, Star } from "lucide-react";
import ContactForm from "./contact-form";

export function Contact() {
  return (
    <section id="contact" className="relative py-20 md:py-32">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-20 opacity-30">
        <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute top-1/3 right-32 opacity-30">
        <Sparkles className="w-8 h-8 text-purple-400 animate-bounce" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 opacity-30">
        <Heart className="w-5 h-5 text-pink-400 animate-pulse delay-300" />
      </div>

      <article className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="mx-auto text-center md:max-w-[58rem] mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium mb-6 shadow-sm">
            <Mail className="w-4 h-4" />
            Contact Us
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Have questions, feedback, or just want to say hello? We'd love to
            hear from you. Our team typically responds within 24 hours.
          </p>
        </div>

        {/* Contact Form */}
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>

        {/* Additional Info */}
        <div className="mx-auto max-w-4xl mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Mail,
                title: "Email Us",
                desc: "Get a response within 24hrs",
                highlight: "Quick Response",
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                desc: "Chat with our support team",
                highlight: "Coming Soon",
              },
              {
                icon: Heart,
                title: "Community",
                desc: "Join our growing community",
                highlight: "1000+ Users",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{item.desc}</p>
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium rounded-full">
                    {item.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
