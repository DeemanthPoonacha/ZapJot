import React from "react";
import { Label } from "./label";
import { Input } from "./input";

const FormInput = ({
  className,
  inputProps,
  labelProps,
  extra,
}: {
  className?: string;
  inputProps?: React.ComponentProps<"input">;
  labelProps?: React.ComponentProps<"label">;
  extra?: React.ReactNode;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="relationship">Title/Relationship</Label>
      <Input {...inputProps} />
      {extra && <p className="text-red-500">{extra}</p>}
    </div>
  );
};

export default FormInput;
