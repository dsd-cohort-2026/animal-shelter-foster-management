const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Middleware 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api', require('./routes/index'));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

