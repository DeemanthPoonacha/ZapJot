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
import { GetDateTime } from "@/lib/utils";
import { DEFAULT_CHAPTER_ID } from "@/lib/constants";
import { useRouter } from "next/navigation";

export function JotDown() {
  const defaultValues = {
    title: `New Journal - ${GetDateTime()}`,
    content: "",
    chapterId: DEFAULT_CHAPTER_ID,
    coverImage: "",
    date: new Date().toISOString(), // Add default value for date
    location: "",
  };

  const form = useForm<z.infer<typeof createJournalSchema>>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const router = useRouter();
  const { addMutation } = useJournalMutations(DEFAULT_CHAPTER_ID);
  const { mutateAsync, isPending } = addMutation;

  const onSubmit = async (data: JournalCreate) => {
    try {
      const result = await mutateAsync(data);
      toast.success("Journal created successfully");
      router.push(`/chapters/${DEFAULT_CHAPTER_ID}/journals/${result.id}`);
    } catch (error) {
      console.error("Error saving journal", error);
      toast.error("Failed to save journal");
    }
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            disabled={isPending}
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base mb-4">
                  Jot something down...
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="max-h-96"
                    required
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex gap-2 flex-col sm:flex-row justify-end">
            <Button
              disabled={isPending}
              type="reset"
              variant="outline"
              className="max-sm:w-full"
            >
              Reset
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="max-sm:w-full"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
