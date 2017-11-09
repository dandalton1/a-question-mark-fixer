function fix() {
	var text = document.getElementById("text").value;
	text = text.replace(/\uFE0F/g, "");
	document.getElementById("text").value = text;
}
