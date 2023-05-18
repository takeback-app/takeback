import axios from "axios";
import dotenv from "dotenv";

function schedule() {
  dotenv.config();

  axios
    .get(`${process.env.API_URL}/scheduled/run-checks`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

schedule();
