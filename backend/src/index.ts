
import express from 'express';
import cors from 'cors';
import { propertiesRouter, hostsRouter, guestsRouter, reviewsRouter } from './api';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/properties', propertiesRouter);
app.use('/api/hosts', hostsRouter);
app.use('/api/guests', guestsRouter);
app.use('/api/reviews', reviewsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
