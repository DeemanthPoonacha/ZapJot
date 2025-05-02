import Image from "next/image";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted/50 py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto text-center md:max-w-[58rem]">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by thousands
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            {
              "Don't just take our word for it. Here's what our users have to say about ZapJot."
            }
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
                {
                  "ZapJot has completely transformed how I organize my life. The journaling feature helps me process my thoughts, and the task management keeps me on track. It's like having a personal assistant!"
                }
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
                {
                  "As someone who juggles multiple projects, ZapJot has been a game-changer. The interface is intuitive, and having everything in one place saves me hours each week. Highly recommend!"
                }
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
                <p className="text-sm text-muted-foreground">Content Creator</p>
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
                {
                  "I've tried dozens of productivity apps, but ZapJot is the first one that actually stuck. The character tracking feature is unique and helps me maintain meaningful relationships."
                }
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
