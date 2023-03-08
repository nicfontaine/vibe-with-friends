import copyToClipboard from "./copy-to-clipboard";

const urlShare = async function (url: string): Promise<string> {
	if (navigator.share) {
		await navigator.share({
			title: process.env.NEXT_PUBLIC_APP_NAME,
			text: "Use this custom link",
			url: url,
		});
		return "";
	} else {
		copyToClipboard(url);
		return "Share URL copied to clipboard";
	}
};

export default urlShare;