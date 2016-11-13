import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import schema from './graphql/schema';
import { getTokenFromRequest } from './api/auth/utils';
import config from './config';

const PORT = process.env.PORT || config.server.port;
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.database.host}:${config.database.port}/${config.database.name}`);
const db = mongoose.connection;
/* eslint-disable no-console */
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('We are connected!'));
/* eslint-disable no-console */

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/graphql', bodyParser.json(), graphqlExpress(request => ({
  schema,
  context: { token: getTokenFromRequest(request) }
})));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

/* eslint-disable consistent-return, no-console */
const server = app.listen(PORT, (err) => {
  if (err) { return err; }
  console.log(`Now browse to http://localhost:${PORT}/graphiql`);
});
/* eslint-disable consistent-return, no-console */

export default server;
