const express = require('express');
const app = express();
const records = require('./records')

app.use (express.json()); 

app.get('/greetings', (req, res)=> {
    res.json({greeting: "hellow world"})
});

app.get('/quotes', async (req, res) => {
  try {
    const quotes = await records.getQuotes();
    res.json(quotes);
  }catch(err){
    res.json({message:err.messsage})
  }
});

app.get('/quotes/:id', async (req, res)=> {
    try {
        const quote = await records.getQuote(req.params.id);
        if(quote) {
            res.json(quote)
            
        }else {
            res.status(404).json({message: "This doesn't exist"})
        }
        res.json(quote);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

app.post('/quotes', (req, res) => {
    try {
       if(req.body.author && req.body.quote){
        const quote = records.createQuote ({
            quote: req.body,
            author: req.body.author
        });
        res.status(201).json(quote)
       } else{
        res.status.json({messgae:"Quote and author required."})
       }
      
    }catch(err){
        res.status(500).json({message: err.message});
    }
    
});

app.put('/quotes/:id', async (req, res) => {
    try{
      const quote = await records.getQuote(req.params.id);
      if (quote){
        quote.quote = req.body.quote;
        quote.author = req.body.author;

       await records.updateQuote(quote);
       res.status(204).end();
      } else {
        res.status(404).json({message: 'Not found'})
      }
    }catch(err){
        res.status(500).json({message: "There was an unexpected error"})
    }
});

app.delete("/quotes/:id", async (req, res) => {
  try{
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);
   res.status(204).end();
  }catch(err){
      res.status(500).json({message: "There was an unexpected error"})
  }
});

app.use( (err, req, res, next) => {
    
})


app.listen(3000, () => console.log('Quote API listening on port 3000!'));

//annon
