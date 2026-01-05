const axios = require("axios");

const URL = "http://localhost:4002/api/reservations/book";

const payload = {
  tableId: "695813ab8aae549670b9da47", // same table
  date: "2026-02-02",
timeSlot: "22:00-23:00",
};

const TOTAL_REQUESTS = 80;

const requests = [];

for (let i = 0; i < TOTAL_REQUESTS; i++) {
  requests.push(
    axios.post(URL, payload, {
      headers: {
        "x-user-id": `user${i}`,
        "x-user-role": "USER",
      },
      validateStatus: () => true, // IMPORTANT: don't throw on 4xx
    })
  );
}

Promise.all(requests).then((responses) => {
  let success = 0;
  let failed = 0;

  responses.forEach((res) => {
    if (res.status === 201) success++;
    else failed++;
  });

  console.log("==== STRESS TEST RESULT ====");
  console.log("SUCCESS:", success);
  console.log("FAILED:", failed);

  process.exit(0);
});
