var statusDisplay;
var worker;
var searchButton;

window.onload = function() {
	  statusDisplay = document.getElementById("status");
	  searchButton = document.getElementById("searchButton");
};

function doSearch() {
	// Get the two numbers in the text boxes. This is the search range.
	searchButton.disabled = true;
	
	var fromNumber = document.getElementById("from").value;
	var toNumber = document.getElementById("to").value;

	var worker = new Worker("PrimeWorker.js");
	worker.onmessage = receivedWorkderMessage;
	worker.onerror = workerError;

	worker.postMessage({
		from: fromNumber,
		to: toNumber
	});

	statusDisplay.innerHTML = "A web worker is on the job (" + fromNumber + " to " + toNumber + ")...";    

function receivedWorkderMessage(event) {
	var message = event.data;
	if(message.messageType == "PrimeList") {
		var prime = message.data;

		// Take the results, loop over it,
		// and paste it into one long piece of text.
		var primeList = "";
		for (var i=0; i<primes.length; i++) {
			primeList += primes[i];
			if (i != primes.length-1) primeList += ", ";
		}

		// Show the prime number list on the page.
		var primeContainer = document.getElementById("primeContainer");
		primeContainer.innerHTML = primeList;

		if (primeList.length == 0) {
			statusDisplay.innerHTML = "Search didn't find any results.";
		}
		else {
			statusDisplay.innerHTML = "The results are here!";
		}
	} else if(message.messageType == "Progress") {
		statusDisplay.innerHTML = message.data + "% done ...";
	}
}

function workerError(error) {
	statusDisplay.innerHTML = error.message;
}

function cancelSearch() {
	worker.terminate();
	worker = null;
	statusDisplay.innerHTML = "Search cancelled.";
	searchButton.disabled = false;
}

