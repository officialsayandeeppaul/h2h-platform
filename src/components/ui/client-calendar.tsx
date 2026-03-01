"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"

interface ClientCalendarProps {
  className?: string
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

export function ClientCalendar({ className }: ClientCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  
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
      onSelect={setDate}
      className={className}
    />
  )
}
