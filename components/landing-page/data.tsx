import {
  Edit3,
  Calendar,
  Users,
  Paintbrush,
  Clock,
  MonitorSmartphone,
  Sparkles,
  ShieldCheck,
  UserPlus,
  Play,
  TrendingUp,
} from "lucide-react";
import { Testimonial } from "./testimonials";

export const features = [
  {
    icon: <Edit3 className="h-8 w-8" />,
    title: "Life Logging",
    desc: "Capture your moments in journals, organize them into meaningful chapters, and effortlessly relive your favorite memories.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    shadow: "shadow-purple-200",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Planners",
    desc: "Manage events, tasks, and itineraries with built-in calendars and checklists.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    shadow: "shadow-blue-200",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "People & Relationships",
    desc: "Keep profiles of the people in your life — track birthdays, shared memories, and thoughtful details.",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    shadow: "shadow-emerald-200",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Reminders",
    desc: "Stay on top of everything with smart reminders for tasks, plans, and special dates.",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    shadow: "shadow-orange-200",
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "AI Assistant",
    desc: "Interact with a smart assistant that understands your intent and helps you create journals, reminders, tasks, and more — just by chatting.",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    shadow: "shadow-violet-200",
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Privacy & Security",
    desc: "Your journal entries are encrypted, so only you can read them. Additionally, industry-standard security measures safeguard your data when stored and transmitted.",
    gradient: "from-slate-600 to-slate-800",
    bgGradient: "from-slate-50 to-gray-50",
    shadow: "shadow-slate-200",
  },
  {
    icon: <Paintbrush className="h-8 w-8" />,
    title: "Customization",
    desc: "Make ZapJot your own with personalized themes and interface preferences.",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50",
    shadow: "shadow-pink-200",
  },
  {
    icon: <MonitorSmartphone className="h-8 w-8" />,
    title: "Cross-Device Friendly",
    desc: "Enjoy a seamless, responsive experience across mobile, tablet, and desktop devices.",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50",
    shadow: "shadow-indigo-200",
  },
];

export const originalSlides = [
  {
    id: 1,
    title: "Home",
    description:
      "Your personalized dashboard to access everything quickly and efficiently.",
    imageUrl: "/screenshots/home.webp",
  },
  {
    id: 2,
    title: "Chapters",
    description:
      "Organize journals into themed storylines and memorable moments.",
    imageUrl: "/screenshots/chapters.webp",
  },
  {
    id: 3,
    title: "Chapter",
    description: "Dive into a specific chapter with all its precious memories.",
    imageUrl: "/screenshots/chapter-tokyo.webp",
  },
  {
    id: 4,
    title: "Journal",
    description:
      "Capture thoughts, photos, and moments in beautifully rich entries.",
    imageUrl: "/screenshots/journal-tokyo-ds.webp",
  },
  {
    id: 5,
    title: "Tasks",
    description:
      "Stay on top of to-dos with flexible and intuitive task lists.",
    imageUrl: "/screenshots/tasks.webp",
  },
  {
    id: 6,
    title: "Events",
    description: "Plan events and important dates with seamless ease.",
    imageUrl: "/screenshots/events.webp",
  },
  {
    id: 7,
    title: "Itineraries",
    description: "Map out your travel or day plans step by detailed step.",
    imageUrl: "/screenshots/itineraries.webp",
  },
  {
    id: 8,
    title: "Goals",
    description: "Track your long-term goals and celebrate daily progress.",
    imageUrl: "/screenshots/goals.webp",
  },
  {
    id: 9,
    title: "Characters",
    description: "Keep meaningful notes and reminders for people in your life.",
    imageUrl: "/screenshots/characters.webp",
  },
  {
    id: 10,
    title: "Settings",
    description: "Customize your experience and tailor your preferences.",
    imageUrl: "/screenshots/settings.webp",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Designer",
    company: "TechFlow",
    avatar: "/logo.webp",
    rating: 5,
    quote:
      "ZapJot has completely transformed how I organize my life. The journaling feature helps me process my thoughts, and the task management keeps me on track. It's like having a personal assistant!",
    highlight: "transformed how I organize my life",
    gradient: "from-blue-500 to-purple-500",
    bgGradient: "from-blue-50 to-purple-50",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "DevCorp",
    avatar: "/logo.webp",
    rating: 5,
    quote:
      "As someone who juggles multiple projects, ZapJot has been a game-changer. The interface is intuitive, and having everything in one place saves me hours each week. Highly recommend!",
    highlight: "saves me hours each week",
    gradient: "from-green-500 to-teal-500",
    bgGradient: "from-green-50 to-teal-50",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Content Creator",
    company: "Creative Studio",
    avatar: "/logo.webp",
    rating: 5,
    quote:
      "I've tried dozens of productivity apps, but ZapJot is the first one that actually stuck. The character tracking feature is unique and helps me maintain meaningful relationships.",
    highlight: "first one that actually stuck",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50",
  },
  {
    id: 4,
    name: "David Park",
    role: "Marketing Director",
    company: "GrowthLab",
    avatar: "/logo.webp",
    rating: 5,
    quote:
      "The seamless integration between planning and journaling is brilliant. ZapJot has become an essential part of my daily routine, helping me stay focused and mindful.",
    highlight: "essential part of my daily routine",
    gradient: "from-orange-500 to-yellow-500",
    bgGradient: "from-orange-50 to-yellow-50",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Entrepreneur",
    company: "StartupHub",
    avatar: "/logo.webp",
    rating: 5,
    quote:
      "Running a business is chaotic, but ZapJot brings order to the madness. The goal tracking and event planning features are incredibly powerful yet simple to use.",
    highlight: "brings order to the madness",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50",
  },
  {
    id: 6,
    name: "Alex Kim",
    role: "UX Designer",
    company: "DesignCo",
    avatar: "/logo.webp",
    rating: 5,
    quote:
      "The attention to detail in ZapJot's design is outstanding. Every interaction feels thoughtful and intentional. It's clear the team really cares about user experience.",
    highlight: "outstanding attention to detail",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
];

export const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up free in seconds.",
    details: "Jump in instantly — no setup or onboarding required.",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
  },
  {
    number: 2,
    icon: Play,
    title: "Capture. Structure. Repeat.",
    description: "Capture notes, tasks, and ideas.",
    details: "Use it right away, then organize or customize as you go.",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "Build Your Flow",
    description: "Stay consistent, stay productive.",
    details: "Create your own system over time and make ZapJot truly yours.",
    color: "from-pink-500 to-pink-600",
    bgColor: "from-pink-50 to-pink-100",
  },
];
