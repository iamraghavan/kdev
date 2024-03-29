import polka from 'polka';
import { json } from 'body-parser'; // Import 'json' from 'body-parser'
import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server'; // Use '* as sapper'

import cors from 'cors';
import bodyParser from 'body-parser';
import { post } from './routes/sendMail';


const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = polka()
  .use(
    json(), // Use 'json' middleware for parsing JSON
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  );


  app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Route for handling the sendMail endpoint
app.post('/sendMail', post);



app.listen(PORT, (err) => {
  if (err) console.log('error', err);
});


