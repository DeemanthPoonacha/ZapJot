import PageLayout from "@/components/PageLayout";
import SettingsPage from "@/components/Settings";
import React from "react";

const Settings = () => {
  return (
    <PageLayout headerProps={{ title: "Settings" }}>
      <SettingsPage />
    </PageLayout>
  );
};

export default Settings;
