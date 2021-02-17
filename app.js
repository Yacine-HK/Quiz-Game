// Declare variables
let quizApp = document.querySelector(".quiz_app")
let qCount = document.querySelector(".question_count span")
let allBullets = document.querySelector(".bullets")
let bullets = document.querySelector(".bullets .spans")
let qArea = document.querySelector(".question_area")
let answerArea = document.querySelector(".answers_area")
let timer = document.querySelector(".count_down")
let submitBtn = document.querySelector(".submit_button")
let categoryBtn = document.querySelectorAll(".btn")
let categoryOverlay = document.querySelector(".category-overlay")
let categoryTitle = document.querySelector(".category span")
let timerArea = document.getElementById("app")



// Set option
let current = 0;
let rAnswersCounter = 0;
const duration = 120;
const delay = 1500;
let choosenAnswer;
let category
let timerInterval = null;


// Ajax Request
function getQuestions() {
     quizApp.style.display = "none"
     // Select the category button
     categoryBtn.forEach(btn => {
          btn.addEventListener("click", e => {
               // Target button category 
               category = e.target.dataset.category;
               categoryTitle.innerHTML = e.target.dataset.name
               quizApp.style.display = ""
               categoryOverlay.remove()
               document.title = e.target.innerHTML

               let myRequest = new XMLHttpRequest
               myRequest.onreadystatechange = function () {

                    if (this.readyState === 4 && this.status === 200) {

                         let qObject = JSON.parse(this.responseText);
                         // Shuffle the questions order
                         shuffleArray(qObject)

                         // creat bullet + questions count function
                         let qCount = qObject.length;
                         creatBullets(qCount)

                         // creat question data
                         questionData(qObject[current], qCount);

                         // Shuffle function
                         let allAnsKeys = qObject[current].answers
                         allAnsKeys.push(qObject[current].right_answer)

                         let ansKeys = Object.keys(allAnsKeys)
                         // Array to get just keys
                         let order = [...Array(ansKeys.length).keys()]

                         // The Shuffle function
                         // Make array from the all answers
                         let answersBlock = Array.from(answerArea.children);
                         // run shuffle function
                         shuffle(order)

                         // loop into the answers and make the ordre randomly
                         answersBlock.forEach((block, index) => {
                              block.style.order = order[index];
                         })

                         // run count down timer
                         countDown()
                         // Submit button
                         submitBtn.onclick = () => {

                              // declare the right answer
                              let rAnswer = qObject[current].right_answer

                              // check the right answer function
                              checkAnswer(rAnswer, qCount)

                              // increse counter by 1
                              current++;
                              setTimeout(() => {
                                   // Rerun the counter from the beginig
                                   clearInterval(timerInterval)
                                   countDown()

                                   // Delete previous question and answers
                                   qArea.innerHTML = "";
                                   answerArea.innerHTML = "";

                                   // add the new ones
                                   questionData(qObject[current], qCount);


                                   // The Shuffle function
                                   // Make array from the all answers
                                   let answersBlock = Array.from(answerArea.children);
                                   // run shuffle function
                                   shuffle(order)
                                   // loop into the answers and make the ordre randomly
                                   answersBlock.forEach((block, index) => {
                                        block.style.order = order[index];
                                   })

                                   // hundle bullets function
                                   handle(rAnswer)
                              }, delay)
                         }

                    }
               }

               myRequest.open("GET", category, true);
               myRequest.send();
          }
          )
     })

}
getQuestions()


// create question data
function questionData(obj, count) {

     if (current < count) {
          // Create question title
          qArea.innerHTML += `<h2>${obj.question}</h2>`

          // shuffle all wrong answers
          shuffleArray(obj.answers)

          // get 3 wrong answers
          const items = obj.answers.slice(0, 3)

          // Create answers
          // First create wrong answers
          for (let i = 0; i < items.length; i++) {
               answerArea.innerHTML += `<div class="answer">
               <input type="radio" id="ans_${i}" name="answers" data-answer = "${items[i]}">
               <label for="ans_${i}">${items[i]}</label> </div>`
          }
          // Second create correct answer
          answerArea.innerHTML += `<div class="answer">
          <input type="radio" id="ans_right" name="answers" data-answer = "${obj.right_answer}">
          <label for="ans_right">${obj.right_answer}</label> </div>`
     }
     // Stop adding questions and stop the timer to show results
     if (current === count) {
          // Stop the timer
          clearInterval(timerInterval)

          // Run delete content function
          deleteContent()
          setTimeout(() => {
               // Run show result function after 1500ms
               showResult(rAnswersCounter, count);
          }, 1500);
     }

}

// Check Answer function
function checkAnswer(right, count) {
     if (current < count) {
          // Get all the answer
          let allAnswers = document.getElementsByName("answers")
          let correct = document.querySelector("#ans_right")

          // Loop into the all answer + get the choosen one
          for (i = 0; i < allAnswers.length; i++) {
               if (allAnswers[i].checked) {
                    // the choosen answer
                    choosenAnswer = allAnswers[i].dataset.answer
                    // if the question is right
                    if (choosenAnswer === right) {
                         // add one to the right answers counter
                         rAnswersCounter++;
                         correct.parentNode.style.border = "1px solid #00b100";

                    } else {

                         allAnswers[i].parentNode.style.border = "2px solid #f00"
                         allAnswers[i].parentNode.style.boxShadow = "0px 0px 3px #f00"
                         correct.parentNode.style.border = "2px solid #00b100";
                    }
               }
          }

     }
}

