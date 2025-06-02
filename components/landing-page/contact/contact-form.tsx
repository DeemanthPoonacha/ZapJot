"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import {
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });
  const { errors } = form.formState;

  const isSubmitting = form.formState.isSubmitting;

  const EMAILJS_CONFIG = {
    SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
    TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
    PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
    TO_EMAIL: process.env.NEXT_PUBLIC_TO_EMAIL || "dev.deemanth@gmail.com",
    TO_NAME: process.env.NEXT_PUBLIC_TO_NAME || "Deemanth K Poonacha",
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          app_name: "Zapjot",
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          reply_to: data.email,
          to_name: EMAILJS_CONFIG.TO_NAME,
          to_email: EMAILJS_CONFIG.TO_EMAIL,
        },
        { publicKey: EMAILJS_CONFIG.PUBLIC_KEY }
      );

      setIsSubmitted(true);
      form.reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error("Email error:", err);
      form.setError("message", {
        type: "manual",
        message: "Failed to send message. Try again later.",
      });
    }
  };

  return (
    <div className="relative group">
      {/* Glassmorphism card with animated border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-10 shadow-2xl">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-4 shadow-lg">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                Thank you for reaching out. We&apos;ll get back to you within 24
                hours.
              </p>
              <div className="flex justify-center space-x-2 mt-6">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className="w-6 h-6 text-pink-400 animate-bounce"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 text-purple-500" />
                      Name
                    </FormLabel>
                    <FormControl>
                      <div className="">
                        <input
                          type="text"
                          placeholder="Your full name"
                          {...field}
                          className={`w-full px-4 py-4 bg-white/50 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 group-hover/field:bg-white/70 ${
                            errors.name
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-purple-400 focus:bg-white"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="email"
                          {...field}
                          placeholder="you@example.com"
                          className={`w-full px-4 py-4 bg-white/50 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 group-hover/field:bg-white/70 ${
                            errors.email
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-purple-400 focus:bg-white"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      Message
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <textarea
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          {...field}
                          className={`w-full px-4 py-4 bg-white/50 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 resize-none group-hover/field:bg-white/70 ${
                            errors.message
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-purple-400 focus:bg-white"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="h-16 group/btn w-full relative px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                  disabled={isSubmitting}
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-center gap-3 text-lg">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
