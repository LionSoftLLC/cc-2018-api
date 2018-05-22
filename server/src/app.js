//Dependencies
import express from 'express';
import Logger from 'winston';

//Local Dependencies
import Routing from './Routing';

//Instantiated
const DEFAULT_PORT = 3000;

const App = class App {
	constructor() {
		this._app = express();
	}

	////////////////////
	// PUBLIC METHODS //
	////////////////////

	start() {
		// preserve context
		const _this = this;
		
		_this._configureRoutes();
		_this._startListener();
	}

	////////////////////
	// UTILITY METHODS//
	////////////////////

	_configureRoutes() {
		// preserve context
		const _this = this;
		
		_this._app.use(`/static`, express.static(`${process.env.PROJECT_ROOT}/server/static`));
		_this._app.use(`/api`, Routing);
	}

	_startListener() {
		// preserve context
		const _this = this;
		
		const port = process.env.HOST_PORT || DEFAULT_PORT;

		_this._app.listen(port, (err) => {
			if (err) {
				Logger.warn(`Encountered an error starting the API server:`);
				Logger.error(err);
			} else {
				Logger.info(`API server started on port ${port}`);
			}
		});
	}
};

export { App };
export default App;


