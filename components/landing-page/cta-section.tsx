import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export function CTASection() {
  return (
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
  );
}
