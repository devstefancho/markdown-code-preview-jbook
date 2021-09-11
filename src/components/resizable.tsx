import { useState, useEffect } from "react";
import "./resizable.css";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    let timer: any;
    const resize = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight * 0.75);
        setInnerWidth(window.innerWidth * 0.75);
      }, 500);
      if (width > window.innerWidth * 0.75) {
        setWidth(window.innerWidth * 0.75);
      }
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [width]);
  if (direction === "vertical") {
    resizableProps = {
      width: Infinity,
      height: 400,
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, innerHeight * 0.9],
      resizeHandles: ["s"],
    };
  } else {
    resizableProps = {
      className: "resize-horizontal",
      width,
      height: Infinity,
      minConstraints: [innerHeight * 0.2, Infinity],
      maxConstraints: [innerHeight * 1.2, Infinity],
      resizeHandles: ["e"],
      onResizeStop: () => {
        // if user resize and stop resize, then use current user width
        setWidth(innerWidth);
      },
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
