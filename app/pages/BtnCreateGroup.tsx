import { MouseEvent } from 'react';
import copyToClipboard from '../util/copy-to-clipboard';

interface Props {
	setIsOwner: (val: boolean) => void;
	setGroupID: (val: string) => void;
	setUrlMsg: (val: string) => void;
}

const BtnCreateGroup = function ({ setIsOwner, setGroupID, setUrlMsg }: Props) {
	// Create new group, as owner
	const createGroup = async (e: MouseEvent<HTMLButtonElement>) => {
		setIsOwner(true);
		if (e.target !== null) {
			(e.target as HTMLButtonElement).blur();
		}

		const response = await fetch('/api/group/create', { method: 'POST' });
		const res = await response.json();
		if (res.err) {
			console.log(res.err);
		}
		const { group, numberConnected } = res;
		console.log(`numberConnected: ${numberConnected}`);

		setGroupID(group);
		const url = new URL(window.location.href);
		const urlStr: string = url.toString();
		url.searchParams.set('group', group);
		window.history.replaceState(null, '', url);

		if (navigator.share) {
			await navigator.share({
				title: process.env.NEXT_PUBLIC_APP_NAME || 'App',
				text: 'Use this custom link',
				url: urlStr,
			});
		} else {
			copyToClipboard(urlStr);
		}
		setUrlMsg('Share URL copied to clipboard');
	};

	return (
		<button onClick={createGroup} className="btn-border">
			Create Group
		</button>
	);
};

export default BtnCreateGroup;
