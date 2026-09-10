import { ReactNode } from "react";

interface SimpleFoodIconProps {
  emoji: string;
  size?: "sm" | "md" | "lg";
}

const SimpleFoodIcon = ({ emoji, size = "md" }: SimpleFoodIconProps) => {
  const sizes = {
    sm: "w-6 h-6 text-xl",
    md: "w-8 h-8 text-2xl",
    lg: "w-10 h-10 text-3xl",
  };

  return (
    <div className={`${sizes[size]} flex items-center justify-center`}>
      <span>{emoji}</span>
    </div>
  );
};

export default SimpleFoodIcon;
