// Authority node http serer package.
import http from 'http';

// Authority node path package.
import path from 'path';

// Expressive middleware for node.js using ES2017 async functions.
import Koa from 'koa';

// a body parser for koa.
import bodyParser from 'koa-bodyparser';

// A Koa view engine which renders React components on server.
import react from 'koa-react-view';

// Development style logger middleware for koa.
import logger from 'koa-logger';

// Compress middleware for koa.
import compress from 'koa-compress';

// koa session store with memory, redis or others.
import session from 'koa-generic-session';

// koa session with redis.
import redisStore from 'koa-redis';

// compact zlib, deflate, inflate, zip library in JavaScript
import zlib from 'zlib';

// All custome routes.
import routers from './routers';

import config from './config';

const app = new Koa();

react(app, {
  views: path.join(__dirname, 'views'),
});

app.use(logger());
app.use(bodyParser());

//app.use(session({
  //store: redisStore({
    //// Options specified here
  //}),
//}));

app.use(compress({
  threshold: 2048,
  flush: zlib.Z_SYNC_FLUSH,
}));

app.use(routers.routes());

http.createServer(app.callback()).listen(config.port);
