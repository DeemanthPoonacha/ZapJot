import { CheckSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { CTAButton } from "./cta-section";
import { Link } from "../layout/link/CustomLink";
const appVersion = process.env.APP_VERSION;

export const Hero = () => (
  <section className="relative overflow-hidden py-[10%] px-4 md:px-6">
    <article className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center justify-between">
      <div className="space-y-6">
        <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
          <span className="font-medium">New Release</span>
          <span className="ml-2 rounded-md bg-primary/20 px-1.5 py-0.5 text-xs">
            {`v${appVersion}`}
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Turn Moments Into Memories, Ideas Into Actions
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          Journal your life, plan events, manage tasks, and keep track of
          important people and moments — all in one beautiful place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <CTAButton />
          <Link href="#how-it-works" className="w-full">
            <Button size="lg" variant="outline" className="h-12 px-8 w-full">
              Learn More
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span>It&apos;s free to use</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
      <Image
        src="/logo.webp"
        width={460}
        height={460}
        alt="ZapJot App Preview"
        priority
        className="justify-self-center lg:justify-self-end 2xl:mr-32"
      />
      {/* <ImageFrame /> */}
    </article>
  </section>
);
