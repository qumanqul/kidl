import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

app.get("/", (request, response) => {
  return response
    .status(201)
    .send({ msg: "It's an app Kidl, where u can buy some items" });
});
