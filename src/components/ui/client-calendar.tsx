"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"

interface ClientCalendarProps {
  className?: string
}

export function ClientCalendar({ className }: ClientCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className={`h-[280px] flex items-center justify-center ${className}`}>
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
