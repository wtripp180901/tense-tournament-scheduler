function addRow(){

	const table = document.getElementById("participants");
	var row = table.insertRow();
	var cells = [row.insertCell(),row.insertCell()];

	for(i = 0;i < cells.length;i++){
		cells[i].innerHTML = "<input class=\"participantName\"></input>"
	}
}

function nextPage(){
	let inputFields = document.getElementsByClassName("participantName");
	let names = []
	for(i = 0;i < inputFields.length;i++){
		names.push(inputFields[i].value)
	}
	var params = new URLSearchParams();
	params.append("names",JSON.stringify(names))
	window.location = "tournament.html?"+params.toString();
}
