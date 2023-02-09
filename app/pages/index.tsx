import Head from 'next/head';
import Image from 'next/image';
import { MouseEvent } from 'react';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi';
// import styles from '../styles/Home.module.css';
import { useEffect, useRef, useState } from 'react';
import PlayerBox from '../components/PlayerBox';
import BtnCreateGroup from '../components/BtnCreateGroup';
import joinGroup from '../util/join-group';

const Home = function () {
	const urlRef = useRef<HTMLDivElement>(null);

	const [isOwner, setIsOwner] = useState(false);
	const [groupID, setGroupID] = useState('');
	const [userID, setUserId] = useState('');
	const [urlMsg, setUrlMsg] = useState('');

	const joinGroupOnLoad = async function (
		group: string,
		user: string
	): Promise<void> {
		setIsOwner(false);
		const _u = await joinGroup(group, user);
		if (_u !== undefined) setUserId(_u);
	};

	useEffect(() => {
		// TODO: Check userID and isOwner values from Redux store
		// setIsOwner(_owner || false);
		const params = new URLSearchParams(window.location.search);
		const _gid = params.get('group') || '';
		setGroupID(_gid);

		console.log(
			`[-- LOAD DATA --]\nuserID: ${userID}\ngroupID: ${_gid}\nisOwner: ${isOwner}`
		);

		if (_gid.length && isOwner === false) {
			// Still try to join, even if already joined. To check in case group doesn't exist anymore
			joinGroupOnLoad(_gid, userID);
		} else if (_gid.length) {
			// NOTE: Refreshing owner, is websocket still open?
		}
	}, []);

	const handleGoHome = function (e: MouseEvent<HTMLButtonElement>): void {
		setGroupID('');
		setIsOwner(false);
		window.history.replaceState(null, '', '/');
	};

	const handleUserButton = function (e: MouseEvent<HTMLButtonElement>): void {};

	return (
		<>
			<nav className="nav-main">
				<div className="home-container">
					<button onClick={handleGoHome} className="nav-btn nav-icon-home">
						<AiOutlineHome color="#633796" size="2.7rem" />
					</button>
				</div>
				<h1 className="heading">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
				<div className="button-container">
					<button onClick={handleUserButton} className="nav-btn nav-icon-user">
						<AiOutlineUser color="#633796" size="2.7rem" />
					</button>
				</div>
			</nav>

			<main style={{ textAlign: 'center' }}>
				{groupID && (
					<div className="d-flx">
						<span className="icon mg-r-4 d-flx flx-items-ctr">
							<HiOutlineUserGroup size="35"></HiOutlineUserGroup>
						</span>
						<code className="text-code pd-a-2 pd-r-3 pd-l-3 rnd-8">
							{groupID}
						</code>
					</div>
				)}
				<div className="button-container">
					{!groupID.length && (
						<BtnCreateGroup
							setIsOwner={setIsOwner}
							setGroupID={setGroupID}
							setUrlMsg={setUrlMsg}
						></BtnCreateGroup>
					)}
				</div>
				<div ref={urlRef} className="url-notification">
					{urlMsg}
				</div>

				<PlayerBox isOwner={isOwner} groupID={groupID}></PlayerBox>
			</main>
		</>
	);
};

export default Home;
