const express = require("express");
const app = express();
const records = require("./records");

app.use(express.json());

app.get("/greetings", (req, res) => {
  res.json({ greeting: "hello world" });
});
// get all quotes
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await records.getQuotes();
    res.json(quotes);
  } catch (err) {
    res.json({ message: err.messsage });
  }
});
//get a specific quote
app.get("/quotes/:id", async (req, res) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: "This doesn't exist" });
    }
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//create a quote
app.post("/quotes", (req, res) => {
  try {
    //if the request contains the correct properties, quote and author, take them and create a new quote w unique id
    if (req.body.author && req.body.quote) {
      const quote = records.createQuote({
       //because it was req.body without quote, it was taking the request body and adding the author and quote again because it was taking in the request body which had the auth/quote so it did it twice 
        quote: req.body.quote,
        author: req.body.author,
      });
      res.status(201).json(quote);
    } else {
      res.status.json({ messgae: "Quote and author required." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// fetch and update a specific quote
app.put("/quotes/:id", async (req, res) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;

      await records.updateQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "There was an unexpected error" });
  }
});
// fetch & delete a specific quote
app.delete("/quotes/:id", async (req, res) => {
  try {
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "There was an unexpected error" });
  }
});
//  error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, () => console.log("Quote API listening on port 3000!"));

//annon
