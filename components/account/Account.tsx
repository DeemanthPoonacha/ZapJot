import React from "react";
import Profile from "./Profile";
import AccountActions from "./AccountActions";
import { Separator } from "../ui/separator";

const Account = () => {
  return (
    <div>
      <Profile />
      <Separator />
      <AccountActions />
    </div>
  );
};

export default Account;
