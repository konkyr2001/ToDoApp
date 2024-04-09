import { useEffect, useRef, useState } from "react";
import duckImg from "../../../images/duck.png";
import duckFun from "./Duck.jsx";
import quackAudio from "../../../audio/quack.mp3";
import "./Duck.css";
import Alert from "../../Alert/Alert.jsx";

export default function Duck({ colorHandler }) {
  const [previousRandomNumber, setPreviousRandomNumber] = useState();
  const duckRef = useRef();
  const audio = new Audio(quackAudio);

  useEffect(() => {
    // declare variables
    const FPS = 70;
    var bs = 0;
    var bx, by;
    var xv, yv;
    var canvas, context;
    var imgElement;

    // load canvas
    canvas = document.getElementById("area");

    // Set canvas size to match window size
    canvas.width = window.innerWidth - duckRef.current.clientWidth;
    canvas.height = window.innerHeight - duckRef.current.clientHeight;

    // Set up interval (game loop)
    setInterval(update, 1000 / FPS);

    // Ball starting position
    bx = Math.floor(Math.random() * canvas.width);
    by = Math.floor(Math.random() * canvas.height);

    // Random ball starting speed (between 25 and 100 pps)
    // xv = 50 / FPS;
    // yv = 50 / FPS;
    xv = 50 / FPS;
    yv = 50 / FPS;

    // Random ball direction
    if (Math.floor(Math.random() * 2) == 0) {
      xv = -xv;
    }
    if (Math.floor(Math.random() * 2) == 0) {
      yv = -yv;
    }

    // Get the img element
    imgElement = document.getElementById("duckImg");

    // Update function
    function update() {
      // Move the ball
      bx += xv;
      by += yv;

      // Bounce the ball off each wall
      if (bx - bs / 2 < 0 && xv < 0) {
        xv = -xv;
      }
      if (bx + bs / 2 > canvas.width && xv > 0) {
        xv = -xv;
      }
      if (by - bs / 2 < 0 && yv < 0) {
        yv = -yv;
      }
      if (by + bs / 2 > canvas.height && yv > 0) {
        yv = -yv;
      }

      // Update the position of the img element
      imgElement.style.left = bx + "px";
      imgElement.style.top = by + "px";
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth - duckRef.current.clientWidth;
      canvas.height = window.innerHeight - duckRef.current.clientHeight;
      // Reset ball position to center on resize
      // bx = Math.floor(Math.random() * canvas.width - 100) + 100
      // bx = Math.floor(Math.random() * canvas.height - 100) + 100
    });
  }, []);

  function handleButton() {
    audio.currentTime = 0;
    audio.playbackRate = 1.2;
    audio.play();

    const colorPalette = [
      "#b4b0a7",
      "#ccbd94",
      "#f47c7c",
      "#4a3f3f",
      "#c350bf",
      "#b2b7f5",
      "#3641d9",
      "#78c1f3",
      "#2fd07d",
      "#83c856",
      "#d3703c",
      "#d65757",
      "#8e0606",
      "#030202",
      "#e34f83",
      "#8c0d57",
      "#8c8c8c",
      "#670d6e",
      "#6c3870",
      "#5538bc",
      "#42366d",
      "#453e60",
      "#a0c8fd",
      "#224b81",
      "#012a60",
      "#1f7a6f",
      "#063732",
      "#28bdac",
      "#417151",
      "#31af59",
      "#00521a",
      "#386f1b",
      "#625f0e",
      "#6f6d44",
      "#403d12",
      "#944505",
      "#fa7000",
      "#610000",
      "#7c2222",
      "#bc0b0b",
    ];

    // Filter out the previous color
    const filteredColors = colorPalette.filter(
      (color) => color !== colorPalette[previousRandomNumber]
    );

    // Choose a random color from the filtered colors
    const random = Math.floor(Math.random() * filteredColors.length);
    const newColor = filteredColors[random];

    // Update the previous color index
    setPreviousRandomNumber(random);

    // Change the background color
    document.querySelector(".circles").style.backgroundColor = newColor;

    colorHandler(newColor);
  }

  return (
    <>
      <button onClick={handleButton} className="duck-button">
        <img ref={duckRef} id="duckImg" src={duckImg} alt="duck" />
      </button>
    </>
  );
}
