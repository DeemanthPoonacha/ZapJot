import {
  Calendar,
  Clock,
  Edit3,
  Paintbrush,
  Users,
  MonitorSmartphone,
} from "lucide-react";

const features = [
  {
    icon: <Edit3 className="h-8 w-8 text-primary" />,
    title: "Life Logging",
    desc: "Capture your moments in journals, organize them into meaningful chapters, and effortlessly relive your favorite memories.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Planners",
    desc: "Manage events, tasks, and itineraries with built-in calendars and checklists.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "People & Relationships",
    desc: "Keep profiles of the people in your life — track birthdays, shared memories, and thoughtful details.",
  },
  {
    icon: <Paintbrush className="h-8 w-8 text-primary" />,
    title: "Customization",
    desc: "Make ZapJot your own with personalized themes and interface preferences.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Reminders",
    desc: "Stay on top of everything with smart reminders for tasks, plans, and special dates.",
  },
  {
    icon: <MonitorSmartphone className="h-8 w-8 text-primary" />,
    title: "Cross-Device Friendly",
    desc: "Enjoy a seamless, responsive experience across mobile, tablet, and desktop devices.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-muted/50 py-20 md:py-32">
      <article className="container px-4 md:px-6">
        <div className="mx-auto text-center md:max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Your life. Organized.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg md:text-xl">
            ZapJot brings journaling, planning, task management, and life
            tracking into one powerful and personal space.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="rounded-full bg-primary/10 p-4">{icon}</div>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-center text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
