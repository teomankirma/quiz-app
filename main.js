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
// const restartGameButton = document.querySelector("#restart-game-btn");

// Go Back Buttons
const mainPageGoBack = document.querySelector("#main-page-go-back");
const highScoresPageGoBack = document.querySelector(
  "#high-scores-page-go-back"
);

let userAnswers = [];

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

    const endOfQuizText = document.createElement("h1");

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

    const userScore = document.createElement("h2");
    userScore.textContent = `Your score: ${percentage}%`;
    resultsPage.appendChild(userScore);

    const correctCount = document.createElement("h3");
    correctCount.textContent = `Correct answers: ${correctAnswers}`;
    resultsPage.appendChild(correctCount);

    const wrongCount = document.createElement("h3");
    wrongCount.textContent = `Wrong answers: ${wrongAnswers}`;
    resultsPage.appendChild(wrongCount);

    // Create new table
    const table = document.createElement("table");
    table.id = "results-table";

    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["Question", "Correct Answer", "Your Answer", "Result"];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    userAnswers.forEach((answer) => {
      const row = document.createElement("tr");

      const questionCell = document.createElement("td");
      questionCell.textContent = answer.question;
      row.appendChild(questionCell);

      const correctAnswerCell = document.createElement("td");
      correctAnswerCell.textContent = answer.correctAnswer;
      row.appendChild(correctAnswerCell);

      const userAnswerCell = document.createElement("td");
      userAnswerCell.textContent = answer.userAnswer;
      row.appendChild(userAnswerCell);

      const isCorrectCell = document.createElement("td");
      isCorrectCell.innerHTML = answer.isCorrect
        ? '<i style="color:green;" class="fa-solid fa-check"></i>'
        : '<i style="color:red;" class="fa-solid fa-xmark"></i>';
      row.appendChild(isCorrectCell);

      tbody.appendChild(row);
    });

    // Append tbody to table
    table.appendChild(tbody);

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "scrollable-table";
    tableWrapper.appendChild(table);

    // Append table to parent element
    resultsPage.appendChild(tableWrapper);

    HIGH_SCORES.push({
      username: username.value,
      score: percentage,
    });

    HIGH_SCORES.sort((a, b) => b.score - a.score);

    correctAnswers = 0;
    wrongAnswers = 0;
    userAnswers = [];

    const spacer = document.createElement("div");
    spacer.id = "spacer";
    resultsPage.appendChild(spacer);

    const goHomeButton = document.createElement("button");
    goHomeButton.id = "go-home-btn";
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

  const spacer = document.createElement("div");
  spacer.id = "spacer";
  questionDiv.appendChild(spacer);

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
          let isCorrect;
          if (answerButton.textContent === currentQuestion.correctAnswer) {
            // handle correct answer
            correctAnswers++;
            isCorrect = true;
          } else {
            // handle incorrect answer
            wrongAnswers++;
            isCorrect = false;
          }

          // Push the user's answer into the userAnswers array
          userAnswers.push({
            question: currentQuestion.question,
            userAnswer: answerButton.textContent,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect,
          });
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

  const highScoresTable = document.querySelector("#high-scores-table");
  const highScoresTableBody = document.querySelector(
    "#high-scores-table tbody"
  );

  highScoresTableBody.innerHTML = "";

  const noScores = document.getElementById("no-scores");
  if (noScores) {
    noScores.remove();
  }

  if (HIGH_SCORES.length === 0) {
    const noScores = document.createElement("p");
    noScores.id = "no-scores";
    noScores.textContent = "No scores yet!";
    highScoresPage.appendChild(noScores);
  } else {
    highScoresTable.classList.remove("hide-table");
  }

  HIGH_SCORES.forEach((score, index) => {
    const scoreRow = document.createElement("tr");

    if (index === 0) {
      scoreRow.classList.add("active-row");
    }

    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;
    scoreRow.appendChild(rankCell);

    const usernameCell = document.createElement("td");
    usernameCell.textContent = score.username;
    scoreRow.appendChild(usernameCell);

    const scoreCell = document.createElement("td");
    scoreCell.textContent = `${score.score}%`;
    scoreRow.appendChild(scoreCell);

    highScoresTableBody.appendChild(scoreRow);
  });
});

playGameButton.addEventListener("click", async (event) => {
  event.preventDefault();

  if (!username.value && !numberOfQuestionsInput.value) {
    alert("Please enter your name and number of questions");
    return;
  } else if (!username.value) {
    alert("Please enter your name");
    return;
  } else if (!numberOfQuestionsInput.value) {
    alert("Please enter a number of questions");
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

  function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  quizQuestions = results.map((result) => ({
    question: decodeHtml(result.question),
    correctAnswer: decodeHtml(result.correct_answer),
    incorrectAnswers: result.incorrect_answers.map(decodeHtml),
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

const apiUrl = `https://api.api-ninjas.com/v1/quotes?category=happiness`;

const fetchData = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": "ban04tUzZ5H8YOLUj3Jy/g==Q3i2BihBZLM3ZWhO",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const result = await response.json();

    const blockquote = document.querySelector("#quote");
    blockquote.innerHTML = `<p>"${result[0].quote}" - ${result[0].author}</p>`;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// fetchData();

// restartGameButton.addEventListener("click", () => {
//   questionsPage.classList.add("hidden");
//   mainPage.classList.remove("hidden");
// });
