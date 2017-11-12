document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("resultss").innerHTML = localStorage.getItem("validationResults");
	var classname = document.getElementsByClassName("checkMessage"); 
	for(var classIndex = 0; classIndex < classname.length; classIndex++) {
		classname[classIndex].onclick = function() {
			this.parentElement.classList.toggle("checked");
		}
	}	
});