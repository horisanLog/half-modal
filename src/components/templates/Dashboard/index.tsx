"use client"
import { HalfModal } from "@/components/molecules/HalfModal"
import { HalfModal2 } from "@/components/molecules/HalfModal/index2"
import { useModal } from "@/hooks/useModal"
import useWindowDimensions from "@/hooks/useWindow"
import React, { useEffect } from "react"
// import HalfModal from "../HalfModal"

export const DashboardTemplate: React.FC = () => {
  const { isOpen, handleOpen, handleClose } =useModal()
  const { width, height } = useWindowDimensions()

  useEffect(() => {
    const blockScroll = (e: TouchEvent) => {
      e.preventDefault()
    }

    if (isOpen) {
      // モーダルが開いているとき、背景のスクロールを無効にする
      document.body.style.overflow = "hidden"
      // document.body.addEventListener("touchmove", blockScroll, {
      //   passive: false,
      // })
    } else {
      // モーダルが閉じているとき、背景のスクロールを有効にする
      document.body.style.overflow = "auto"
      // document.body.removeEventListener("touchmove", blockScroll)
    }

    // コンポーネントがアンマウントされたときに元に戻す
    return () => {
      document.body.style.overflow = "auto"
      // document.body.removeEventListener("touchmove", blockScroll)
    }
  }, [isOpen])

  return (
    <>
      <div style={{ backgroundColor: "skyblue", height: height, width: width }}>
        <button onClick={handleOpen}>モーダルを開く</button>
      </div>
      <HalfModal isOpen={isOpen} handleClose={handleClose} />
    </>
  )
}
