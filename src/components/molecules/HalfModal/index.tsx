"use client"
import { Overlay } from "@/components/atoms/Overlay"
import styled from "styled-components"

type Props = {
  isOpen: boolean
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
  background-color: #fff;
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
  overflow: auto;
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
`

export const HalfModal = ({ isOpen }: Props): JSX.Element => {
  return (
    <>
      {isOpen && (
        <>
          <Overlay />
          <StyledModal>
            <StyledModalHeader>header</StyledModalHeader>
            <StyledModalBody>
              <StyledContent>
              {Array.from({ length: 100 }, (_, i) => (
                <p key={i}>
                  コンテンツ {i}
                </p>
              ))}
              <p>最後</p>
              </StyledContent>
            </StyledModalBody>
            <StyledModalFooter>footer</StyledModalFooter>
          </StyledModal>
        </>
      )}
    </>
  )
}
