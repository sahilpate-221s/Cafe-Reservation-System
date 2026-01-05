const log = (msg) => {
  console.log(`[RESERVATION-SERVICE] ${msg}`);
};

const error = (msg, err) => {
  console.error(`[RESERVATION-SERVICE] ${msg}`, err || "");
};

module.exports = { log, error };
