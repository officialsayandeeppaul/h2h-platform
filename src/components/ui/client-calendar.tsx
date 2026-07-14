"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"

interface ClientCalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}

// Optimistic skeleton – calendar-shaped placeholder, loads fast
function CalendarSkeleton({ className }: { className?: string }) {
  return (
    <div className={`w-full min-w-0 grid grid-cols-7 gap-1.5 ${className ?? ""}`} aria-hidden>
      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
        <div key={d} className="h-8 flex items-center justify-center text-[0.75rem] text-gray-400 font-medium">{d}</div>
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-md bg-gray-100/60" />
      ))}
    </div>
  )
}

export function ClientCalendar({ className, selected, onSelect }: ClientCalendarProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  const date = selected !== undefined ? selected : internalDate
  const handleSelect = (d: Date | undefined) => {
    if (onSelect) onSelect(d)
    else setInternalDate(d)
  }
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className={`h-[280px] w-full min-w-0 ${className ?? ""}`}>
        <CalendarSkeleton className="p-3" />
      </div>
    )
  }
  
  return (
    <Calendar 
      mode="single"
      selected={date}
      onSelect={handleSelect}
      disabled={{ before: new Date() }}
      className={className}
    />
  )
}
