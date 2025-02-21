import { PageHeader } from "@/components/page-header";
import { HomeHeader } from "@/components/home/home-header";
import { QuickActions } from "@/components/home/quick-actions";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { RecentActivity } from "@/components/home/recent-activity";
import { MoodTracker } from "@/components/home/mood-tracker";
import { TodaysFocus } from "@/components/home/todays-focus";
import PageLayout from "@/components/PageLayout";

export default function HomePage() {
  return (
    <PageLayout>
      <PageHeader title="DIGJOURN" />
      <div className="space-y-6 p-4">
        <HomeHeader />
        <QuickActions />
        <UpcomingEvents />
        <RecentActivity />
        <MoodTracker />
        <TodaysFocus />
      </div>
    </PageLayout>
  );
}
