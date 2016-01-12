import Dispatcher from './dispatcher';
import fs from 'fs';
import path from 'path';
import resolvePath from 'resolve-path';
import Router from 'koa-router';
import Service from './service';

/**
 * Wraps a plugin lifecycle.
 */
export default class Plugin {
	dispatcher = new Dispatcher;

	router = new Router;

	constructor({ name, path, cls, pkgJson }) {
		this.name = name;
		this.path = path;
		this.pkgJson = typeof pkgJson === 'object' && pkgJson !== null ? pkgJson : {};

		this.service = new cls({
			logger: console.new(name),
			router: this.router,
			dispatcher: this.dispatcher
		});

		console.info('Loaded plugin ' + name + (pkgJson.version ? ' v' + pkgJson.version : '') + ' (' + path + ')');
	}

	/**
	 * Calls the service's init function.
	 *
	 * @access public
	 */
	async init() {
		if (typeof this.service.init === 'function') {
			await this.service.init();
		}
	}

	/**
	 * Calls the service's shutdown function.
	 *
	 * @access public
	 */
	async shutdown() {
		if (typeof this.service.shutdown === 'function') {
			await this.service.shutdown();
		}
	}

	/**
	 * Loads all plugins in the specified directory.
	 *
	 * @param {String} pluginDir
	 * @access public
	 */
	static load(pluginDir) {
		const pkgJsonFile = path.join(pluginDir, 'package.json');
		let pkgJson = {};
		if (fs.existsSync(pkgJsonFile)) {
			pkgJson = JSON.parse(fs.readFileSync(pkgJsonFile));
		}

		const main = pkgJson && pkgJson.main || 'index.js';

		let file = main;
		if (!/\.js$/.test(file)) {
			file += '.js';
		}
		file = resolvePath(pluginDir, file);
		if (!fs.existsSync(file)) {
			throw new Error(`Unable to find main file: ${main}`);
		}

		const name = pkgJson.name || name;
		const module = require(file);
		const obj = module && module.__esModule ? module : { default: module };
		const cls = module.default;

		if (!cls || typeof cls !== 'function' || !(cls.prototype instanceof Service)) {
			throw new Error(`Plugin does not export a service`);
		}

		return new Plugin({
			name,
			path: pluginDir,
			cls,
			pkgJson
		});
	}
}