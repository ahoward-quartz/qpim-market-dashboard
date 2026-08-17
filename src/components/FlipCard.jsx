import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const TRANSITION_MS = 500

// A 3D flip container for two full "faces" (front/back).
//
// At rest, only the currently-active face is mounted, in normal document
// flow — no absolute positioning, no height matching against the other
// face. That means a card's front behaves exactly as if the flip feature
// didn't exist at all; it never grows or shrinks because of back content.
//
// While flipping, both faces mount briefly (the classic 3D-flip technique:
// stacked absolutely, `backface-visibility: hidden`, the back pre-rotated
// 180° so it reads right-side-up once the rotation completes) and the
// container snaps to the destination face's natural height for the
// duration of the animation.
export function FlipCard({ flipped, front, back }) {
  const [activeSide, setActiveSide] = useState(flipped ? "back" : "front")
  const [animating, setAnimating] = useState(false)
  // The rotation actually applied to .flip-panel. Kept separate from the
  // `flipped` prop: on the frame both faces first mount, this starts at
  // the CURRENT rotation (not the target) so there's a real "from" state
  // to transition away from — an element can't animate its own initial
  // paint, only a change from one already-painted state to another.
  const [rotated, setRotated] = useState(flipped)
  const [sceneHeight, setSceneHeight] = useState(null)

  const restRef = useRef(null)
  const frontRef = useRef(null)
  const backRef = useRef(null)

  useLayoutEffect(() => {
    const targetSide = flipped ? "back" : "front"
    if (targetSide === activeSide) return

    // Mount both faces at the current rotation first (matching what's
    // already on screen) and lock in the current height so nothing jumps
    // for a frame.
    setSceneHeight(restRef.current?.offsetHeight ?? null)
    setRotated(activeSide === "back")
    setAnimating(true)

    // Two frames: the first lets the browser paint that starting state:
    // only then does changing to the target rotation register as an
    // actual transition (and fire transitionend) rather than an instant,
    // unanimated initial value.
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const targetEl = targetSide === "back" ? backRef.current : frontRef.current
        setSceneHeight(targetEl?.offsetHeight ?? null)
        setRotated(targetSide === "back")
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped])

  function handleTransitionEnd(event) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") {
      return
    }
    setActiveSide(flipped ? "back" : "front")
    setAnimating(false)
    setSceneHeight(null)
  }

  if (!animating) {
    return <div ref={restRef}>{activeSide === "front" ? front : back}</div>
  }

  return (
    <div className="flip-scene" style={{ height: sceneHeight ?? undefined }}>
      <div
        className={cn("flip-panel", rotated && "flip-panel-flipped")}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div ref={frontRef} className="flip-face" inert={flipped || undefined}>
          {front}
        </div>
        <div ref={backRef} className="flip-face flip-face-back" inert={!flipped || undefined}>
          {back}
        </div>
      </div>
    </div>
  )
}
