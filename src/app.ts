import express, {Application} from 'express';
import bodyParser from 'body-parser';
import {sequelize} from './models';
import {router} from './routes'

const app: Application = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use(router)

module.exports = app;
