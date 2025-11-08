import http from "k6/http";
import { sleep } from "k6";
export const options = {
  vus: 1000,
  duration: "30s",
};

export default function () {
  let params = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGQ1M2QzOWQ2NmM4YjIyMGI0ODFhMSIsImlhdCI6MTc2MTQ3NDYwNywiZXhwIjoxNzYxNDgxODA3fQ._z-Tm-hGnRWCt9rw9skaipNR16YEis0cVHHtbpDxKO0`,
      'x-account-type': "personal",
      'x-account-id': ''
    },
  };
  http.get("http://localhost:3001/api/survey/get", params);
  sleep(1);
}
