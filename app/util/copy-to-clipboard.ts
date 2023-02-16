const copyToClipboard = function (textToCopy: string) {
	if (navigator.clipboard && window.isSecureContext) {
		return navigator.clipboard.writeText(textToCopy);
	} else {
		const textArea = document.createElement("textarea");
		textArea.value = textToCopy;
		textArea.style.position = "fixed";
		textArea.style.left = "-999999px";
		textArea.style.top = "-999999px";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		return new Promise<void>((resolve, reject) => {
			document.execCommand("copy") ? resolve() : reject();
			textArea.remove();
		});
	}
};

export default copyToClipboard;
