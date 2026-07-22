import type { MetadataRoute } from "next";
// const appVersion = process.env.APP_VERSION || "1.0.0";
const tag = process.env.NEXT_PUBLIC_APP_ENV == "staging" ? " Pre-Release" : "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZapJot" + tag,
    short_name: "ZapJot" + tag,
    description:
      "A fast and intuitive personal journaling and planning app. Turn Moments Into Memories, Ideas Into Actions.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#2e0f42",
    background_color: "#0f0814",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "icon512_rounded.png",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Home",
        short_name: "Home",
        description: "Go to Home",
        url: "/home",
        icons: [{ src: "icon512_rounded.png", sizes: "512x512" }],
      },
      {
        name: "Planner",
        short_name: "Planner",
        description: "Go to Planner",
        url: "/planner",
        icons: [{ src: "icon512_rounded.png", sizes: "512x512" }],
      },
    ],
  };
}
