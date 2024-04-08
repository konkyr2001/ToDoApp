import { useState, useRef } from "react";
import "./Palette.css";
import Duck from "../Duck/Duck.jsx";
import Alert from "../../Alert/Alert.jsx";

function Palette() {
  const paletteRef = useRef();
  const submitRef = useRef();

  const [showSubmit, setShowSubmit] = useState(false);
  const alertRef = useRef();
  const [showAlert, setShowAlert] = useState(false);

  let initialColor;
  if (localStorage.getItem("backgroundColor") === null) {
    initialColor = "#78c1f3";
  } else {
    initialColor = localStorage.getItem("backgroundColor");
  }
  console.log("initialColor: ", initialColor);
  const [color, setColor] = useState(initialColor);

  const colorHandler = (color) => {
    setColor(color);
    document.querySelector(".circles").style.backgroundColor = color;
    submitRef.current.style.color = invertColor(color);
    setShowSubmit(true);
  };

  function submitColor() {
    localStorage.setItem("backgroundColor", color);
    setShowSubmit(false);
    setShowAlert(true);
  }

  function invertColor(color) {
    return (
      "#" +
      (
        "000000" + (0xffffff ^ parseInt(color.substring(1), 16)).toString(16)
      ).slice(-6)
    );
  }

  const displaySubmitButton = showSubmit ? "block" : "none";
  return (
    <>
      {showAlert && (
        <Alert
          ref={alertRef}
          type="success"
          title="Success!"
          message="Color saved successfully to browser!"
          setAlert={setShowAlert}
        />
      )}
      <Duck colorHandler={colorHandler} />
      <div id="color-palette">
        <div className="color-palette-container">
          <button onClick={submitColor}>
            <i
              ref={submitRef}
              className="fa-regular fa-circle-check color-check"
              style={{ display: displaySubmitButton }}
            ></i>
          </button>
          <input
            type="color"
            onInput={(e) => colorHandler(e.target.value)}
            value={color}
          />
        </div>
      </div>
    </>
  );
}

export default Palette;
