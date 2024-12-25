const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Helper function to determine if a number is prime
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Function to compute Goldbach pairs
function computeGoldbachPairs(number) {
  const pairs = [];
  for (let i = 2; i <= number / 2; i++) {
    if (isPrime(i) && isPrime(number - i)) {
      pairs.push([i, number - i]);
    }
  }
  return pairs;
}

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API route to process Goldbach conjecture
app.post('/api/goldbach', (req, res) => {
  const { number } = req.body;
  const num = parseInt(number, 10);

  if (isNaN(num) || num < 4 || num % 2 !== 0) {
    return res.status(400).send('Invalid input: Enter an even number greater than 2.');
  }

  const pairs = computeGoldbachPairs(num);
  res.json(pairs);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
