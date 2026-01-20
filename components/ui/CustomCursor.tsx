import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      if (isHidden) setIsHidden(false);
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const mouseOverHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        target.style.cursor === "pointer";

      setIsPointer(!!isClickable);
    };

    const mouseDownHandler = () => setIsClicking(true);
    const mouseUpHandler = () => setIsClicking(false);

    const mouseEnterHandler = () => setIsHidden(false);
    const mouseLeaveHandler = () => setIsHidden(true);

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseover", mouseOverHandler);
    document.addEventListener("mousedown", mouseDownHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("mouseenter", mouseEnterHandler);
    document.addEventListener("mouseleave", mouseLeaveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseover", mouseOverHandler);
      document.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mouseenter", mouseEnterHandler);
      document.removeEventListener("mouseleave", mouseLeaveHandler);
    };
  }, [isHidden]);

  // Only render on non-touch devices to avoid UX issues on mobile
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return null;
  }

  return (
    <>
      <style>{`
                @media (pointer: fine) {
                    body {
                        cursor: none; /* Hide default cursor only on devices with a mouse */
                    }
                    button, a, input, select, textarea {
                        cursor: none !important;
                    }
                }
            `}</style>
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 will-change-transform flex items-center justify-center ${isHidden ? "opacity-0" : "opacity-100"}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-12px", // Offset to center the 24px cursor
          top: "-12px",
        }}
      >
        <div
          className={`transition-all duration-300 ease-out ${isPointer ? "scale-125 rotate-6" : "scale-100"} ${isClicking ? "scale-90" : ""}`}
        >
          {/* Heart SVG - Sage Green (#8da38d) */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#8da38d"
            className="drop-shadow-md"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </>
  );
};
