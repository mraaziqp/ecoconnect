import React from "react";
import * as Lucide from "lucide-react";

interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 20, ...props }) => {
  // Graceful fallback to HelpCircle if icon name is unknown
  const IconComponent = (Lucide as any)[name] || Lucide.HelpCircle;
  return <IconComponent className={className} size={size} {...props} />;
};
