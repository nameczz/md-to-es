const generateEsDataset = require("./batchUpdateElastic");
const axios = require("axios");

const BASE_URL = "https://alxew6na75.execute-api.us-west-2.amazonaws.com/test";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // headers: { Authorization: `Bearer ${res.data.jwt}` },
});

const run = async () => {
  console.time("update");
  const dataset = [];
  await generateEsDataset(dataset, "master/v2.0.0");
  const res = await axiosInstance.post("bulk", {
    data: dataset,
  });
  console.log(dataset.length);
  console.timeEnd("update");
};

run();
