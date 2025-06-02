import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import Slides from "./slides";
import { steps } from "../data";
import { CTAButton } from "../cta-button";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 relative">
      <article className="container px-4 md:px-6 relative z-10">
        {/* Enhanced header section */}
        <div className="mx-auto text-center md:max-w-[58rem] mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Simple Process
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              How ZapJot Works
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6" />

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Getting started is easy.
            <br />
            Here's how you can transform your productivity in just a few simple
            steps.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          {/* Enhanced steps grid */}
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = true; // activeStep === index;

              return (
                <div
                  key={step.number}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    isActive ? "scale-105" : "hover:scale-102"
                  }`}
                  // onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-[calc(50%+32px)] top-8 hidden h-0.5 w-[85%] lg:w-[90%] md:block overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${
                          step.color
                        } transform transition-transform duration-1000 ${
                          isActive ? "translate-x-0" : "-translate-x-full"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gray-200 -z-10" />
                    </div>
                  )}

                  {/* Step card */}
                  <div
                    className={`relative p-8 rounded-2xl border-2 transition-all duration-500 ${
                      isActive
                        ? `bg-gradient-to-br ${step.bgColor} border-transparent shadow-xl`
                        : "bg-white border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {/* Animated background gradient */}
                    {isActive && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 rounded-2xl`}
                      />
                    )}

                    <div className="relative flex flex-col items-center text-center">
                      {/* Step number with icon */}
                      <div
                        className={`relative flex h-16 w-16 items-center justify-center rounded-full mb-6 transition-all duration-500 ${
                          isActive
                            ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110`
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <div
                          className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                            isActive
                              ? "bg-white text-gray-800 shadow-md"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step.number}
                        </div>

                        {/* Animated ring */}
                        {isActive && (
                          <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-20 animate-ping`}
                          />
                        )}
                      </div>

                      <h3
                        className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                          isActive ? "text-gray-900" : "text-gray-800"
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p
                        className={`text-base leading-relaxed transition-colors duration-300 ${
                          isActive ? "text-gray-700" : "text-gray-600"
                        }`}
                      >
                        {step.description}
                      </p>

                      {isActive && (
                        <div className="mt-4 pt-4 border-t border-gray-200/50">
                          <p className="text-sm text-gray-600 italic">
                            {step.details}
                          </p>
                        </div>
                      )}

                      {/* Completion checkmark */}
                      {isActive && (
                        <div className="absolute -top-2 -right-2">
                          <CheckCircle
                            className={`w-6 h-6 text-green-500 bg-white rounded-full`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to action */}
          <div className="text-center mb-12">
            <CTAButton
              text="See It in Action"
              textWhenLoggedIn="Jump Into My Workspace"
              className="rounded-full h-14  from-blue-600 to-purple-600"
            />
            <p className="mt-3 text-sm text-gray-500">
              Free to use • No credit card required
            </p>
          </div>

          {/* Enhanced slides component */}
          <Slides />
        </div>
      </article>
    </section>
  );
}
