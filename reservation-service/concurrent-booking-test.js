const axios = require("axios");

const URL = "http://localhost:4002/api/reservations/book";

const payload = {
  tableId: "695813ab8aae549670b9da47", // YOUR tableId
  date: "2026-01-05",
  timeSlot: "18:00-20:00",
};

const requestA = axios.post(URL, payload, {
  headers: {
    "x-user-id": "userA",
    "x-user-role": "USER",
  },
});

const requestB = axios.post(URL, payload, {
  headers: {
    "x-user-id": "userB",
    "x-user-role": "USER",
  },
});

Promise.allSettled([requestA, requestB]).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(
        `Request ${index + 1} SUCCESS:`,
        result.value.status
      );
    } else {
      console.log(
        `Request ${index + 1} FAILED:`,
        result.reason.response.status
      );
    }
  });

  process.exit(0);
});
