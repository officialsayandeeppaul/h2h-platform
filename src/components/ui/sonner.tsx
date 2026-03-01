"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster-simple"
      icons={{
        success: <CircleCheckIcon className="size-4 text-gray-700" />,
        info: <InfoIcon className="size-4 text-gray-700" />,
        warning: <TriangleAlertIcon className="size-4 text-gray-700" />,
        error: <OctagonXIcon className="size-4 text-gray-700" />,
        loading: <Loader2Icon className="size-4 animate-spin text-gray-700" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!bg-white !text-gray-900 !border-gray-200 !shadow-lg !font-[var(--font-poppins)]",
          success: "!bg-white !text-gray-900 !border-gray-200",
          error: "!bg-white !text-gray-900 !border-gray-200",
          info: "!bg-white !text-gray-900 !border-gray-200",
          warning: "!bg-white !text-gray-900 !border-gray-200",
          description: "!text-gray-600 !font-[var(--font-poppins)]",
          title: "!font-[var(--font-poppins)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
