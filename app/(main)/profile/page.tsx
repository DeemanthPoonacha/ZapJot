import PageLayout from "@/components/PageLayout";
import Profile from "@/components/Profile";
import React from "react";

const ProfilePage = () => {
  return (
    <PageLayout headerProps={{ title: "Profile" }}>
      <Profile />
    </PageLayout>
  );
};

export default ProfilePage;
