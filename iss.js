const request = require("request");

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
    if (error) {
      callBack(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching data. Response: ${body}`;
      callBack(Error(msg), null);
      return;
    }
    // const latitude = JSON.parse(body).data.latitude;
    // const longitude = JSON.parse(body).data.longitude;
    const { latitude, longitude } = JSON.parse(body).data;
    callBack(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function (coords, callBack) {
  request(
    `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) {
        callBack(error, null);
      }
      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching data. Response: ${body}`;
        callBack(Error(msg), null);
        return;
      }
      const flyOverTimes = JSON.parse(body).response;
      callBack(null, flyOverTimes);
    }
  );
};
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function (callBack) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callBack(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callBack(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callBack(error, null);
        }

        callBack(null, nextPasses);
      });
    });
  });
};

module.exports = {
  // fetchMyIP,
  // fetchCoordsByIP,
  // fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
