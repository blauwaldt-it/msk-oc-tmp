// Set FSM variable

export class fsmSend {

	constructor () {
		this.indexPath = this.getQueryVariable('indexPath');
		this.userDefIdPath = this.getQueryVariable('userDefIdPath');

		// Trace Counter
		this.traceCount = 0;
	}

	setFSMVariable ( variableName, newValue ) {

		if ( process.env.NODE_ENV !== 'production' ) {
			console.log( `Set FSM variable: ${variableName} to value >${newValue}< (${typeof newValue})` );
		}

		this.postMessageWithPathsAndTraceCount({
			setVariable: {
				variableName,
				newValue,
			},
		})
	}

	// Send a trace message
	postLogEvent ( traceMessage ) {
		this.postMessageWithPathsAndTraceCount({
			traceMessage,
		})

	}

	triggerEvent ( event ) {

		if ( process.env.NODE_ENV !== 'production' ) {
			console.log( `Trigger event: ${event}` );
		}

		this.postMessageWithPathsAndTraceCount({
			microfinEvent: event,
		})
	}

	postMessageWithPathsAndTraceCount( payload ) {

		try
		{
			payload.indexPath = this.indexPath;
			payload.userDefIdPath = this.userDefIdPath;
			payload.traceCount = this.traceCount++;

			window.parent.postMessage( JSON.stringify( payload ), '*' );

		} catch (e) {
			console.error(e);
		}

	}

	// Helper
	getQueryVariable (variable) {
		const parsedUrl = new URL( window.location.href );
		return parsedUrl.searchParams.get(variable);
	}

	startListeningToVariableDeclarationRequests (declareVariableCallback) {

		// listener for providing initial variable data signal.
		window.addEventListener(
			"message",
			(event) => {

				try {
					const { callId } = JSON.parse(event.data);
					if ( callId !== undefined && callId.includes("importVariables") ) {
						const variables = declareVariableCallback();
						const pass_data = {
							initialVariables: variables,
							callId
						}

						window.parent.postMessage( JSON.stringify( pass_data ), '*' );
					}
				} catch (error) {
					if ( process.env.NODE_ENV !== 'production' ) {
						console.log("error on external listener - ", error);
					}
				}
			},
			false );
	 }

}
