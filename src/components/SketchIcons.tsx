import React from 'react';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Hand-drawn sketchy calendar icon
export const SketchCalendar: React.FC<IconProps> = ({
  size = 22,
  color = '#111111',
  strokeWidth = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Body with slightly organic corners */}
    <Path
      d="M4.5 6.5C4.5 5.5 5.3 4.6 6.5 4.6H17.5C18.6 4.6 19.5 5.5 19.5 6.5V18.8C19.5 19.8 18.6 20.6 17.5 20.6H6.5C5.3 20.6 4.5 19.8 4.5 18.8L4.5 6.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Binder rings */}
    <Path d="M8.2 2.5V5.5M15.8 2.5V5.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Header rule with slight hand-drawn tilt */}
    <Path d="M4.6 9.2H19.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Sketch dots for days */}
    <Circle cx="8.5" cy="13" r="1" fill={color} />
    <Circle cx="12" cy="13" r="1" fill={color} />
    <Circle cx="15.5" cy="13" r="1" fill={color} />
    <Circle cx="8.5" cy="16.8" r="1" fill={color} />
    <Circle cx="12" cy="16.8" r="1" fill={color} />
    <Circle cx="15.5" cy="16.8" r="1" fill={color} />
  </Svg>
);

// Hand-drawn doodle car icon
export const SketchCar: React.FC<IconProps> = ({
  size = 22,
  color = '#111111',
  strokeWidth = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Car body sketch */}
    <Path
      d="M3.5 13.5L5.5 8.2C5.8 7.4 6.6 6.8 7.5 6.8H16.2C17.1 6.8 17.9 7.4 18.2 8.2L20.5 13.5V17.2C20.5 17.8 20 18.2 19.4 18.2H18.2M3.5 17.2C3.5 17.8 4 18.2 4.6 18.2H5.8M3.2 13.5H20.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Window divider */}
    <Path d="M12 7.2V13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Wheels */}
    <Circle cx="7.8" cy="17.8" r="2.2" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="16.2" cy="17.8" r="2.2" stroke={color} strokeWidth={strokeWidth} />
    {/* Headlights doodle */}
    <Path d="M5 15H6M18 15H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Hand-drawn sketched family / people icon
export const SketchUsers: React.FC<IconProps> = ({
  size = 22,
  color = '#111111',
  strokeWidth = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Adult head */}
    <Circle cx="9.2" cy="7.2" r="3.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Adult shoulders */}
    <Path
      d="M3.8 19.5C3.8 15.8 6.5 13.2 10.2 13.2C12.5 13.2 14.5 14.3 15.6 16.2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Child / partner head */}
    <Circle cx="16.2" cy="10" r="2.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Child shoulders */}
    <Path
      d="M14.5 18.8C14.7 17.2 15.8 16 17.2 16C19.2 16 20.8 17.5 20.8 19.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// Hand-drawn wallet / subs credit card
export const SketchCard: React.FC<IconProps> = ({
  size = 22,
  color = '#111111',
  strokeWidth = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.5 6.8C3.5 5.8 4.3 5 5.3 5H18.7C19.7 5 20.5 5.8 20.5 6.8V17.2C20.5 18.2 19.7 19 18.7 19H5.3C4.3 19 3.5 18.2 3.5 17.2V6.8Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Card strip */}
    <Path d="M3.6 9.5H20.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Chip or small detail */}
    <Path d="M7 14.5H10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Hand-drawn clock
export const SketchClock: React.FC<IconProps> = ({
  size = 18,
  color = '#111111',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Hands */}
    <Path d="M12 7.5V12.2L15.2 14.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Hand-drawn map pin
export const SketchPin: React.FC<IconProps> = ({
  size = 18,
  color = '#111111',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.2C12 21.2 18.2 15.2 18.2 9.8C18.2 6.4 15.4 3.6 12 3.6C8.6 3.6 5.8 6.4 5.8 9.8C5.8 15.2 12 21.2 12 21.2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9.6" r="2.4" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Hand-drawn checkmark
export const SketchCheck: React.FC<IconProps> = ({
  size = 16,
  color = '#111111',
  strokeWidth = 1.8,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.8 12.5L9.5 17.2L19.2 6.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Hand-drawn briefcase for work calendar
export const SketchBriefcase: React.FC<IconProps> = ({
  size = 20,
  color = '#111111',
  strokeWidth = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 8.5C4 7.4 4.9 6.5 6 6.5H18C19.1 6.5 20 7.4 20 8.5V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V8.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 6.5V4.5C9 3.9 9.5 3.5 10 3.5H14C14.5 3.5 15 3.9 15 4.5V6.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path d="M4.2 12.2H19.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M10.5 11.2V13.5H13.5V11.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Hand-drawn send / paper plane icon
export const SketchSend: React.FC<IconProps> = ({
  size = 18,
  color = '#111111',
  strokeWidth = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.2 3.2L10.2 14.2M21.2 3.2L14.5 21.2L10.2 14.2M21.2 3.2L3.2 9.8L10.2 14.2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Hand-drawn little star doodle
export const SketchStar: React.FC<IconProps> = ({
  size = 16,
  color = '#111111',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2.8L14.7 8.7L21.2 9.4L16.2 13.8L17.7 20.2L12 16.8L6.3 20.2L7.8 13.8L2.8 9.4L9.3 8.7L12 2.8Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
