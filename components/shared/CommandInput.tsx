import React, { InputHTMLAttributes } from "react";

interface CommandInputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Additional props if any
}

const CommandInput: React.FC<CommandInputProps> = ({ ...props }) => {
  return <input {...props} />;
};

export default CommandInput;
