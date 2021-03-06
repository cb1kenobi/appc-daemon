> [Home](README.md) ➤ Getting Started

# Getting Started

## Installation

There are two ways to get the Appc Daemon: npm and the Axway CLI.

### Install from npm

To install the Appc Daemon using npm, run the following from the terminal:

	npm i -g appcd

Some Linux and macOS systems require elevated filesystem access to install the Axway CLI in the
global location and require npm to be run as sudo:

	sudo npm i -g appcd

### Install from Axway CLI

To install the Appc Daemon using the Axway CLI, run the following from the terminal:

	axway pm i appcd

## Installing Default Plugins

The Appc Daemon does not come bundled with any plugins. Plugins are installed using the Appc Daemon
plugin manager.

There is a curated list of "default" plugins which the plugin manager will download and install by
running:

	appcd pm install default

This will install the latest major versions of the following plugins:

| Package                   |            |           |
| ------------------------- | ---------- | --------- |
| @appcd/plugin-amplify     | [docs][11] | [npm][12] |
| @appcd/plugin-android     | [docs][21] | [npm][22] |
| @appcd/plugin-ios         | [docs][31] | [npm][32] |
| @appcd/plugin-jdk         | [docs][41] | [npm][42] |
| @appcd/plugin-system-info | [docs][51] | [npm][52] |
| @appcd/plugin-titanium    | [docs][61] | [npm][62] |
| @appcd/plugin-windows     | [docs][71] | [npm][72] |

[11]: https://github.com/appcelerator/appcd-plugin-amplify#readme
[12]: https://npmjs.org/packages/@appcd/plugin-amplify

[21]: https://github.com/appcelerator/appcd-plugin-android#readme
[22]: https://npmjs.org/packages/@appcd/plugin-android

[31]: https://github.com/appcelerator/appcd-plugin-ios#readme
[32]: https://npmjs.org/packages/@appcd/plugin-ios

[41]: https://github.com/appcelerator/appcd-plugin-jdk#readme
[42]: https://npmjs.org/packages/@appcd/plugin-jdk

[51]: https://github.com/appcelerator/appcd-plugin-system-info#readme
[52]: https://npmjs.org/packages/@appcd/plugin-system-info

[61]: https://github.com/appcelerator/appcd-plugin-titanium#readme
[62]: https://npmjs.org/packages/@appcd/plugin-titanium

[71]: https://github.com/appcelerator/appcd-plugin-windows#readme
[72]: https://npmjs.org/packages/@appcd/plugin-windows

## Quick Start

Start the server:

	appcd start

Start the server in debug mode:

	appcd start --debug

Stop the server:

	appcd stop

Query the status of the server:

	appcd status

View server log output:

	appcd logcat

Invoke a service:

	appcd exec /appcd/status

List installed plugins:

	appcd pm ls

## Getting Help

The Appc Daemon CLI has built-in help that can be accessed by passing `--help` into any command or by running:

	appcd --help

## Proxy Server Configuration

If you are behind a network proxy server, then you may need to set the proxy server URL by running
the following command and replacing the username, password, proxy server URL, and port number.

	appcd config set network.proxy http://<username>:<password>@<proxy-server-url>:<port>

If your proxy server uses a self-signed TLS/SSL certificate, then you will need to disable
certificate validation:

	appcd config set network.strictSSL false

> :warning: Currently, the HTTPS proxy servers with self-signed certificates are not supported by
> the Appc Daemon plugin manager (`appcd pm`). You must use a non-HTTPS proxy server, an HTTPS
