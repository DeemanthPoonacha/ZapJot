export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto text-center md:max-w-[58rem]">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Start for free and unlock the full potential of your productivity.
          </p>
        </div>
        <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center py-4 sm:py-12 rounded-md shadow-md">
          <p className="text-sm sm:text-2xl font-semibold">
            🎉 ZapJot is{" "}
            <span className="underline underline-offset-2 font-bold">
              completely free
            </span>{" "}
            —{" "}
            <a href="/home" className="hover:underline font-bold">
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
            We're constantly improving ZapJot. Premium features with advanced
            capabilities are coming soon. Stay tuned for subscription options
            that will take your productivity to the next level.
          </p>
        </div>
      </div>
    </section>
  );
}
