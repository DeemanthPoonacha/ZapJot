import PageLayout from "@/components/layout/PageLayout";
import SettingsPage from "@/components/settings/SettingsPage";
import React from "react";

const Settings = () => {
  return (
    <PageLayout headerProps={{ title: "Settings" }}>
      <SettingsPage />
    </PageLayout>
  );
};

export default Settings;
