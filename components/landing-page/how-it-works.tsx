import Slides from "./slides";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <article className="container px-4 md:px-6">
        <div className="mx-auto text-center md:max-w-[58rem]">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How ZapJot Works
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Getting started is easy. Here&apos;s how you can transform your
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
                Sign up for free and set up your personal profile in seconds.
              </p>
              <div className="absolute left-[calc(50%+32px)] top-6 hidden h-0.5 w-[85%] lg:w-[90%] bg-border md:block" />
            </div>
            <div className="relative flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mt-6 text-xl font-bold">Customize your space</h3>
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
              <h3 className="mt-6 text-xl font-bold">Start capturing life</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Begin journaling, planning, and organizing your life all in one
                place.
              </p>
            </div>
          </div>
          {/* <ImageFrame /> */}
          <Slides />
        </div>
      </article>
    </section>
  );
}
