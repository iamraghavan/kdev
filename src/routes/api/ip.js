// src/routes/api/ip.js
import axios from 'axios';

export async function get(req, res, next) {
  try {
    const response = await axios.get('https://www.cloudflare.com/cdn-cgi/trace');
    const data = response.data;

    // Extracting the IP address and ISP provider from the Cloudflare response
    const ipMatches = data.match(/ip=(.*?)$/m);
    
    const ip = ipMatches ? ipMatches[1] : 'Not available';


    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ip }));
  } catch (error) {
    console.error('Error fetching IP address:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
