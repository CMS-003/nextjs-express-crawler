const express = require('express');
const next = require('next');
const parse = require('url').parse;
const bodyParser = require('body-parser')
const router = require('./router');
const response = require('./middleware/response')

const httpServer = (express) => {
  return require('http').createServer(express)
}

class Server {
  constructor(port) {
    this.port = port;
    this.express = express();
    this.next = next({ dev: process.env.NODE_ENV !== 'production' });
  }

  async start() {
    await this.next.prepare()
    // middleware.init()
    // router.init()

    this.initApis();
    this.initCustomPages();
    this.initDefaultPages();

    this.server = httpServer(this.express)
    this.server.listen(this.port, () => {
      console.log(`server launch at: ${this.port} ${process.env.NODE_ENV}`);
    });
  }

  initApis() {
    this.express.use(response);
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use('/api', router);
  }

  initCustomPages() {
    // this.express.get('/test/:special_page', (req, res) => {
    //   return this.next.render(req, res, '/special_page', req.query);
    // });
  }
  initDefaultPages() {
    const handle = this.next.getRequestHandler();
    this.express.use((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })

  }
}

module.exports = Server;