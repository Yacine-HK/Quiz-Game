// Declare variables
let all = document.querySelector(".quiz_app")
let qCount = document.querySelector(".question_count span")
let bullets = document.querySelector(".bullets .spans")
let qArea = document.querySelector(".question_area")
let answerArea = document.querySelector(".answers_area")
let timer = document.querySelector(".count_down")
let submitBtn = document.querySelector(".submit_button")
let categoryBtn = document.querySelector(".category")


// Set option
let current = 0;
let rAnswersCounter = 0;
let timerInterval;
let duration = 200;
let choosenAnswer;
let category

// Ajax Request
function getQuestions() {
     // Select the category button
     categoryBtn.addEventListener("click", e => {
          // Target button category 
          category = e.target.dataset.category;

          let myRequest = new XMLHttpRequest
          myRequest.onreadystatechange = function () {

               if (this.readyState === 4 && this.status === 200) {

                    let qObject = JSON.parse(this.responseText);
                    // console.log(qObject[0].answers)

                    // creat bullet + questions count function
                    let qCount = qObject.length;
                    creatBullets(qCount)

                    // creat question data
                    questionData(qObject[current], qCount);

                    // Shuffle function
                    let ansKeys = Object.keys(qObject[current].answers)
                    // Array to get just keys
                    let order = [...Array(ansKeys.length).keys()]

                    // The Shuffle function
                    // Make array from the all answers
                    let answersBlock = Array.from(answerArea.children);
                    // run shuffle function
                    shuffle(order)
                    console.log(order)
                    // loop into the answers and make the ordre randomly
                    answersBlock.forEach((block, index) => {
                         block.style.order = order[index];
                    })

                    // Count down function
                    contDown(duration, qCount);
                    // Submit button
                    submitBtn.onclick = () => {
                         // declare the right answer
                         let rAnswer = qObject[current].right_answer

                         // increse counter by 1
                         current++;

                         // check the right answer function
                         checkAnswer(rAnswer, qCount)

                         clearInterval(timerInterval)
                         contDown(duration, qCount);

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
                    }



               }
          }

          myRequest.open("GET", category, true);
          myRequest.send();
     }
     )
}
getQuestions()


// create question data
function questionData(obj, count) {
     if (current < count) {
          // Create question title
          qArea.innerHTML += `<h2>${obj.question}</h2>`

          // create answers
          for (let i = 1; i < 5; i++) {
               answerArea.innerHTML += `<div class="answer">
      <input type="radio" id="ans_${i}" name="answers" data-answer = ${obj.answers[`answer_${i}`]}>
      <label for="ans_${i}">${obj.answers[`answer_${i}`]}</label> </div>`
          }

     }
}

// Check Answer function
function checkAnswer(right, count) {
     if (current < count) {
          // Get all the answer
          let allAnswers = document.getElementsByName("answers")
          // declare the choosen answer

          // Loop into the all answer + get the choosen one
          for (i = 0; i < allAnswers.length; i++) {
               if (allAnswers[i].checked) {
                    // the choosen answer
                    choosenAnswer = allAnswers[i].dataset.answer
               }
          }
          if (choosenAnswer === right) {
               rAnswersCounter++;
          }
     }
}



// creat bullets function
function creatBullets(num) {
     // Number of all questions in the object
     qCount.innerHTML = num;

     // creat bullets
     for (let i = 0; i < num; i++) {
          // Add class "on" in the first span 
          if (i === 0) {
               bullets.innerHTML = `<span class="on"></span>`;
          }
          if (i === 3) break;
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



// Count down timer
function contDown(duration, count) {
     if (current < count) {
          timerInterval = setInterval(() => {
               timer.innerHTML = `${duration}`
               if (--duration < 0) {
                    clearInterval(timerInterval)
                    submitBtn.click();
               }
          }, 1000)
     }
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
     console.log(array)
     return array;
}













var animals = {
     'cat': 'meow',
     'dog': 'woof',
     'cow': 'moo',
     'sheep': 'baaah',
     'bird': 'tweet'
};

// Random Key

// Random Value
console.log(animals[Object.keys(animals)[Math.floor(Math.random() * Object.keys(animals).length)]]);




// let randomProperty = function (obj) {
//      let keys = Object.keys(obj);
//      console.log(obj[keys[keys.length * Math.random() << 0]]);
// };

// randomProperty(obj)
// let test = Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];