const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _, next) => {
  req.user = {
    _id: '62874a29df97437e37a6d1ab',
  };

  next();
});

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use('*', (_, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
