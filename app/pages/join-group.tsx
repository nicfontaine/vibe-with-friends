const joinGroup = async (group: string, user: string) => {
	console.log('joinGroup()');
	if (!group.length) {
		console.log('Must supply a group to joinGroup()');
		return;
	}
	const response = await fetch('/api/group/join', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ group, user }),
	});
	const res = await response.json();
	if (res.err) console.log(res.err);
	if (res.group === null) {
		confirm('Friend code no longer valid');
		window.location.assign('/');
	}
	return res.user;
};

export default joinGroup;
