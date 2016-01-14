import autobind from 'autobind-decorator';
import { EventEmitter } from 'events';
import helmet from 'koa-helmet';
import Koa from 'koa';
import path from 'path';
import Router from 'koa-router';
import send from 'koa-send';
import { Server as WebSocketServer } from 'ws';

/**
 * The internal web server that serves up API and WebSocket requests.
 */
export default class WebServer extends EventEmitter {
	/**
	 * The root koa router.
	 * @type {Router}
	 */
	router = new Router;

	/**
	 * The koa app instance.
	 * @type {Koa}
	 */
	app = new Koa;

	/**
	 * The WebSocket server instance.
	 * @type {WebSocketServer}
	 */
	websocketServer = null;

	/**
	 * The HTTP server instance.
	 * @type {http.Server}
	 */
	httpServer = null;

	/**
	 * Map of active connections. Used when stopping the web server to drop
	 * active connections.
	 * @type {Object}
	 */
	connections = {};

	/**
	 * Initializes the web server.
	 *
	 * @param {Object} [opts]
	 * @param {String} [opts.hostname=127.0.0.1]
	 * @param {Number} [opts.port=1732]
	 */
	constructor(opts = {}) {
		super();

		this.hostname = opts.hostname || '127.0.0.1';
		this.port     = opts.port || 1732;

		// init the Koa app with helmet and a simple request logger
		this.app
			.use(helmet())
			.use((ctx, next) => {
				const start = new Date;
				return next().then(() => {
					appcd.logger.info('%s %s %s %s',
						ctx.method,
						ctx.url,
						appcd.logger.colors[ctx.status < 400 ? 'green' : ctx.status < 500 ? 'yellow' : 'red'](ctx.status),
						appcd.logger.colors.cyan((new Date - start) + 'ms')
					);
				});
			});
	}

	/**
	 * Adds a middleware function to the web server.
	 *
	 * @param {Function} middleware
	 * @returns {WebServer}
	 * @access public
	 */
	use(middleware) {
		this.app.use(middleware);
		return this;
	}

	/**
	 * Finishes wiring up the web server routes and starts the web server and
	 * websocket server.
	 *
	 * @returns {Promise}
	 * @access public
	 */
	@autobind
	listen() {
		return Promise.resolve()
			// make sure that if there is a previous websocket server, it's shutdown to free up the port
			.then(this.close)
			.then(() => {
				return new Promise((resolve, reject) => {
					const route = this.router.routes();
					this.app.use(route);

					// static file serving middleware
					this.app.use(async (ctx) => {
						await send(ctx, ctx.path, { root: path.resolve(__dirname, '..', 'public') });
					});

					this.httpServer = this.app.listen(this.port, this.hostname, () => {
						appcd.logger.info('Server listening on port ' + appcd.logger.colors.cyan(this.port));
						resolve();
					});

					this.httpServer.on('connection', conn => {
						const key = conn.remoteAddress + ':' + conn.remotePort;
						this.connections[key] = conn;
						conn.on('close', () => {
							delete this.connections[key];
						});
					});

					// create the websocket server and start listening
					this.websocketServer = new WebSocketServer({
						server: this.httpServer
					});

					this.websocketServer.on('connection', conn => {
						this.emit('websocket', conn);
					});
				});
			});
	}

	/**
	 * Closes the web server and websocket server. After 30 seconds, all
	 * connections are terminated.
	 *
	 * @returns {Promise}
	 * @access public
	 */
	@autobind
	close() {
		return Promise.resolve()
			.then(() => {
				if (this.websocketServer) {
					return new Promise((resolve, reject) => {
						// close the websocket server
						this.websocketServer.close(() => {
							this.websocketServer = null;
							resolve();
						});
					});
				}
			})
			.then(() => {
				if (this.httpServer) {
					return new Promise((resolve, reject) => {
						// close the http server
						this.httpServer.close(() => {
							this.httpServer = null;
							resolve();
						});

						// manually kill any open connections
						Object.keys(this.connections).forEach(key => {
							this.connections[key].destroy();
						});
					});
				}
			});
	}
}
