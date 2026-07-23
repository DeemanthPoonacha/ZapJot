import React from "react";
import { Itinerary } from "@/types/itineraries";
import { format } from "date-fns";

interface PrintableItineraryProps {
  itinerary: Itinerary;
}

export const PrintableItinerary: React.FC<PrintableItineraryProps> = ({ itinerary }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="print-container hidden print:block p-8 bg-white text-black font-sans max-w-4xl mx-auto">
      {/* Printable Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{itinerary.title}</h1>
        {itinerary.destination && (
          <p className="text-lg text-slate-700 font-medium mt-1">📍 {itinerary.destination}</p>
        )}
        <div className="flex flex-wrap items-center gap-6 mt-3 text-sm text-slate-600">
          <span>📅 {formatDate(itinerary.startDate)} – {formatDate(itinerary.endDate)} ({itinerary.totalDays} Days)</span>
          {itinerary.budget > 0 && <span>💰 Total Budget: ${itinerary.budget.toLocaleString()}</span>}
        </div>
        {itinerary.coverImage && (
          <div className="mt-4 w-full h-48 rounded-lg overflow-hidden border border-slate-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={itinerary.coverImage} alt={itinerary.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Days & Tasks Breakdown */}
      <div className="space-y-6">
        {itinerary.days?.map((day, idx) => (
          <div key={day.id || idx} className="border border-slate-300 rounded-lg p-4 break-inside-avoid">
            <div className="flex justify-between items-baseline border-b border-slate-200 pb-2 mb-3">
              <h2 className="text-lg font-semibold text-slate-800">
                {day.title || `Day ${idx + 1}`}
              </h2>
              {day.budget > 0 && (
                <span className="text-xs font-medium text-slate-600">
                  Budget: ${day.budget}
                </span>
              )}
            </div>

            {day.tasks && day.tasks.length > 0 ? (
              <ul className="space-y-2">
                {day.tasks.map((task) => (
                  <li key={task.id} className="flex items-start justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border border-slate-400 rounded-sm text-center text-xs">
                        {task.completed ? "✓" : ""}
                      </span>
                      <span className={task.completed ? "line-through text-slate-500" : "text-slate-900"}>
                        {task.title}
                      </span>
                    </div>
                    {task.time && (
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {task.time}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No scheduled activities for this day.</p>
            )}
          </div>
        ))}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        Generated with ZapJot Planner • {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};
