import React, { useEffect, useState } from "react";

const WheelComponent = ({
  listOfPrizes,
  segColors,
  winningSegment,
  onFinished,
  primaryColor,
  contrastColor,
  buttonText,
  isOnlyOnce,
  setLotteryMessage,
}) => {
  let currentSegment = "";
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = listOfPrizes.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  const size = 290;
  let canvasContext = null;
  let maxSpeed = Math.PI / listOfPrizes.length;
  const upTime = listOfPrizes.length * 100;
  const downTime = listOfPrizes.length * 1000;
  let spinStart = 0;
  let frames = 0;
  const centerX = 300;
  const centerY = 300;
  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);
  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById("canvas");
    if (/Trident|MSIE|Edge\//.test(navigator.userAgent)) {
      // Internet Explorer or Edge (Legacy)
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", 1000);
      canvas.setAttribute("height", 600);
      canvas.setAttribute("id", "canvas");
      document.getElementById("wheel").appendChild(canvas);
    }
    canvas.addEventListener("click", spin, false);
    canvasContext = canvas.getContext("2d");
  };

  const spin = () => {
    if (timerHandle !== 0) return;
    setLotteryMessage?.("");
    setFinished(false);
    spinStart = new Date().getTime();
    maxSpeed = Math.PI / listOfPrizes.length;
    frames = 0;
    timerHandle = setInterval(onTimerTick, timerDelay);
  };
  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > listOfPrizes.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta =
          maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key, lastAngle, angle) => {
    const ctx = canvasContext;
    const value = listOfPrizes[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor || "white";
    ctx.font = "900 22px proxima-nova";
    ctx.shadowColor = "rgba(20, 26, 38, 0.72)";
    ctx.shadowBlur = 4;
    ctx.fillText(getShortTitle(value.title), size / 2 + 18, 0);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.restore();
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = listOfPrizes.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "16px proxima-nova";
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = "#202A3A";
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#FFFFFF";
    ctx.fill();
    ctx.font = "900 17px proxima-nova";
    ctx.fillStyle = contrastColor || "white";
    ctx.textAlign = "center";

    ctx.fillText(buttonText || "Spin", centerX, centerY + 3);

    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = 12;
    ctx.strokeStyle = primaryColor || "#F4B942";
    ctx.stroke();
  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fillStyle = contrastColor || "white";
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i =
      listOfPrizes.length -
      Math.floor((change / (Math.PI * 2)) * listOfPrizes.length) -
      1;
    if (i < 0) i = i + listOfPrizes.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#202A3A";
    ctx.font = "900 28px proxima-nova";
    currentSegment = listOfPrizes[i];
    if (isFinished) {
      ctx.fillText(currentSegment.title, centerX + 10, centerY + size + 50);
    }
  };
  const getShortTitle = (title) => {
    if (title.includes("-25%")) return "-25%";
    if (title.includes("-20%")) return "-20%";
    if (title.includes("-15%")) return "-15%";
    if (title.includes("-10%")) return "-10%";
    return title.replace("darmowa", "gratis");
  };
  const clear = () => {
    const ctx = canvasContext;
    ctx.clearRect(0, 0, 600, 600);
  };
  return (
    <canvas
      id="canvas"
      width="600"
      height="600"
      style={{
        display: "block",
        height: "auto",
        maxWidth: "100%",
        width: "min(600px, 100%)",
        pointerEvents:
          timerHandle !== 0 || (isFinished && isOnlyOnce) ? "none" : "auto",
      }}
    />
  );
};
export default WheelComponent;
