const request = require("request");
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callBack) {
  // use request to fetch IP address from JSON API
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    //error can be set if invalid domain, user is offline, etc.
    if (error) {
      callBack(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callBack(Error(msg), null);
      return;
    }
    callBack(null, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = function (ip, callBack) {
  // use request to fetch IP address from JSON API
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    //error can be set if invalid domain, user is offline, etc.
    const latitude = JSON.parse(body).data.latitude;
    const longitude = JSON.parse(body).data.longitude;
    callBack(null, { latitude: latitude, longitude: longitude });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
};
