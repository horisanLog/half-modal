"use client"
import styled from "styled-components"

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 103;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`

export const Overlay = (): JSX.Element => {
  return (
      <StyledOverlay />
  )
}
