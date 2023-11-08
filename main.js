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

// Input Fields
const numberOfQuestionsInput = document.querySelector("#number-of-questions");
const categoryOptions = document.querySelector("#category");
const difficultyOptions = document.querySelector("#difficulty");
const typeOptions = document.querySelector("#type");

categoryOptions.innerHTML = CATEGORIES.map(
  (category) => `<option value="${category.name}">${category.name}</option>`
).join("");

difficultyOptions.innerHTML = DIFFICULTIES.map(
  (difficulty) =>
    `<option value="${difficulty.name}">${difficulty.name}</option>`
).join("");

typeOptions.innerHTML = TYPES.map(
  (type) => `<option value="${type.name}">${type.name}</option>`
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

let quizQuestions = [];

playGameButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const numberOfQuestions = numberOfQuestionsInput.value;
  let url = `https://opentdb.com/api.php?amount=${numberOfQuestions}`;

  const selectedCategory = CATEGORIES.find(
    (category) => category.name === categoryOptions.value
  );

  const selectedDifficulty = DIFFICULTIES.find(
    (difficulty) => difficulty.name === difficultyOptions.value
  );

  const selectedType = TYPES.find((type) => type.name === typeOptions.value);

  if (selectedCategory.value) {
    url += `&category=${selectedCategory.value}`;
  }

  if (selectedDifficulty.value)
    url += `&difficulty=${selectedDifficulty.value}`;

  if (selectedType.value) {
    url += `&type=${selectedType.value}`;
  }

  const response = await fetch(url);
  const { results } = await response.json();
  quizQuestions = results.map((result) => ({
    question: result.question,
    correctAnswer: result.correct_answer,
    incorrectAnswers: result.incorrect_answers,
    type: result.type,
  }));

  renderQuestion(0);

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

function renderQuestion(index) {
  if (index >= quizQuestions.length) {
    // No more questions, handle end of quiz here
    return;
  }

  const questionDiv = document.getElementById("questions");
  questionDiv.innerHTML = "";

  const currentQuestion = quizQuestions[index];
  const questionText = document.createElement("h2");
  questionText.textContent = currentQuestion.question;
  questionDiv.appendChild(questionText);

  const answers =
    currentQuestion.type === "multiple"
      ? [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer]
      : ["True", "False"];
  answers.forEach((answer) => {
    const answerButton = document.createElement("button");
    answerButton.textContent = answer;
    questionDiv.appendChild(answerButton);

    answerButton.addEventListener(
      "click",
      ((currentIndex) => {
        return () => {
          if (answerButton.textContent === currentQuestion.correctAnswer) {
            // handle correct answer
          } else {
            // handle incorrect answer
          }

          // render the next question
          renderQuestion(currentIndex + 1);
        };
      })(index)
    );
  });
}
