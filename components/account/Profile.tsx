"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useAuth } from "@/lib/context/AuthProvider";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "../ui/sonner";
import UploadAvatar from "../ui/upload-avatar";
import { CustomLoader } from "../layout/CustomLoader";

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  photoURL: z.string().url("Invalid URL").optional(),
});

const emailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

const passwordSchema = z
  .object({
    currentPasswordForChange: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Profile() {
  const { user, loading } = useAuth();
  console.log("🚀 ~ Profile ~ user:", user);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const userProviders = user?.providerData.map((profile) => profile.providerId);
  console.log("🚀 ~ Profile ~ userProviders:", userProviders);
  const isGoogleUser = userProviders?.includes("google.com");

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    },
  });

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: "",
      currentPassword: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPasswordForChange: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileUpdate = async (data: {
    displayName: string;
    photoURL?: string;
  }) => {
    try {
      if (!user) return;
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
      await user.reload(); // Revalidate user by reloading their data
      profileForm.reset(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      toast.error(`Error updating profile: ${errorMessage}`);
    }
  };

  const handleEmailUpdate = async (data: {
    newEmail: string;
    currentPassword: string;
  }) => {
    try {
      if (!user || !user.email) return;
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, data.newEmail);
      toast.success("Email updated successfully!");
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      toast.error(`Error updating email: ${errorMessage}`);
    }
  };

  const handlePasswordUpdate = async (data: {
    currentPasswordForChange: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (!user || !user.email) return;
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPasswordForChange
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);
      toast.success("Password updated successfully!");
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      toast.error(`Error updating password: ${errorMessage}`);
    }
  };

  if (loading) return <CustomLoader />;

  return (
    <div className="container mx-auto space-y-6 pb-6">
      <div className="flex flex-col gap-4">
        <p className="leading-none text-base font-semibold">
          Profile Information
        </p>
        <p className="text-muted-foreground text-sm">
          Update your profile information.
        </p>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
            className="space-y-4"
          >
            <FormField
              control={profileForm.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Display Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <UploadAvatar
              form={profileForm}
              fieldName="photoURL"
              isImageUploading={isImageUploading}
              setIsImageUploading={setIsImageUploading}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={
                profileForm.formState.isSubmitting ||
                isImageUploading ||
                (!profileForm.formState.dirtyFields.displayName &&
                  !profileForm.formState.dirtyFields.photoURL)
              }
            >
              {profileForm.formState.isSubmitting
                ? "Updating..."
                : "Update Profile"}
            </Button>
          </form>
        </Form>
      </div>

      {!isGoogleUser && (
        <Tabs tabValues={["email", "password"]} defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>
                  {`Update your email address. You'll need to provide your current password.`}
                </CardDescription>
              </CardHeader>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailUpdate)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="newEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="example@domain.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="********" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full mt-4"
                      type="submit"
                      disabled={
                        emailForm.formState.isSubmitting ||
                        !emailForm.formState.dirtyFields.newEmail ||
                        !emailForm.formState.dirtyFields.currentPassword
                      }
                    >
                      {emailForm.formState.isSubmitting
                        ? "Updating..."
                        : "Update Email"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  {`Update your password. You'll need to provide your current password.`}
                </CardDescription>
              </CardHeader>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
                >
                  <CardContent className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPasswordForChange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="********" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="********" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="********" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full mt-4"
                      type="submit"
                      disabled={
                        passwordForm.formState.isSubmitting ||
                        !passwordForm.formState.dirtyFields
                          .currentPasswordForChange ||
                        !passwordForm.formState.dirtyFields.newPassword ||
                        !passwordForm.formState.dirtyFields.confirmPassword
                      }
                    >
                      {passwordForm.formState.isSubmitting
                        ? "Updating..."
                        : "Update Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
