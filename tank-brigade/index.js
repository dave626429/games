const canvas = document.querySelector("canvas");

const landingPage = document.querySelector("#landing-page");

const startButton = document.querySelector("#start-game-button");

const ctx = canvas.getContext("2d");

function animate() {
  requestAnimationFrame(animate);
}

function init() {}

const LANDING_CURSOR = "./assets/images/finger_up.png";
const LANDING_CURSOR_CLICK = "./assets/images/finger_down.png";
const pointerImage = new Image();
pointerImage.src = LANDING_CURSOR;
pointerImage.onload = () => {
  console.log("cursor loaded");
  pointerImage.width = 36;
  pointerImage.style.position = "fixed";
  pointerImage.style.zIndex = 100;
  pointerImage.style.pointerEvents = "none";

  landingPage.appendChild(pointerImage);
};

window.addEventListener("mousemove", (event) => {
  if (pointerImage) {
    setTimeout(() => {
      pointerImage.style.top = event.clientY - 5;
      pointerImage.style.left = event.clientX - 10;
    }, 0);
  }
});

startButton.addEventListener("mousedown", (event) => {
  pointerImage.src = LANDING_CURSOR_CLICK;
  pointerImage.style.top = event.clientY - 5;
  pointerImage.style.left = event.clientX - 10;
});

startButton.addEventListener("mouseup", (event) => {
  pointerImage.src = LANDING_CURSOR;
  pointerImage.style.top = event.clientY - 5;
  pointerImage.style.left = event.clientX - 10;
});
