function validatePage(domContent) {
	var domStructure = "<!DOCTYPE html>" + domContent;
	var validateURL = "https://validator.w3.org/nu/?out=json";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState === 4) {
	    	if (this.status === 200) {
		    	document.getElementById("validationResult").classList.remove("loader");
		    	document.getElementById("loaderDesc").classList.add("displayNone");
		    	document.getElementById("openNewTab").classList.remove("displayNone");
		    	var responseObj = JSON.parse(this.response);
		    	var responseArray = responseObj.messages;
		    	var i,errorCount = 0, warningCount = 0, totalCount = 0, errorMessageDesc = "<h3 class='errorHeading'>Errors:</h3>", warningMessageDesc = "<h3 class='warningHeading'>Warnings:</h3>", infoMessageDesc = "";
		    	for(i = 0; i < responseArray.length; i++) {
		    		if(responseArray[i].type === "error") {
		    			errorCount += 1;
		    			totalCount += 1;
		    			errorMessageDesc += "<div class='errorMessage'><input type='checkbox' class='checkMessage'><p><span>" +errorCount+ ". </span><span class='errorHead'>Error: </span><span class='errorDesc'>" + responseArray[i].message + "</span></p><p class='lineDesc'>On line " +responseArray[i].lastLine+ ", column " +responseArray[i].firstColumn+ "</p></div>";
		    			document.getElementById("errors").innerHTML = errorMessageDesc;
		    		} else if(responseArray[i].type === "info" && responseArray[i].subType === "warning") {
		    			warningCount += 1;
		    			totalCount += 1;
		    			warningMessageDesc += "<div class='warningMessage'><input type='checkbox' class='checkMessage'><p><span>" +warningCount+ ". </span><span class='warningHead'>Warning: </span><span class='warningDesc'>" + responseArray[i].message + "</span></p><p class='lineDesc'>On line " +responseArray[i].lastLine+ ", column " +responseArray[i].firstColumn+ "</p></div>";
		    			document.getElementById("warnings").innerHTML = warningMessageDesc;
		    		}
		    	}
		    	if(errorCount === 0 && warningCount === 0) {
		    		document.getElementById("errorCount").innerHTML = "<p class='noErrors'>Document checking completed. No errors or warnings to show.</p>";
		    	} else if(errorCount > 0 || warningCount > 0) {
		    		document.getElementById("errorCount").innerHTML = "<p class='withErrors'>Document checking completed. There are " +errorCount+ " errors and "+warningCount+ " warnings.</p>";
		    	}
		    	//Code for to do list
		    	var classname = document.getElementsByClassName("checkMessage"); 
		    	for(var classIndex = 0; classIndex < classname.length; classIndex++) {
					classname[classIndex].onclick = function() {
						this.parentElement.classList.toggle("checked");
					}
				}
			} else {
				document.getElementById("validationResult").classList.remove("loader");
		    	document.getElementById("loaderDesc").classList.add("displayNone");
		    	document.getElementById("resultsWrapper").innerHTML = this.responseText;
			}
	    }
  	};

  	xhttp.open('POST', validateURL, true);
  	xhttp.setRequestHeader("Content-type", "text/html; charset=UTF-8");
    xhttp.send(domStructure);
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action: "activeTabDOMContent"}, function(response) {
		    validatePage(response.domContent);
		    
		    document.getElementById("openNewTabLink").addEventListener("click", function() {
		    	var validationResultDOM = document.getElementById("resultsWrapper").innerHTML;
		    	localStorage.setItem("validationResults", validationResultDOM);
		    	chrome.tabs.create({'url': chrome.runtime.getURL('validationResults.html')}, function(tab) {
			    	alert("hello");
			    });
		    });
		    
		});
	});
});