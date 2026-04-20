"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "../ui/sonner";
import { createJournalSchema, JournalCreate } from "@/types/journals";
import { useJournalMutations } from "@/lib/hooks/useJournals";
import { GetDateTime } from "@/lib/utils/date-time";
import { DEFAULT_CHAPTER_ID } from "@/lib/constants";
import { useNProgressRouter } from "../layout/link/CustomLink";

export function JotDown() {
  const defaultValues = {
    title: `New Journal - ${GetDateTime()}`,
    content: "",
    chapterId: DEFAULT_CHAPTER_ID,
    coverImage: "",
    date: new Date().toISOString(), // Add default value for date
    location: "",
    iv: "",
  };

  const form = useForm<z.infer<typeof createJournalSchema>>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { routerPush } = useNProgressRouter();
  const { addMutation } = useJournalMutations(DEFAULT_CHAPTER_ID);
  const { mutateAsync, isPending } = addMutation;

  const onSubmit = async (data: JournalCreate) => {
    try {
      const result = await mutateAsync(data);
      toast.success("Journal created successfully");
      routerPush(`/chapters/${DEFAULT_CHAPTER_ID}/journals/${result.id}`);
    } catch (error) {
      console.error("Error saving journal", error);
      toast.error("Failed to save journal");
    }
  };

  return (
    <Card className="p-1 max-w-full overflow-hidden transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:focus-within:shadow-[0_8px_30px_rgba(255,255,255,0.03)] focus-within:ring-1 focus-within:ring-primary/20 backdrop-blur-xl bg-background/50 dark:bg-slate-900/40">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col relative w-full">
          <FormField
            disabled={isPending}
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-0 w-full relative">
                <FormControl>
                  <Textarea
                    placeholder="Jot something down..."
                    className="min-h-[120px] max-h-96 resize-none w-full border-none shadow-none focus-visible:ring-0 p-5 pb-16 text-lg placeholder:text-muted-foreground/60 bg-transparent rounded-2xl"
                    required
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription> */}
                <FormMessage className="absolute bottom-4 left-4" />
              </FormItem>
            )}
          />
          <div className="absolute bottom-3 right-3 flex gap-2 justify-end">
            <Button
              disabled={isPending}
              type="reset"
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:bg-muted/50 rounded-xl px-3"
            >
              Clear
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              size="sm"
              className="rounded-xl px-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
