let quizData = [];
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = []; // List to store incorrectly answered questions

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

// Shuffle function to randomize questions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to build the quiz UI
function buildQuiz() {
    const output = [];

    const currentQuiz = quizData[currentQuestion];
    const answers = [];

    for (let i = 0; i < currentQuiz.answers.length; i++) {
        answers.push(
            `<label>
                <input type="radio" name="question" value="${i}">
                ${currentQuiz.answers[i]}
            </label>`
        );
    }

    output.push(
        `<div class="question"><strong>${currentQuiz.question}</strong></div>
        <div class="answers">${answers.join('')}</div>`
    );

    quizContainer.innerHTML = output.join('');
    submitButton.disabled = false; // Re-enable the submit button for the next question
}

// Function to show results and handle incorrect answers
function showResults() {
    const answerContainer = quizContainer.querySelector('.answers');
    const selector = `input[name=question]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    const correctAnswerIndex = quizData[currentQuestion].correct;

    submitButton.disabled = true; // Disable the submit button to prevent multiple clicks

    if (parseInt(userAnswer) === correctAnswerIndex) {
        score++;
        answerContainer.children[userAnswer].style.color = 'green'; // Highlight correct answer
    } else {
        answerContainer.children[userAnswer].style.color = 'red'; // Highlight wrong answer
        answerContainer.children[correctAnswerIndex].style.color = 'green'; // Highlight correct answer

        // Save the incorrect answer
        incorrectAnswers.push({
            question: quizData[currentQuestion].question,
            userAnswer: quizData[currentQuestion].answers[userAnswer],
            correctAnswer: quizData[currentQuestion].answers[correctAnswerIndex]
        });

        // Debug: Log the incorrect answer saved
        console.log("Incorrect answer saved:", incorrectAnswers[incorrectAnswers.length - 1]);
    }

    // Automatically move to the next question after 5 seconds
    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < quizData.length) {
            buildQuiz();
        } else {
            quizContainer.innerHTML = '';  // Clear quiz
            resultsContainer.innerHTML = `You scored ${score} out of ${quizData.length}`;

            // Show incorrect answers if any
            if (incorrectAnswers.length > 0) {
                let incorrectResults = '<h3>Questions you answered incorrectly:</h3><ul>';
                incorrectAnswers.forEach(item => {
                    incorrectResults += `<li><strong>Question:</strong> ${item.question}<br>
                                         <strong>Your answer:</strong> ${item.userAnswer}<br>
                                         <strong>Correct answer:</strong> ${item.correctAnswer}</li>`;
                });
                incorrectResults += '</ul>';
                resultsContainer.innerHTML += incorrectResults;
            }

            submitButton.style.display = 'none'; // Hide the 'Submit' button after the quiz is completed
        }
    }, 5000); // 5000 milliseconds = 5 seconds
}

// Event listener to start the quiz after the JSON is loaded
submitButton.addEventListener('click', showResults);

// Load quiz data from JSON and shuffle the questions
fetch('quiz_data.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        shuffle(quizData); // Randomize the questions
        buildQuiz();  // Start the quiz after data is loaded
    });
