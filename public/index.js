import testData from "./data/test-data.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
let totalIntervalId;
let testStartTime;
const startNode = document.querySelector("#start");
const totalTestTime = totalTimeNode.innerHTML;
const resultSummaryNode = document.querySelector("#result-summary");
// console.log(testData)
titleNode.innerHTML = testData.title;
let currentIntervalId;
localStorage.setItem("current-question-idx", "0");
localStorage.setItem("test-data", JSON.stringify(testData));
const shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
};
const startTest = () => {
    testStartTime = new Date();
    totalIntervalId = setInterval(updateTotalTime, 1000);
    testData.questions = shuffleQuestions(testData.questions);
    localStorage.setItem("test-data", JSON.stringify(testData));
    displayQuestion();
    startNode.disabled = true;
};
const updateTotalTime = () => {
    const currentTime = new Date();
    const totalSeconds = Math.floor((currentTime.getTime() - testStartTime.getTime()) / 1000);
    totalTimeNode.innerHTML = totalSeconds.toString();
};
const stopTest = () => {
    clearInterval(currentIntervalId);
    clearInterval(totalIntervalId);
    questionTimeNode.innerHTML = '0';
};
startNode.addEventListener("click", (e) => {
    e.preventDefault();
    startTest();
});
const startCounter = () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const currentQuestion = JSON.parse(localStorage.getItem("test-data")).questions[currentIdx];
    let time = currentQuestion.timeSpent || 0;
    currentIntervalId = setInterval(() => {
        questionTimeNode.innerHTML = `${++time}`;
    }, 1000);
};
const stopCounter = () => {
    clearInterval(currentIntervalId);
    questionTimeNode.innerHTML = '0';
};
const displayQuestion = () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const currentQuestion = JSON.parse(localStorage.getItem("test-data")).questions[currentIdx];
    questionNode.innerHTML = currentQuestion.question;
    displayAnswers(currentQuestion.answers);
    startCounter();
    updateNavigationButtons(currentIdx);
};
const updateNavigationButtons = (currentIdx) => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    const totalQuestions = testData.questions.length;
    backNode.disabled = currentIdx === 0;
    nextNode.disabled = currentIdx === totalQuestions - 1;
};
const navigateQuestion = (moveNext) => {
    stopCounter();
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    updateQuestionTimeSpent(currentIdx);
    lockAnswersIfSelected(currentIdx);
    const newIdx = moveNext ? currentIdx + 1 : currentIdx - 1;
    localStorage.setItem("current-question-idx", `${newIdx}`);
    displayQuestion();
};
const lockAnswersIfSelected = (idx) => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    const question = testData.questions[idx];
    if (question.answers.some((answer) => answer.selected)) {
        question.answers.forEach((answer) => {
            if (answer.selected) {
                answer.locked = true;
            }
        });
    }
    localStorage.setItem("test-data", JSON.stringify(testData));
};
const lockCurrentQuestion = (idx) => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    testData.questions[idx].locked = true;
    localStorage.setItem("test-data", JSON.stringify(testData));
};
const displayAnswers = (answers) => {
    const answersHTML = answers.map(answer => {
        return `<div>
<input type="radio" name="answer" id="${answer.id}" value="${answer.content}"
            ${answer.selected ? 'checked' : ''}
            ${answer.locked ? 'disabled' : ''} />
<label for="${answer.id}">${answer.content}</label>
</div>`;
    });
    answersNode.innerHTML = answersHTML.join("");
    answers.forEach(answer => {
        var _a;
        if (!answer.locked) {
            (_a = document.getElementById(answer.id)) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
                updateAnswerSelection(answer);
            });
        }
    });
};
const updateAnswerSelection = (selectedAnswer) => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const question = testData.questions[currentIdx];
    question.answers.forEach((answer) => {
        if (answer.id === selectedAnswer.id) {
            answer.selected = true;
        }
    });
    localStorage.setItem("test-data", JSON.stringify(testData));
    checkIfAllAnswered();
};
const updateQuestionTimeSpent = (idx) => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    const question = testData.questions[idx];
    const currentTimeSpent = parseInt(questionTimeNode.innerHTML);
    question.timeSpent = (question.timeSpent || 0) + currentTimeSpent;
    localStorage.setItem("test-data", JSON.stringify(testData));
};
const checkIfAllAnswered = () => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    const allAnswered = testData.questions.every((question) => question.answers.some((answer) => answer.selected));
    endNode.disabled = !allAnswered;
};
endNode.addEventListener("click", (e) => {
    e.preventDefault();
    stopTest();
    storeFinalResults();
});
const storeFinalResults = () => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    let totalPoints = 0;
    let totalTimeSpent = 0;
    const questionTimes = testData.questions.map((question, idx) => {
        const isCorrect = question.answers.some(answer => answer.selected && answer.content === question.correctAnswer);
        totalPoints += isCorrect ? 1 : 0;
        totalTimeSpent += question.timeSpent || 0;
        return `Pytanie ${idx + 1}: ${question.timeSpent || 0} sekund`;
    });
    const totalTestTime = totalTimeNode.innerHTML;
    const resultSummaryNode = document.querySelector("#result-summary");
    resultSummaryNode.innerHTML = `Całkowity czas testu: ${totalTestTime} sekund<br>Suma punktów: ${totalPoints}`;
    document.getElementById("result-container").style.display = "block";
};
nextNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigateQuestion(true);
});
backNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigateQuestion(false);
});
checkIfAllAnswered();
