"use client"
import { Overlay } from "@/components/atoms/Overlay"
import useWindowDimensions from "@/hooks/useWindow"
import { delay } from "@/utils/delay"
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
  z-index: 102;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const StyledModalHeader = styled.div`
  text-align: center;
  box-shadow: 0 1px 0 0;
  padding-top: calc(20px + env(safe-area-inset-top));
  padding-bottom: 8px;
  flex-shrink: 0;
  box-sizing: border-box;
  background-color: #fff;
  top: 0;
  position: sticky;

  transition: opacity 0.5s, background-color 0.5s;
`

const StyledModalContainer = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  background-color: #fff;
  overscroll-behavior: contain;

  /* will-change: transform; // パフォーマンス最適化のつもりだったが、逆にレイヤーが作成されてパフォーマンスが落ちるのでコメントアウト transitionだけ */
  transition: transform 0.1s ease-out; // よりスムーズなトランジションを実現
`

const StyledModalBody = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
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
  z-index: 102;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background-color: #fff;
`

export const HalfModal = ({ isOpen, handleClose }: Props): JSX.Element => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const startTouchYRef = useRef<number | null>(null)
  const currentTouchYRef = useRef<number | null>(null)
  const { width, height } = useWindowDimensions()

  // ヘッダーが消えるときに段々と薄くなってなくなるようにして、ヘッダーが固定で表示されるようにする
  const headerRef = useRef<HTMLDivElement | null>(null)

  const touchStartPoint = useRef({ x: 0, y: 0 })

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
    e.preventDefault() 
    startTouchYRef.current = e.touches[0].clientY

    touchStartPoint.current.x = e.touches[0].clientX
    touchStartPoint.current.y = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault() 
    currentTouchYRef.current = e.touches[0].clientY
    if (startTouchYRef.current === null || !modalContainerRef.current) return
    
    const dragDistance = currentTouchYRef.current - startTouchYRef.current
    console.log(modalContainerRef.current.scrollTop)
    if (dragDistance < 0) return // 上にスワイプできないようにする

    modalContainerRef.current.style.overflowY = "hidden"
    modalContainerRef.current.style.transform = `translateY(${dragDistance}px)`
  }, [])

  const handleTouchEnd = useCallback(async (e) => {
    e.preventDefault() 
    if (!modalContainerRef.current || startTouchYRef.current === null) return
    modalContainerRef.current.style.overflowY = "auto"
    const dragDistance = (currentTouchYRef.current || 0) - startTouchYRef.current

    const halfModalHeight = modalContainerRef.current.offsetHeight * 0.5
    if (dragDistance > halfModalHeight) {
      // 上にちょっと上げるときのアニメーションを設定
      modalContainerRef.current.style.transition = "transform 0.3s ease-in-out"
      modalContainerRef.current.style.transform = `translateY(${
        dragDistance - 50
      }px)`

      // 300ミリ秒待機
      await delay(300)

      // 上のバウンドからすぐに下に移動
      modalContainerRef.current.style.transition = "transform 0.3s ease-in-out"
      modalContainerRef.current.style.transform = "translateY(100%)"

      // 300ミリ秒待機
      await delay(300)

      handleClose()
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
          <StyledModal
            className={isOpen ? "entered" : "exited"}
            style={{ height: `calc(${height}px - 60px)`, width: `${width}px` }}
          >
            <StyledModalContainer
              style={{
                height: `calc(${height}px - 60px)`,
                width: `${width}px`,
              }}
              ref={modalContainerRef}
            >
              <StyledModalHeader
                ref={headerRef}
                onTouchStartCapture={handleTouchStart}
                onTouchMoveCapture={handleTouchMove}
                onTouchEndCapture={handleTouchEnd}
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
