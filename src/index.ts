import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('WORKING ✅');
});

app.listen(port, () => {
  console.log(`Minimal server listening on port ${port}`);
  console.log('Isolation test: Server is running.');
});
