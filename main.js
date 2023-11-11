import "./style.css";
import { CATEGORIES, DIFFICULTIES, TYPES, HIGH_SCORES } from "./src/constants";

// Pages
const homePage = document.querySelector("#home-page");
const mainPage = document.querySelector("#main-page");
const questionsPage = document.querySelector("#questions");
const highScoresPage = document.querySelector("#high-scores");
const resultsPage = document.querySelector("#results");

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
const username = document.querySelector("#player-name");
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

// Functions
function renderQuestion(index) {
  if (index >= quizQuestions.length) {
    // No more questions, handle end of quiz here
    resultsPage.innerHTML = "";

    questionsPage.classList.add("hidden");
    resultsPage.classList.remove("hidden");

    const percentage = Math.round(
      (correctAnswers / quizQuestions.length) * 100
    );

    const endOfQuizText = document.createElement("h2");

    if (percentage >= 70) {
      endOfQuizText.textContent =
        "Excellent work! You've mastered this material!";
    } else if (percentage >= 50) {
      endOfQuizText.textContent = "Good job! You've passed the quiz!";
    } else {
      endOfQuizText.textContent =
        "Don't worry, keep practicing and you'll get there!";
    }
    resultsPage.appendChild(endOfQuizText);

    const userScore = document.createElement("h3");
    userScore.textContent = `Your score: ${percentage}%`;
    resultsPage.appendChild(userScore);

    const correctCount = document.createElement("p");
    correctCount.textContent = `Correct answers: ${correctAnswers}`;
    resultsPage.appendChild(correctCount);

    const wrongCount = document.createElement("p");
    wrongCount.textContent = `Wrong answers: ${wrongAnswers}`;
    resultsPage.appendChild(wrongCount);

    HIGH_SCORES.push({
      username: username.value,
      score: percentage,
    });

    HIGH_SCORES.sort((a, b) => b.score - a.score);

    correctAnswers = 0;
    wrongAnswers = 0;

    const goHomeButton = document.createElement("button");
    goHomeButton.textContent = "Go Home";
    goHomeButton.addEventListener("click", () => {
      resultsPage.classList.add("hidden");
      homePage.classList.remove("hidden");
    });
    resultsPage.appendChild(goHomeButton);

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
            correctAnswers++;
          } else {
            // handle incorrect answer
            wrongAnswers++;
          }

          // render the next question
          renderQuestion(currentIndex + 1);
        };
      })(index)
    );
  });
}

// Global Variables

let quizQuestions = [];
let correctAnswers = 0;
let wrongAnswers = 0;

// Event Listeners

startButton.addEventListener("click", () => {
  homePage.classList.add("hidden");
  mainPage.classList.remove("hidden");

  username.value = "";
  numberOfQuestionsInput.value = "";
  categoryOptions.value = CATEGORIES[0].name;
  difficultyOptions.value = DIFFICULTIES[0].name;
  typeOptions.value = TYPES[0].name;
});

highScoresButton.addEventListener("click", () => {
  homePage.classList.add("hidden");
  highScoresPage.classList.remove("hidden");

  const highScoresList = document.querySelector("#high-scores-list");
  highScoresList.innerHTML = "";

  if (HIGH_SCORES.length === 0) {
    const noScores = document.createElement("p");
    noScores.textContent = "No scores yet!";
    highScoresList.appendChild(noScores);
  }

  HIGH_SCORES.forEach((score) => {
    const scoreItem = document.createElement("li");
    scoreItem.textContent = `${score.username}: ${score.score}%`;
    highScoresList.appendChild(scoreItem);
  });
});

playGameButton.addEventListener("click", async (event) => {
  event.preventDefault();

  if (!username.value || !numberOfQuestionsInput.value) {
    alert("Please enter a username and number of questions");
    return;
  } else if (
    numberOfQuestionsInput.value < 1 ||
    numberOfQuestionsInput.value > 50
  ) {
    alert("Please enter a number of questions between 1 and 50");
    return;
  }

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

  if (results.length === 0) {
    alert("No questions found, please try again");
    return;
  }
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

// restartGameButton.addEventListener("click", () => {
//   questionsPage.classList.add("hidden");
//   mainPage.classList.remove("hidden");
// });
