import { Answer, Question } from "./data/data";

import testData from "./data/test-data.js";
 
const titleNode: HTMLHeadElement = document.querySelector("#test-title") as HTMLHeadElement
const questionNode: HTMLSpanElement = document.querySelector("#question")!
const answersNode: HTMLDivElement = document.querySelector("#answers")!
const backNode: HTMLButtonElement = document.querySelector("#back")!
const nextNode: HTMLButtonElement = document.querySelector("#next")!
const endNode: HTMLButtonElement = document.querySelector("#end")!
const questionTimeNode: HTMLSpanElement = document.querySelector("#question-time")!
const totalTimeNode: HTMLSpanElement = document.querySelector("#total-time")!
const cancelButton: HTMLButtonElement = document.querySelector("#cancel")!;
let totalIntervalId: number;
let testStartTime: Date;
const startNode: HTMLButtonElement = document.querySelector("#start")!; 
const totalTestTime = totalTimeNode.innerHTML; 
const resultSummaryNode: HTMLParagraphElement = document.querySelector("#result-summary")!;
 
titleNode.innerHTML = testData.title;
 
let currentIntervalId: number
 
localStorage.setItem("current-question-idx", "0")
localStorage.setItem("test-data", JSON.stringify(testData))

const cancelTest = (): void => {
    stopTest();
    resetTest();
    startNode.disabled = false;
};

cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    cancelTest();
});
const resetTest = (): void => {
    window.location.reload();
};
 
const shuffleQuestions = (questions: Question[]): Question[] => {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
};
 
const startTest = (): void => {
    testStartTime = new Date();
    totalIntervalId = setInterval(updateTotalTime, 1000);
    testData.questions = shuffleQuestions(testData.questions);
    localStorage.setItem("test-data", JSON.stringify(testData));
    displayQuestion();
    startNode.disabled = true;
};
 
const updateTotalTime = (): void => {
    const currentTime = new Date();
    const totalSeconds = Math.floor((currentTime.getTime() - testStartTime.getTime()) / 1000);
    totalTimeNode.innerHTML = totalSeconds.toString();
};
 
const stopTest = (): void => {
    clearInterval(currentIntervalId);
    clearInterval(totalIntervalId);
    questionTimeNode.innerHTML = '0';
};
 
startNode.addEventListener("click", (e) => {
    e.preventDefault();
    startTest();
});
 
const startCounter = (): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
    const currentQuestion: Question = JSON.parse(localStorage.getItem("test-data")!).questions[currentIdx];
    let time: number = currentQuestion.timeSpent || 0;
    questionTimeNode.innerHTML = time.toString();
    currentIntervalId = setInterval(() => {
        questionTimeNode.innerHTML = `${++time}`;
    }, 1000);
};

 
const stopCounter = (): void => {
    clearInterval(currentIntervalId);
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    const currentTimeSpent = parseInt(questionTimeNode.innerHTML);
    testData.questions[currentIdx].timeSpent = currentTimeSpent;
    localStorage.setItem("test-data", JSON.stringify(testData));
}
 

const displayQuestion = (): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
    const currentQuestion: Question = JSON.parse(localStorage.getItem("test-data")!).questions[currentIdx];
    questionNode.innerHTML = currentQuestion.question;
    displayAnswers(currentQuestion.answers);
    startCounter();
    updateNavigationButtons(currentIdx);
};

const updateNavigationButtons = (currentIdx: number): void => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    const totalQuestions = testData.questions.length;
 
    backNode.disabled = currentIdx === 0; 
    nextNode.disabled = currentIdx === totalQuestions - 1; 
};
const navigateQuestion = (moveNext: boolean): void => {
    stopCounter();
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
    updateQuestionTimeSpent(currentIdx);
    lockAnswersIfSelected(currentIdx);
    const newIdx: number = moveNext ? currentIdx + 1 : currentIdx - 1;
    localStorage.setItem("current-question-idx", `${newIdx}`);
    displayQuestion();
};

const lockAnswersIfSelected = (idx: number): void => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    const question = testData.questions[idx];
    question.answers.forEach((answer: Answer) => {
        if (answer.selected) {
            answer.locked = true;
        }
    });
    localStorage.setItem("test-data", JSON.stringify(testData));
}


const lockCurrentQuestion = (idx: number): void => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    testData.questions[idx].locked = true;
    localStorage.setItem("test-data", JSON.stringify(testData));
}
 
 
const displayAnswers = (answers: Answer[]): void => {
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
        if (!answer.locked) {
            document.getElementById(answer.id)?.addEventListener('change', () => {
                updateAnswerSelection(answer);
            });
        }
    });
};
const updateAnswerSelection = (selectedAnswer: Answer): void => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    const currentIdx = parseInt(localStorage.getItem("current-question-idx")!);
    const question = testData.questions[currentIdx];
 
    question.answers.forEach((answer: Answer) => {
        if (answer.id === selectedAnswer.id) {
            answer.selected = true;
            answer.locked = true;  
        } else {
            answer.selected = false;  
            answer.locked = true;
        }
    });
 
    localStorage.setItem("test-data", JSON.stringify(testData));
    checkIfAllAnswered();
};

const updateQuestionTimeSpent = (idx: number): void => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    const question = testData.questions[idx];
    const currentTimeSpent = parseInt(questionTimeNode.innerHTML);
    question.timeSpent = currentTimeSpent;
    localStorage.setItem("test-data", JSON.stringify(testData));
};

  const checkIfAllAnswered = (): void => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    const allAnswered = testData.questions.every((question: Question) =>
      question.answers.some((answer: Answer) => answer.selected));
    endNode.disabled = !allAnswered;
  };
 
  endNode.addEventListener("click", (e) => {
    e.preventDefault();
    stopTest();
    storeFinalResults();
});
const storeFinalResults = (): void => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    let totalPoints = 0;
    let totalTimeSpent = 0;
 

    const questionTimes = testData.questions.map((question: Question, idx: number) => {

        const isCorrect = question.answers.some(answer => answer.selected && answer.content === question.correctAnswer);
        totalPoints += isCorrect ? 1 : 0;
        totalTimeSpent += question.timeSpent || 0; 
 
        return `Pytanie ${idx + 1}: ${question.timeSpent || 0} sekund`;
    });
 
    const totalTestTime = totalTimeNode.innerHTML;
    const resultSummaryNode: HTMLParagraphElement = document.querySelector("#result-summary")!;
    resultSummaryNode.innerHTML = `Całkowity czas testu: ${totalTestTime} sekund<br>Suma punktów: ${totalPoints}`;
    document.getElementById("result-container")!.style.display = "block";

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
