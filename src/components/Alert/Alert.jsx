import "./Alert.css";
import { useState, useRef, forwardRef, useEffect } from "react";
const Alert = forwardRef(function Alert(
  { type, title, message, setAlert },
  ref
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current.classList.add("fade-out");
      setTimeout(() => {
        setAlert(false);
        ref.current.classList.remove("fade-out");
      }, 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="alert" className={`alert alert-${type} `} role="alert" ref={ref}>
      <i className="fa-solid fa-circle-exclamation"></i> {message}
    </div>
  );
});

export default Alert;
