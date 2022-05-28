const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');  //???

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

//app.use(cookieParser());  //???

// достаём токен
// app.get('/posts', (req, _) => {
//   console.log(req.cookies.jwt);
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, _, next) => {
//   req.user = {
//     _id: '6290d8de5e26299ee98e0cf2',
//   };

//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (_, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
