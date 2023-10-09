"use client"
import { useState } from "react"

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return { handleOpen, handleClose, isOpen }
}
