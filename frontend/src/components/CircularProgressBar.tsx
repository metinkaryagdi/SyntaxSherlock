import React from 'react'
import './CircularProgressBar.css'

interface CircularProgressBarProps {
  percentage: number
  color?: string
  trackColor?: string
  text?: string
  showPercentage?: boolean
  textStyle?: React.CSSProperties
  size?: number
  radius?: number
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  color = '#3b82f6',
  trackColor = 'rgba(255, 255, 255, 0.1)',
  text,
  showPercentage = true,
  textStyle = {},
  size = 12,
  radius = 48
}) => {
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="circular-progress-container" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        className="circular-progress-svg"
        width={radius * 2}
        height={radius * 2}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - size / 2}
          fill="none"
          stroke={trackColor}
          strokeWidth={size}
        />
        {/* Progress circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - size / 2}
          fill="none"
          stroke={color}
          strokeWidth={size}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="progress-circle"
        />
      </svg>
      
      {/* Text content */}
      <div className="circular-progress-text" style={textStyle}>
        {showPercentage && (
          <div className="percentage-text">
            {percentage}%
          </div>
        )}
        {text && (
          <div className="label-text">
            {text}
          </div>
        )}
      </div>
    </div>
  )
}

export default CircularProgressBar
