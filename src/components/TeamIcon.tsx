import React from "react";
import {
  FaTrophy,
  FaShieldAlt,
  FaStar,
  FaCrown,
  FaQuestionCircle,
} from "react-icons/fa";

interface TeamIconProps {
  iconName?: string;
  className?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  trophy: FaTrophy,
  shield: FaShieldAlt,
  star: FaStar,
  crown: FaCrown,
  default: FaQuestionCircle,
};

const TeamIcon: React.FC<TeamIconProps> = ({
  iconName = "default",
  className = "",
  backgroundColor = "#cccccc",
  foregroundColor = "#ffffff",
}) => {
  const IconComponent = iconMap[iconName?.toLowerCase() || "default"];

  return (
    <div className={`icon-container ${className}`} style={{ backgroundColor }}>
      <IconComponent style={{ color: foregroundColor }} />
    </div>
  );
};

export { TeamIcon };
