import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ListCard,
  ListCardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "../../ui/input";
import { CustomizableThemeSelector } from "./CustomizableThemeSelector";
import { Button } from "../../ui/button";
import { StatChip } from "@/components/home/home-header";
import { Calendar1, CalendarDays, ListChecks, Target } from "lucide-react";

export default function ThemesPage() {
  return (
    <main className="">
      <CustomizableThemeSelector />

      <div className="mt-4 mx-auto">
        <h2 className="text-lg font-semibold">UI Components Preview</h2>

        <Tabs
          tabValues={["components", "colors"]}
          defaultValue="components"
          className="w-full"
        >
          <TabsList className="">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="relative overflow-hidden p-6 sm:p-7 bg-gradient-primary text-primary-foreground gap-4 border-none shadow-xl">
                <div className="flex items-start justify-between gap-4 z-10 relative">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-serif italic font-medium tracking-tight">
                      Banner Example
                    </h1>
                    <p className="text-sm opacity-90 mt-1">
                      Here&apos;s what&apos;s happening at a glance.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 z-10 relative">
                  <StatChip
                    icon={<ListChecks className="h-3.5 w-3.5" />}
                    count={12}
                    loading={false}
                    label="task"
                  />
                  <StatChip
                    icon={<Target className="h-3.5 w-3.5" />}
                    count={8}
                    loading={false}
                    label="goal"
                  />
                  <StatChip
                    icon={<CalendarDays className="h-3.5 w-3.5" />}
                    count={2}
                    loading={false}
                    label="event"
                  />
                </div>
              </Card>
              <ListCard>
                <CardHeader>
                  <CardTitle>List Card Example</CardTitle>
                  <CardDescription>
                    This is how a card component looks
                  </CardDescription>
                </CardHeader>
                <ListCardFooter>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-muted-foreground">
                      {"description"}
                    </span>
                    <span className="text-xs text-muted-foreground flex gap-1 items-center">
                      <Calendar1 className="h-4 w-4" />
                      Due:
                      <span className="font-medium flex gap-1 items-center">
                        {"Due Date"}
                      </span>
                    </span>
                  </div>
                </ListCardFooter>
              </ListCard>
              <Card>
                <CardHeader>
                  <CardTitle>Card Example</CardTitle>
                  <CardDescription>
                    This is how a card component looks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Cards can contain various content and are useful for
                    organizing information.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>

              <div className="space-y-4 p-6 border rounded-lg">
                <h3 className="text-lg font-medium">Form Elements</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Text Examples</h3>
              <div className="space-y-2">
                <p className="text-foreground">
                  Regular text using foreground color
                </p>
                <p className="text-muted-foreground">
                  Muted text for less important information
                </p>
                <div className="p-2 bg-muted rounded">
                  <p>Content on muted background</p>
                </div>
                <div className="p-2 bg-accent rounded">
                  <p className="text-accent-foreground">
                    Content on accent background
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6 px-0 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "background", label: "Background" },
                { name: "foreground", label: "Foreground" },
                { name: "primary", label: "Primary" },
                { name: "secondary", label: "Secondary" },
                { name: "accent", label: "Accent" },
                { name: "muted", label: "Muted" },
                { name: "border", label: "Border" },
                { name: "gradient", label: "Gradient" },
                { name: "ambient", label: "Ambient" },
              ].map((color) => (
                <Card key={color.name} className="p-4 border rounded-lg">
                  <CardHeader
                    className={`w-full h-16 mb-2 rounded ${
                      color.name === "gradient"
                        ? "bg-gradient-primary"
                        : color.name === "ambient"
                          ? "bg-gradient-ambient"
                          : `bg-${color.name}`
                    } border`}
                  ></CardHeader>
                  <p className="font-medium">{color.label}</p>
                  <p className="text-sm text-muted-foreground">{color.name}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
