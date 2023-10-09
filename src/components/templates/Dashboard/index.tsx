"use client"
import { HalfModal } from "@/components/molecules/HalfModal"
import { useModal } from "@/hooks/useModal"
import React, { useEffect } from "react"
// import HalfModal from "../HalfModal"

export const DashboardTemplate: React.FC = () => {
  const { isOpen, handleOpen, handleClose } =useModal()

  useEffect(() => {
    if (isOpen) {
      // モーダルが開いているとき、背景のスクロールを無効にする
      document.body.style.overflow = "hidden"
    } else {
      // モーダルが閉じているとき、背景のスクロールを有効にする
      document.body.style.overflow = "auto"
    }

    // コンポーネントがアンマウントされたときに元に戻す
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      <div>
        <button onClick={handleOpen}>モーダルを開く</button>
      </div>
      <HalfModal isOpen={isOpen} handleClose={handleClose} />
    </>
  )
}
