import { Calendar, CheckSquare, Clock, Edit3, Users } from "lucide-react";

export function Features() {
  return (
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
              Capture your thoughts, ideas, and memories with rich text, images,
              and more.
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
              Stay on top of your to-dos with powerful task management features.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
            <div className="rounded-full bg-primary/10 p-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Characters</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Keep track of important people in your life and your interactions
              with them.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
            <div className="rounded-full bg-primary/10 p-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Reminders</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Never forget important dates or tasks with customizable reminders.
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
  );
}
