const log = (message) => {
  console.log(`[AUTH-SERVICE] ${message}`);
};

const error = (message, err) => {
  console.error(`[AUTH-SERVICE] ${message}`, err || "");
};

module.exports = { log, error };
