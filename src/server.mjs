import polka from 'polka';
import { json } from 'body-parser';
import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = polka()
  .use(
    json(),
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  );

// Define a route for the API proxy
app.get('/api/fetchAddressData/:pincode', async (req, res) => {
  const { pincode } = req.params;
  const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(PORT, (err) => {
  if (err) console.log('error', err);
});
