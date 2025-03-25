import { Itinerary } from "@/types/itineraries";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Edit, X } from "lucide-react";
import { useItineraryMutations } from "@/lib/hooks/useItineraries";
import { toast } from "../ui/sonner";

export function BudgetSummary({ itinerary }: { itinerary: Itinerary }) {
  const [isEditing, setIsEditing] = useState(false);
  const [actualCost, setActualCost] = useState(itinerary.actualCost);
  const { updateCostMutation } = useItineraryMutations();

  const handleSave = async () => {
    if (!itinerary.id) return;
    try {
      await updateCostMutation.mutateAsync({
        id: itinerary.id,
        cost: actualCost,
      });
      setIsEditing(false);
      toast.success("Itinerary updated successfully");
    } catch (error) {
      console.error("Error saving itinerary", error);
      toast.error("Failed to save itinerary");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Budget Summary</h3>
        <div>
          <Badge
            variant={
              itinerary.budget >= itinerary.actualCost
                ? "default"
                : "destructive"
            }
          >
            {itinerary.budget >= itinerary.actualCost
              ? "Under Budget"
              : "Over Budget"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-muted gap-0">
          <CardHeader className="px-4 pt-2">
            <CardTitle className="text-lg">Planned Budget</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <p className="text-3xl font-bold">
              ${itinerary.budget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted gap-0">
          <CardHeader className="px-4 pt-2">
            <CardTitle className="text-lg">Actual Expenses</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <p className="text-3xl font-bold flex items-center">
              $
              {isEditing ? (
                <Input
                  type="number"
                  value={actualCost}
                  onChange={(e) => setActualCost(parseInt(e.target.value) || 0)}
                  className="p-1 "
                />
              ) : (
                `${itinerary.actualCost.toLocaleString()}`
              )}
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-sm font-medium text-primary"
                    onClick={() => {
                      setIsEditing(false);
                      setActualCost(itinerary.actualCost);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-sm font-medium text-primary"
                    onClick={handleSave}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-sm font-medium text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {itinerary.budget >= itinerary.actualCost
                ? `$${(
                    itinerary.budget - itinerary.actualCost
                  ).toLocaleString()} under budget`
                : `$${(
                    itinerary.actualCost - itinerary.budget
                  ).toLocaleString()} over budget`}
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-lg font-semibold mt-6">Daily Budget Breakdown</h3>
      <div className="space-y-3">
        {itinerary.days.map((day: any, index: number) => (
          <div
            key={day.id}
            className="flex items-center justify-between p-3 rounded-md border"
          >
            <div className="flex items-center">
              <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="font-semibold text-sm">{index + 1}</span>
              </div>
              <p className="font-medium">{day.title}</p>
            </div>
            <p className="font-medium">${day.budget.toLocaleString()}</p>
          </div>
        ))}

        <div className="flex items-center justify-between p-3 rounded-md border-2 mt-2">
          <p className="font-semibold">Total Daily Budgets</p>
          <p className="font-semibold">
            $
            {itinerary.days
              .reduce((acc: number, day: any) => acc + day.budget, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
