import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import { AiOutlineHome } from "react-icons/ai"
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from "react"
import copyToClipboard from "./mod/copy-to-clipboard"
import sheets from "./mod/sheets"

export default function Home() {
	
	const flasherRef = useRef(null)
	const urlRef = useRef(null)

	const [isOwner, setisOwner] = useState(false)
	const [groupID, setGroupID] = useState("")
	const [userID, setUserId] = useState("")

	useEffect(() => {

		console.log("-- Loaded --")
		
		const _uid = localStorage.getItem("userID")
		setUserId(_uid)
		console.log(`userID: ${_uid}`)
		const _owner = JSON.parse(localStorage.getItem("isOwner"))
		setisOwner(_owner || false)

		let params = new URLSearchParams(window.location.search)
		const _gid = params.get("group")
		const _gidls = localStorage.getItem("groupID")
		setGroupID(_gid)
		console.log(`groupID: ${_gid}`)
		console.log(`isOwner: ${_owner}`)

		if (_gid === _gidls) {
			console.log("Already joined")
		}
		if (_gid && _gid.length && _owner === false) {
			// Still try to join, even if already joined. To check in case group doesn't exist anymore
			joinGroup(_gid, _uid)
		} else if (_gid && _gid.length) {
			// window.location = "/"
		}

	}, [])

	useEffect(() => {
		localStorage.setItem("userID", userID)
	}, [userID])

	useEffect(() => {
		localStorage.setItem("isOwner", isOwner)
	}, [isOwner])

	useEffect(() => {
		localStorage.setItem("groupID", groupID)
	}, [groupID])

	const joinGroup = async (group, user) => {
		
		console.log("joinGroup()")
		setisOwner(false)
		const response = await fetch("/api/group/join", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
      body: JSON.stringify({group, user})
		})
    const res = await response.json()

    if (res.err) console.log(err)
		if (res.group === null) {
			confirm("Friend code no longer valid")
			window.location = "/"
		}
		if (res.user) setUserId(res.user)

	}

	const createGroup = async (e) => {
		
		setisOwner(true)
		e.target.blur()
		
		const response = await fetch("/api/group/create", { method: "POST" })
    const res = await response.json()
    if (res.err) { console.log(err) }
		const { group } = res

		let url = new URL(window.location.href)
		url.searchParams.set("group", group)
		window.history.replaceState(null, null, url)

		if (navigator.share) {
			await navigator.share({
				title: "Viben with Friends",
				text: "Use this custom link",
				url
			})
		} else {
			copyToClipboard(url)
		}

		urlRef.current.innerHTML = "Share URL copied to clipboard"
		
	}

	let isRunning = false

	// Visual on/off player, to test on non-mobile
	// Dividing on indices amongst clients might be i % (clients.length * 2),
	// ...then each client plays if n*2 === result
	const player = async (sheet, mult = 1) => {
		if (isRunning) return;
		isRunning = true
		function timer(ms) { return new Promise((res) => setTimeout(res, ms)) }
		let on = "#3BA067"
		let off = "rgba(255,255,255,0.2)"
		let i = 0
		let innerSave = flasherRef.current.innerHTML
		for (let dur of sheet) {
			let active = i%2 === 0 ? true : false
			if (active) {
				flasherRef.current.style.background = on
				navigator.vibrate(dur * mult)
				flasherRef.current.innerHTML = `<span>${dur * mult} ms</span>`
			} else {
				flasherRef.current.style.background = off
				navigator.vibrate(0)
				flasherRef.current.innerHTML = `<span></span>`
			}
			i++
			await timer(dur * mult)
		}
		flasherRef.current.style.background = off
		flasherRef.current.innerHTML = innerSave
		isRunning = false
	}

  return (
		<>
		
		<nav className="nav-main">
			<div className="home-container">
				<Link href="/">
					<a className="nav-icon-home">
						<AiOutlineHome color="#633796" size="2.7rem"/>
					</a>
				</Link>
			</div>
			<h1>Vibe with Friends</h1>
			<div className="button-container">
				<button onClick={createGroup}>Create Group</button>
			</div>
		</nav>

		<main style={{textAlign:"center"}}>

			<div ref={urlRef} className="url-notification">&nbsp;</div>

			<div
				ref={flasherRef}
				className={`flasher-box
					${isOwner && groupID ? "show" : ""}`}
				onClick={() => player(sheets.twinkle, 2)}
			>
				<span>Run</span>
			</div>
		</main>

		<style jsx>{`
		`}</style>

		</>
  )
}
