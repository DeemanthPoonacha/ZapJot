import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { CustomizableThemeSelector } from "./CustomizableThemeSelector";
import { Button } from "../ui/button";

export default function ThemesPage() {
  return (
    <main className="">
      <CustomizableThemeSelector />

      <div className="mt-4 mx-auto">
        <h2 className="text-lg font-semibold">UI Components Preview</h2>

        <Tabs defaultValue="components" className="w-full">
          <TabsList className="">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="flex space-x-2">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg">
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

          <TabsContent
            value="colors"
            className="space-y-6 bg-white p-2 rounded-lg"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "background", label: "Background" },
                { name: "foreground", label: "Foreground" },
                { name: "primary", label: "Primary" },
                { name: "secondary", label: "Secondary" },
                { name: "accent", label: "Accent" },
                { name: "muted", label: "Muted" },
                { name: "border", label: "Border" },
                { name: "card", label: "Card" },
                { name: "popover", label: "Popover" },
              ].map((color) => (
                <div key={color.name} className="p-4 border rounded-lg">
                  <div
                    className={`w-full h-16 mb-2 rounded bg-${color.name}`}
                  ></div>
                  <p className="font-medium">{color.label}</p>
                  <p className="text-sm text-muted-foreground">{color.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
