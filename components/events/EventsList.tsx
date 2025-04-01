"use client";
import { Timestamp } from "firebase/firestore";
import { useEvents, useEventsOccurrenceMutations } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import { EventCard } from "./EventCard";
import { Event, EventsFilter } from "@/types/events";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { CalendarClock, RefreshCw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import ResponsiveDialogDrawer from "../ui/ResponsiveDialogDrawer";
import { getNextOccurrence } from "@/lib/utils";
import { useEffect } from "react";
import dayjs from "dayjs";

const defaultStartDate = dayjs().startOf("day");
const defaultEndDate = dayjs().add(7, "days").endOf("day");

const groupEventsByDate = (events: Event[]) => {
  const getOccurrenceDate = (date: string, time: string) =>
    dayjs(`${date}${time}`).toDate();

  function getDatesBetween(
    startDate = defaultStartDate,
    endDate = defaultEndDate
  ) {
    const dates: Record<
      string,
      {
        date: string;
        weekDay: string;
        monthDay: string;
        yearDay: string;
      }
    > = {};
    let currentDate = startDate;
    const end = endDate;

    while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      if (!dates[dateStr])
        dates[dateStr] = {
          date: dateStr,
          weekDay: currentDate.day().toString(),
          monthDay: currentDate.date().toString(),
          yearDay: currentDate.format("M-D"),
        };

      currentDate = currentDate.add(1, "day");
    }

    return dates;
  }

  const dates: Record<
    string,
    {
      date: string;
      weekDay: string;
      monthDay: string;
      yearDay: string;
    }
  > = getDatesBetween();

  const dailyEvents: Event[] = [];
  const weeklyEvents: Record<string, Event[]> = {};
  const monthlyEvents: Record<string, Event[]> = {};
  const yearlyEvents: Record<string, Event[]> = {};
  const eventsByDate: Record<string, Event[]> = {};

  events.forEach((event) => {
    const nextDate = dayjs((event.nextOccurrence as Timestamp).toDate());
    const dateStr = nextDate.format("YYYY-MM-DD");
    if (event.repeat === "none") {
      if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
      eventsByDate[dateStr] = [
        ...eventsByDate[dateStr],
        {
          ...event,
          nextOccurrence: getOccurrenceDate(event.date!, event.time),
        },
      ];
    }
    if (event.repeat === "daily") dailyEvents.push(event);
    if (event.repeat === "weekly") {
      event.repeatDays.map((day) => {
        if (!weeklyEvents[day]) weeklyEvents[day] = [];
        weeklyEvents[day].push(event);
      });
    }
    if (event.repeat === "monthly") {
      event.repeatDays.map((day) => {
        if (!monthlyEvents[day]) monthlyEvents[day] = [];
        monthlyEvents[day].push(event);
      });
    }
    if (event.repeat === "yearly") {
      event.repeatDays.map((day) => {
        if (!yearlyEvents[day]) yearlyEvents[day] = [];
        yearlyEvents[day].push(event);
      });
    }
  });

  // let [startDate, endDate] = [
  //   defaultStartDate.format("YYYY-MM-DD"),
  //   defaultEndDate.format("YYYY-MM-DD"),
  // ];

  Object.entries(dates).map(([date, { weekDay, monthDay, yearDay }]) => {
    // if (dayjs(date).isBefore(startDate)) startDate = date;
    // if (dayjs(date).isAfter(endDate)) endDate = date;
    // console.log(
    //   "🚀 ~ groupEventsByDate ~ startDate, endDate:",
    //   date,
    //   dayjs(startDate),
    //   startDate,
    //   endDate
    // );

    if (!eventsByDate[date]) eventsByDate[date] = [];

    eventsByDate[date] = [
      ...eventsByDate[date],
      ...dailyEvents.map((event) => ({
        ...event,
        nextOccurrence: getOccurrenceDate(date, event.time),
      })),
    ];
    if (weeklyEvents[weekDay])
      eventsByDate[date] = [
        ...eventsByDate[date],
        ...weeklyEvents[weekDay].map((event) => ({
          ...event,
          nextOccurrence: getOccurrenceDate(date, event.time),
        })),
      ];
    if (monthlyEvents[monthDay])
      eventsByDate[date] = [
        ...eventsByDate[date],
        ...monthlyEvents[monthDay].map((event) => ({
          ...event,
          nextOccurrence: getOccurrenceDate(date, event.time),
        })),
      ];
    if (yearlyEvents[yearDay])
      eventsByDate[date] = [
        ...eventsByDate[date],
        ...yearlyEvents[yearDay].map((event) => ({
          ...event,
          nextOccurrence: getOccurrenceDate(date, event.time),
        })),
      ];
  });
  console.log("🚀 ~ Object.entries ~ weeklyEvents:", weeklyEvents);

  return eventsByDate;
};

const EventList = ({
  query,
  addNewButton,
  defaultNewEvent,
}: {
  query?: EventsFilter;
  addNewButton?: React.ReactNode;
  defaultNewEvent?: Partial<Event>;
}) => {
  console.log("🚀 ~ EventsList ~ query:", query);
  const { data: events, isLoading } = useEvents(query);
  const { selectedEventId, setSelectedEventId } = usePlanner();

  const { updateMutation } = useEventsOccurrenceMutations();

  const isDialogOpen = (dialogId: string) => selectedEventId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedEventId(selectedEventId === dialogId ? null : dialogId);
  };

  const groupedEvents = !!events?.length ? groupEventsByDate(events!) : {};

  const handleClose = () => {
    setSelectedEventId(null);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    const updatedEvents = events?.map((event) => ({
      id: event.id,
      nextOccurrence: getNextOccurrence(event)?.toDate(),
    }));
    if (updatedEvents) {
      updateMutation.mutate(
        updatedEvents as { id: string; nextOccurrence: Date }[]
      );
    }
  };

  return (
    <div className="py-6 px-4">
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Upcoming Events</span>
          <Button type="button" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))
        ) : !Object.keys(groupedEvents)?.length ? (
          <Empty
            icon={<CalendarClock className="emptyIcon" />}
            handleCreateClick={() => toggleDialog("new")}
            title="No events yet"
            subtitle="Add events to keep track of important dates and milestones"
            buttonTitle="Create First Event"
          />
        ) : (
          <>
            {!!addNewButton && (
              <Button
                type="button"
                className="w-full"
                onClick={() => toggleDialog("new")}
              >
                {addNewButton}
              </Button>
            )}
            {Object.entries(groupedEvents)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, events]) => (
                <div key={date} className="mb-8 space-y-4">
                  <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                    {dayjs(date).format("ddd, MMMM D, YYYY")}
                  </h2>
                  {events
                    .sort(({ time: a }, { time: b }) => a.localeCompare(b))
                    ?.map((event) => (
                      <div key={event.id}>
                        <EventCard
                          onClick={() => toggleDialog(event.id)}
                          event={event}
                        />
                        {isDialogOpen(event.id) && (
                          <ResponsiveDialogDrawer
                            content={
                              <EventForm
                                onClose={handleClose}
                                eventData={event}
                              />
                            }
                            title={event.title}
                            handleClose={handleClose}
                          />
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </>
        )}

        {/* Add Event Dialog */}
        {isDialogOpen("new") && (
          <ResponsiveDialogDrawer
            content={
              <EventForm
                onClose={handleClose}
                eventData={defaultNewEvent as Event}
              />
            }
            title="New Event"
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default EventList;
