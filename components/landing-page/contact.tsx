import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("./contact-form"), {});

const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="mx-auto text-center md:max-w-[58rem] mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Have questions, feedback, or just want to say hello? We&apos;d love
            to hear from you.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
