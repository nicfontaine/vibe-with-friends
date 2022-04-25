import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from "react"
import copyToClipboard from "./mod/copy-to-clipboard"
import sheets from "./mod/sheets"
export default function Home() {

	const joinGroup = async (id) => {
		const response = await fetch("/api/group/join", {
			method: "PUT",
			headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id})
		})
    const res = await response.json()
    if (res.err) { console.log(err) }
	}

	useEffect(() => {
		let params = new URLSearchParams(window.location.search)
		const id = params.get("group")
		console.log(id)
		// if (id) joinGroup(id)
	}, [])

	const flasherRef = useRef(null)
	const urlRef = useRef(null)
	const [isAdmin, setIsAdmin] = useState(false)

	const urlGenerate = async (e) => {
		
		setIsAdmin(true)
		e.target.blur()
		
		const response = await fetch("/api/group/share", { method: "GET" })
    const res = await response.json()
    if (res.err) { console.log(err) }
		const { id } = res

		let url = new URL(window.location.href)
		url.searchParams.set("group", id)
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
		<main style={{textAlign:"center"}}>
			<h1>Vibe with Friends</h1>

			<button onClick={urlGenerate}>Create Friend Code</button>
			<div ref={urlRef} className="url-notification">&nbsp;</div>

			<div
				ref={flasherRef}
				className={`flasher-box
					${isAdmin ? "show" : ""}`}
				onClick={() => player(sheets.twinkle, 2)}
			>
				<span>Run</span>
			</div>
		</main>
		<style jsx>{`
			main {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 20px;
			}
			h1rs {
				color: #a56cd5;
			}
			.flasher-box {
				width: 200px;
				height: 200px;
				background: rgba(255,255,255,0.2);
				color: rgba(255,255,255,0.8);
				margin-top: 1.5rem;
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: space-around;
				cursor: pointer;
				font-weight: 600;
				font-size: 2rem;
				opacity: 0;
				visibility: hidden;
				transition: opacity 1s;
				transition-delay: 0.75s;
			}
			.flasher-box.show {
				visibility: visible;
				opacity: 1;
			}
			button {
				cursor: pointer;
				font-size: 1.2rem;
				padding: 0.7rem 1.3rem;
				border-radius: 0.5rem;
				background: transparent;
				border: 2px solid rgba(255,255,255,0.4);
				background: rgba(0,0,0,0.2);
				color: #fff;
			}
			button:hover {
				background: #a56cd5;
				border-color: transparent;
			}
			.url-notification {
				margin-top: 1rem;
				color: rgba(255,255,255,0.8);
			}
		`}</style>
		</>
  )
}
