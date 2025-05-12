import PageLayout from "@/components/layout/PageLayout";
import React from "react";
import Account from "@/components/account/Account";

const ProfilePage = () => {
  return (
    <PageLayout headerProps={{ title: "Account" }}>
      <Account />
    </PageLayout>
  );
};

export default ProfilePage;
