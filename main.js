import "./style.css";
import { CATEGORIES, DIFFICULTIES, TYPES } from "./src/constants";

// Pages
const homePage = document.querySelector("#home-page");
const mainPage = document.querySelector("#main-page");
const questionsPage = document.querySelector("#questions");
const highScoresPage = document.querySelector("#high-scores");

// Buttons
const startButton = document.querySelector("#start-btn");
const highScoresButton = document.querySelector("#high-scores-btn");
const playGameButton = document.querySelector("#play-game-btn");
const restartGameButton = document.querySelector("#restart-game-btn");

// Go Back Buttons
const mainPageGoBack = document.querySelector("#main-page-go-back");
const highScoresPageGoBack = document.querySelector(
  "#high-scores-page-go-back"
);

// Options
const categoryOptions = document.querySelector("#category");
const difficultyOptions = document.querySelector("#difficulty");
const typeOptions = document.querySelector("#type");

categoryOptions.innerHTML = CATEGORIES.map(
  (category) => `<option value="${category}">${category}</option>`
).join("");

difficultyOptions.innerHTML = DIFFICULTIES.map(
  (difficulty) => `<option value="${difficulty}">${difficulty}</option>`
).join("");

typeOptions.innerHTML = TYPES.map(
  (type) => `<option value="${type}">${type}</option>`
).join("");

// Event Listeners

startButton.addEventListener("click", () => {
  homePage.classList.add("hidden");
  mainPage.classList.remove("hidden");
});

highScoresButton.addEventListener("click", () => {
  homePage.classList.add("hidden");
  highScoresPage.classList.remove("hidden");
});

playGameButton.addEventListener("click", (event) => {
  event.preventDefault();
  mainPage.classList.add("hidden");
  questionsPage.classList.remove("hidden");
});

mainPageGoBack.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  homePage.classList.remove("hidden");
});

highScoresPageGoBack.addEventListener("click", () => {
  highScoresPage.classList.add("hidden");
  homePage.classList.remove("hidden");
});

restartGameButton.addEventListener("click", () => {
  questionsPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
});
