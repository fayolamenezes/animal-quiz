# Animal Quiz App

Animal Quiz is an interactive, responsive web application that tests your knowledge of the animal kingdom. Built using HTML, CSS, and JavaScript, this app dynamically fetches trivia questions from the Open Trivia Database API to deliver a fun and educational quiz experience.

## Features

- Three difficulty levels: Easy, Medium, and Hard
- 10 randomized multiple-choice animal trivia questions per session
- 15-second countdown timer for each question
- Real-time feedback for correct and incorrect answers
- Local leaderboard stored in the user's browser
- Fully responsive design for mobile, tablet, and desktop

## Technologies Used

- HTML5
- CSS3 (with media queries for responsive design)
- JavaScript (ES6+)
- Open Trivia Database API

## How It Works

1. Users begin by selecting a difficulty level.
2. The app fetches 10 trivia questions related to animals.
3. Each question has four answer options and a 15-second timer.
4. Immediate visual feedback is given after each answer.
5. At the end of the quiz, users can enter their name and save their score to a local leaderboard.
6. The leaderboard is shown on the home screen, separated by difficulty level.

## Local Storage Notice

This project uses the browser's `localStorage` to save scores. Each user sees only their own scores, which are stored locally in their browser and are not shared across devices or users.

## Deployment


## Credits

- Trivia questions provided by [Open Trivia Database](https://opentdb.com/)

## License

This project is open source and available under the [MIT License](LICENSE).
