import { Link } from "@/components/layout/link/CustomLink";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckSquare,
  Clock,
  Edit3,
  Users,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const logo = (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.png" width={42} height={42} alt="zapjot" />
      <span className="text-xl font-bold">ZapJot</span>
    </Link>
  );
  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {logo}
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/sign-in"
              className="hidden md:inline-flex text-sm font-medium hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/home"
              //   className="hidden md:inline-flex text-sm font-medium hover:text-primary transition-colors"
            >
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                  <span className="font-medium">New Release</span>
                  <span className="ml-2 rounded-md bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
                    v1.0
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Turn Moments Into Memories, Ideas Into Actions
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Journal your life, plan events, manage tasks, and keep track
                  of important people and moments — all in one beautiful place.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="h-12 px-8">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span>It's free to use</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              <Image
                src="/logo.png"
                width={460}
                height={460}
                alt="ZapJot App Preview"
                priority
                className="justify-self-center lg:justify-self-end 2xl:mr-32"
              />
              {/* <ImageFrame /> */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto text-center md:max-w-[58rem]">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything you need, all in one place
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                ZapJot combines the best of journaling, planning, and task
                management in a single, intuitive interface.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <Edit3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Journaling</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Capture your thoughts, ideas, and memories with rich text,
                  images, and more.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Planning</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Organize your schedule with intuitive calendar views and event
                  management.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <CheckSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Tasks</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Stay on top of your to-dos with powerful task management
                  features.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Characters</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Keep track of important people in your life and your
                  interactions with them.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Reminders</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Never forget important dates or tasks with customizable
                  reminders.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M12 2v1" />
                    <path d="M12 21v1" />
                    <path d="M4.93 4.93l.7.7" />
                    <path d="M18.36 18.36l.7.7" />
                    <path d="M2 12h1" />
                    <path d="M21 12h1" />
                    <path d="M4.93 19.07l.7-.7" />
                    <path d="M18.36 5.64l.7-.7" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-bold">Insights</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Gain valuable insights into your habits, productivity, and
                  personal growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto text-center md:max-w-[58rem]">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How ZapJot Works
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Getting started is easy. Here's how you can transform your
                productivity in just a few steps.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="relative flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    1
                  </div>
                  <h3 className="mt-6 text-xl font-bold">Create an account</h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    Sign up for free and set up your personal profile in
                    seconds.
                  </p>
                  <div className="absolute left-[calc(50%+32px)] top-6 hidden h-0.5 w-[85%] lg:w-[90%] bg-border md:block" />
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    2
                  </div>
                  <h3 className="mt-6 text-xl font-bold">
                    Customize your space
                  </h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    Set up your journal, calendar, and task lists to match your
                    workflow.
                  </p>
                  <div className="absolute left-[calc(50%+32px)] top-6 hidden h-0.5 w-[85%] lg:w-[90%] bg-border md:block" />
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    3
                  </div>
                  <h3 className="mt-6 text-xl font-bold">
                    Start capturing life
                  </h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    Begin journaling, planning, and organizing your life all in
                    one place.
                  </p>
                </div>
              </div>
              <div className="mt-16 flex justify-center">
                <ImageFrame />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-muted/50 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto text-center md:max-w-[58rem]">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Loved by thousands
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Don't just take our word for it. Here's what our users have to
                say about ZapJot.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col rounded-lg border bg-background p-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    width={60}
                    height={60}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">
                      Product Designer
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1">
                  <p className="text-muted-foreground">
                    "ZapJot has completely transformed how I organize my life.
                    The journaling feature helps me process my thoughts, and the
                    task management keeps me on track. It's like having a
                    personal assistant!"
                  </p>
                </blockquote>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    width={60}
                    height={60}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Michael Chen</h3>
                    <p className="text-sm text-muted-foreground">
                      Software Engineer
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1">
                  <p className="text-muted-foreground">
                    "As someone who juggles multiple projects, ZapJot has been a
                    game-changer. The interface is intuitive, and having
                    everything in one place saves me hours each week. Highly
                    recommend!"
                  </p>
                </blockquote>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    width={60}
                    height={60}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Emily Rodriguez</h3>
                    <p className="text-sm text-muted-foreground">
                      Content Creator
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1">
                  <p className="text-muted-foreground">
                    "I've tried dozens of productivity apps, but ZapJot is the
                    first one that actually stuck. The character tracking
                    feature is unique and helps me maintain meaningful
                    relationships."
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="container">
            <div className="mx-auto text-center md:max-w-[58rem]">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Start for free and unlock the full potential of your
                productivity.
              </p>
            </div>
            <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center py-4 sm:py-12 rounded-md shadow-md">
              <p className="text-sm sm:text-2xl font-semibold">
                🎉 ZapJot is{" "}
                <span className="underline underline-offset-2 font-bold">
                  completely free
                </span>{" "}
                —{" "}
                <a href="/signup" className="hover:underline font-bold">
                  Get started today!
                </a>
              </p>
            </div>

            {/* Pricing Cards */}
            {/* <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
              <div className="flex flex-col rounded-xl border-2 border-primary/20 bg-background p-8 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">Free</h3>
                    <p className="text-muted-foreground">
                      Everything you need to get started
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">$0</div>
                    <p className="text-sm text-muted-foreground">Free</p>
                  </div>
                </div>
                <div className="mt-8 grid gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Journals and entries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Basic task management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Calendar integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Character tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Basic reminders</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="w-full">
                    Get Started
                  </Button>
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  No credit card required
                </p>
              </div>
              <div className="relative flex flex-col rounded-xl border-2 border-primary bg-background p-8 shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Popular
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">Premium</h3>
                    <p className="text-muted-foreground">For power users</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">$X</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
                <div className="mt-8 grid gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Advanced feature 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Advanced feature 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Advanced feature 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Advanced feature 4</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="w-full">
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div> */}

            {/* More Info Section */}
            <div className="mx-auto mt-16 max-w-3xl rounded-lg border bg-muted/50 p-8">
              <h3 className="text-xl font-bold">Looking for more?</h3>
              <p className="mt-2 text-muted-foreground">
                We're constantly improving ZapJot. Premium features with
                advanced capabilities are coming soon. Stay tuned for
                subscription options that will take your productivity to the
                next level.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 mb-20 md:mb-32 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-3xl bg-primary/15 p-8 text-center md:p-12 lg:p-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to transform your productivity?
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Join thousands of users who have already revolutionized how they
                journal, plan, and manage their lives.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="h-12 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* <Button size="lg" variant="outline" className="h-12 px-8">
                  See Pricing
                </Button> */}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. It's free to use!
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              {logo}
              <p className="mt-4 text-sm text-muted-foreground">
                Turn moments into memories, ideas into actions. Your all-in-one
                productivity companion.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center py-2 rounded-md shadow-md">
            <p className="text-sm sm:text-xl font-semibold">
              🎉 ZapJot is{" "}
              <span className="underline underline-offset-2 font-bold">
                completely free
              </span>{" "}
              —{" "}
              <a href="/signup" className="hover:underline font-bold">
                Get started today!
              </a>
            </p>
          </div>

          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} ZapJot. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ImageFrame({
  imageSrc = "/screenshots/chapters.png",
}: {
  imageSrc?: string;
}) {
  return (
    <div className="relative mx-auto">
      <div className="relative rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 p-2 shadow-xl">
        <Image
          src={imageSrc}
          width={400}
          height={600}
          alt="ZapJot App Preview"
          className="rounded-xl shadow-sm"
          priority
        />
      </div>
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
    </div>
  );
}
