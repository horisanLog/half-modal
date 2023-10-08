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
  overscroll-behavior: none;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  top: -60px;
  bottom: -60px;
  z-index: 103;
`

export const HalfModal = ({ isOpen }: Props): JSX.Element => {
  return (
    <>
      <Overlay />
      {isOpen && (
      <StyledModal>
        </StyledModal>
        )}
    </>
  )
}
