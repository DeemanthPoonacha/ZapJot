import { PageHeader } from "@/components/layout/page-header";
import { HomeHeader } from "@/components/home/home-header";
import { QuickActions } from "@/components/home/quick-actions";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { RecentActivity } from "@/components/home/recent-activity";
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
      <div className="flex flex-col gap-6 w-full">
        <HomeHeader />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full items-start">
          <div className="xl:col-span-8 flex flex-col gap-6 w-full">
            <JotDown />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <UpcomingEvents />
              <PendingTasks />
            </div>
            
            <TodaysFocus />
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6 w-full sticky top-28 self-start">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
