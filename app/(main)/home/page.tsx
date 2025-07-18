import { PageHeader } from "@/components/layout/page-header";
import { HomeHeader } from "@/components/home/home-header";
import { QuickActions } from "@/components/home/quick-actions";
import { UpcomingEvents } from "@/components/home/upcoming-events";
// import { RecentActivity } from "@/components/home/recent-activity";
// import { MoodTracker } from "@/components/home/mood-tracker";
import { TodaysFocus } from "@/components/home/todays-focus";
import PageLayout from "@/components/layout/PageLayout";
import { PendingTasks } from "@/components/home/pending-tasks";
import { JotDown } from "@/components/home/jot-down";
// import Image from "next/image";
import { Logo } from "@/components/layout/Logo";

export default function HomePage() {
  return (
    <PageLayout floatingButtonProps={{ showChatBot: true }}>
      <PageHeader icon={<Logo />} />
      <div className="space-y-6">
        <HomeHeader />
        <QuickActions />
        <div className="grid md:grid-cols-2 gap-4">
          <UpcomingEvents />
          <PendingTasks />
          {/* <RecentActivity /> */}
        </div>
        <JotDown />
        {/* <MoodTracker /> */}
        <TodaysFocus />
      </div>
    </PageLayout>
  );
}
