"use client"

import { useCallback, useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number]
  squaresClassName?: string
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  squaresClassName,
  className,
  ...props
}: InteractiveGridPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const squareX = Math.floor(x / width)
      const squareY = Math.floor(y / height)
      const index = squareY * squares[0] + squareX

      if (squareX >= 0 && squareX < squares[0] && squareY >= 0 && squareY < squares[1]) {
        setHoveredSquare(index)
      } else {
        setHoveredSquare(null)
      }
    },
    [width, height, squares]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredSquare(null)
  }, [])

  return (
    <svg
      ref={containerRef}
      className={cn(
        "pointer-events-auto absolute inset-0 h-full w-full",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {Array.from({ length: squares[0] * squares[1] }).map((_, index) => {
        const x = (index % squares[0]) * width
        const y = Math.floor(index / squares[0]) * height
        const isHovered = hoveredSquare === index
        const distance = hoveredSquare !== null
          ? Math.abs((index % squares[0]) - (hoveredSquare % squares[0])) +
            Math.abs(Math.floor(index / squares[0]) - Math.floor(hoveredSquare / squares[0]))
          : Infinity
        const opacity = isHovered ? 0.3 : distance <= 2 ? 0.1 - distance * 0.03 : 0

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "transition-all duration-300 ease-out",
              squaresClassName
            )}
            fill="currentColor"
            fillOpacity={opacity}
          />
        )
      })}
    </svg>
  )
}