// creat bullets function
function creatBullets(num) {
     // Number of all questions in the object
     qCount.innerHTML = num;

     // creat bullets
     for (let i = 1; i < num; i++) {
          // Add class "on" in the first span 
          if (i === 1) {
               bullets.innerHTML = `<span class="on"></span>`;
          }
          // Creating bullets
          bullets.innerHTML += `<span></span>`;
     }
}

// hundel Bullets
function handle(right) {
     let bulletsSpan = document.querySelectorAll(".bullets .spans span")

     // Make an array from spans bullets
     let bulletsArray = Array.from(bulletsSpan)

     bulletsArray.forEach((span, index) => {
          // Add class "on" in the current bullet
          if (choosenAnswer === right) {
               bulletsSpan[current - 1].className = "true"
          } else {
               bulletsSpan[current - 1].className = "false"
          }
          if (current === index) {
               span.className = "on"
          }
     })

}


// Shuffle The answers function
function shuffle(array) {
     // Make New Array With deferent Order From orderRange
     let random;
     let temp;
     let currOrder = array.length;

     while (currOrder > 0) {
          random = Math.floor(Math.random() * currOrder);
          currOrder--;

          // [1] Save Current Element In Temp
          temp = array[currOrder];

          // [2] Current Element = Random Element
          array[currOrder] = array[random];

          // [3] Random Element = temp;
          array[random] = temp;
     }
     return array;
}

// Show result function
function showResult(right, count) {
     allBullets.remove()

     quizApp.innerHTML += `<div class="results"></div>`
     let resultText = document.querySelector(".results")

     // the result text
     if (right === count) {
          resultText.innerHTML = `<div><span class="perfect">Perfect</span> you answer all</div>`
     }
     else if (right >= (count / 2)) {
          resultText.innerHTML = `<div><span class="good">Good</span> you got ${right} from ${count}</div>`
     }
     else if (right < (count / 2) && right != 0) {
          resultText.innerHTML = `<div><span class="bad">Bad</span> you got ${right} from ${count}</div>`
     }
     else if (right === 0) {
          resultText.innerHTML = `<div><span class="very-bad">Very bad !</span> all answers are wrong </div>`
     }
}

// Delete Content to show the result
function deleteContent() {
     qArea.remove()
     answerArea.remove()
     submitBtn.remove()
}

// Shuffle questions order
function shuffleArray(array) {
     for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
     }
}

// Shuffle just worng answers
function shuffleArray(array) {
     for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
     }
}


// Cool count down
function countDown() {
     // Credit: Mateusz Rybczonec
     const FULL_DASH_ARRAY = 283;
     const WARNING_THRESHOLD = 10;
     const ALERT_THRESHOLD = 5;

     const COLOR_CODES = {
          info: {
               color: "green"
          },
          warning: {
               color: "orange",
               threshold: WARNING_THRESHOLD
          },
          alert: {
               color: "red",
               threshold: ALERT_THRESHOLD
          }
     };

     let timePassed = 0;
     let timeLeft = duration;
     let remainingPathColor = COLOR_CODES.info.color;

     document.getElementById("app").innerHTML = `
     <div class="base-timer">
     <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
     <g class="base-timer__circle">
     <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
     <path
     id="base-timer-path-remaining"
     stroke-dasharray="283"
     class="base-timer__path-remaining ${remainingPathColor}"
     d="
     M 50, 50
     m -45, 0
     a 45,45 0 1,0 90,0
     a 45,45 0 1,0 -90,0
     "
     ></path>
     </g>
     </svg>
     <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
     </div>
     `;

     startTimer();

     function onTimesUp() {
          clearInterval(timerInterval);
          submitBtn.click();
     }

     function startTimer() {
          timerInterval = setInterval(() => {
               timePassed = timePassed += 1;
               timeLeft = duration - timePassed;
               document.getElementById("base-timer-label").innerHTML = formatTime(
                    timeLeft
               );
               setCircleDasharray();
               setRemainingPathColor(timeLeft);

               if (timeLeft === 0) {
                    onTimesUp();
               }
          }, 1000);
     }

     function formatTime(time) {
          const minutes = Math.floor(time / 60);
          let seconds = time % 60;

          if (seconds < 10) {
               seconds = `0${seconds}`;
          }

          return `${minutes}:${seconds}`;
     }

     function setRemainingPathColor(timeLeft) {
          const { alert, warning, info } = COLOR_CODES;
          if (timeLeft <= alert.threshold) {
               document
                    .getElementById("base-timer-path-remaining")
                    .classList.remove(warning.color);
               document
                    .getElementById("base-timer-path-remaining")
                    .classList.add(alert.color);
          } else if (timeLeft <= warning.threshold) {
               document
                    .getElementById("base-timer-path-remaining")
                    .classList.remove(info.color);
               document
                    .getElementById("base-timer-path-remaining")
                    .classList.add(warning.color);
          }
     }

     function calculateTimeFraction() {
          const rawTimeFraction = timeLeft / duration;
          return rawTimeFraction - (1 / duration) * (1 - rawTimeFraction);
     }

     function setCircleDasharray() {
          const circleDasharray = `${(
               calculateTimeFraction() * FULL_DASH_ARRAY
          ).toFixed(0)} 283`;
          document
               .getElementById("base-timer-path-remaining")
               .setAttribute("stroke-dasharray", circleDasharray);
     }
}
