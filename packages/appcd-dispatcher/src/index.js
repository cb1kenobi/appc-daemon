if (!Error.prepareStackTrace) {
	require('source-map-support/register');
}

import Dispatcher from './dispatcher';
import ServiceDispatcher from './service-dispatcher';

export default Dispatcher;
export {
	Dispatcher,
	ServiceDispatcher,
};
