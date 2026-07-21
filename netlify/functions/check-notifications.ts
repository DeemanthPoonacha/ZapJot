import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  const url = "https://zap-jot.netlify.app/api/check-notifications";
  const token = process.env.NOTIF_SECRET;

  if (!token) {
    console.error("NOTIF_SECRET environment variable is missing in Netlify settings");
    return new Response("Missing NOTIF_SECRET configuration", { status: 500 });
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Endpoint returned error status ${res.status}:`, errorText);
      return new Response(`Cron trigger failed: ${res.statusText}`, { status: res.status });
    }

    const data = await res.json();
    console.log("Check-notifications result:", data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to run check-notifications cron:", error);
    return new Response("Internal error executing cron", { status: 500 });
  }
};

export const config: Config = {
  schedule: "* * * * *" // Run every minute
};
