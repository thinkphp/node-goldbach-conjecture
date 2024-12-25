const http = require('http');
const fs = require('fs');
const path = require('path');

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

// Create the server
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve the index.html file
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.method === 'POST' && req.url === '/api/goldbach') {
    // Handle the Goldbach pairs API
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { number } = JSON.parse(body);
        const num = parseInt(number, 10);

        if (isNaN(num) || num < 4 || num % 2 !== 0) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid input: Enter an even number greater than 2.');
          return;
        }

        const pairs = computeGoldbachPairs(num);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(pairs));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
  } else {
    // Handle 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
