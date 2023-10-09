"use client"
import { Overlay } from "@/components/atoms/Overlay"
import { useCallback, useEffect, useRef } from "react"
import styled from "styled-components"

type Props = {
  isOpen: boolean
  handleClose: () => void
}

const StyledModal = styled.div`
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  overscroll-behavior: none;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  z-index: 103;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
`

const StyledModalHeader = styled.div`
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  box-shadow: 0 1px 0 0;
  z-index: 103;
  padding-top: calc(20px + env(safe-area-inset-top));
  padding-bottom: 8px;
  flex-shrink: 0;
  box-sizing: border-box;

  background-color: #fff;

  position: sticky;
  top: 0;

  transition: opacity 0.5s, background-color 0.5s;
  /* &.fixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 102; // オーバーレイより上に配置
  } */
`

const StyledModalContainer = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  overflow: auto;
  background-color: #fff;

  will-change: transform; // パフォーマンス最適化
  transition: transform 0.1s ease-out; // よりスムーズなトランジションを実現
`

const StyledModalBody = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  -webkit-tap-highlight-color: revert;
  -webkit-touch-callout: revert;
  -webkit-user-select: auto;
  -ms-user-select: auto;
  -moz-user-select: auto;
  user-select: auto;
  /* overflow-y: auto; // 縦方向のスクロールを可能にする
  touch-action: pan-y; // 縦方向のスクロールのみを許可する */
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`
const StyledContent = styled.div`
  padding: 16px;
`

const StyledModalFooter = styled.div`
  flex-shrink: 0;
  box-shadow: 0 -1px 0 rgba(46, 59, 66, calc(var(--rsbs-content-opacity, 1) *
            0.125)),
    0 2px 0 var(--rsbs-bg, #fff);
  overflow: hidden;
  z-index: 103;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background-color: #fff;
`

export const HalfModal = ({ isOpen, handleClose }: Props): JSX.Element => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const startTouchYRef = useRef<number | null>(null)
  const currentTouchYRef = useRef<number | null>(null)

  // ヘッダーが消えるときに段々と薄くなってなくなるようにして、ヘッダーが固定で表示されるようにする
  const headerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && modalContainerRef.current) {
        const scrollY = modalContainerRef.current.scrollTop
        const headerHeight = headerRef.current.offsetHeight

        // ヘッダーが完全にスクロールアウトされた場合
        if (scrollY >= headerHeight) {
          // headerRef.current.style.top = `${-scrollY}px`
          headerRef.current.style.opacity = "1"
        } else {
          headerRef.current.style.top = `0px`
          // 透明度の計算
          const opacity = 1 - scrollY / headerHeight
          headerRef.current.style.opacity = Math.max(opacity, 0).toString()
        }
      }
    }

    modalContainerRef.current?.addEventListener("scroll", handleScroll)
    return () => {
      modalContainerRef.current?.removeEventListener("scroll", handleScroll)
    }
  }, [isOpen])
  //////////////////////////////////////////////////////////////////////////////////////

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startTouchYRef.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    currentTouchYRef.current = e.touches[0].clientY
    if (startTouchYRef.current === null || !modalContainerRef.current) return

    const dragDistance = currentTouchYRef.current - startTouchYRef.current
    if (dragDistance < 0) return // 上にスワイプできないようにする

    modalContainerRef.current.style.transform = `translateY(${dragDistance}px)`
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!modalContainerRef.current || startTouchYRef.current === null) return
    const dragDistance =
      (currentTouchYRef.current || 0) - startTouchYRef.current

    const halfModalHeight = modalContainerRef.current.offsetHeight * 0.5
    if (dragDistance > halfModalHeight) {
      handleClose()
      modalContainerRef.current.style.transform = `translateY(100%)`
    } else {
      modalContainerRef.current.style.transform = `translateY(0)`
    }

    startTouchYRef.current = null
    currentTouchYRef.current = null
  }, [])

  return (
    <>
      {isOpen && (
        <>
          <Overlay />
          <StyledModal>
            <StyledModalContainer ref={modalContainerRef}>
              <StyledModalHeader
                ref={headerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                header
              </StyledModalHeader>
              <StyledModalBody>
                <StyledContent>
                  {Array.from({ length: 100 }, (_, i) => (
                    <p key={i}>コンテンツ {i}</p>
                  ))}
                  <p>最後</p>
                </StyledContent>
              </StyledModalBody>
            </StyledModalContainer>
            <StyledModalFooter>footer</StyledModalFooter>
          </StyledModal>
        </>
      )}
    </>
  )
}
