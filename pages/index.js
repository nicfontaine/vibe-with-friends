import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useRef } from "react"

export default function Home() {

	const flasherRef = useRef(null)

	useEffect(() => {
	}, [])

	// Notification setup
	const setup = async () => {
		let permission = await Notification.requestPermission()
		if (permission !== "granted") return;
		// const greeting = new Notification("Hi, hello")
	}

	// Visual on/off player, to test on non-mobile
	const player = async (sheet) => {
		function timer(ms) { return new Promise((res) => setTimeout(res, ms)) }
		let on = "#3BA067"
		let off = "rgba(255,255,255,0.2)"
		let i = 0
		let innerSave = flasherRef.current.innerHTML
		for (let dur of sheet) {
			let _v = i%2 === 0 ? on : off
			flasherRef.current.style.background = _v
			flasherRef.current.innerHTML = `<span>Duration:<br>${dur}</span>`
			i++
			await timer(dur)
		}
		flasherRef.current.style.background = off
		flasherRef.current.innerHTML = innerSave
	}

	// Run visual player
	const testRun = async () => {
		await setup
		player([1000, 1000, 1000, 1000, 500, 500, 1000])
	}

  return (
		<>
		<main style={{textAlign:"center"}}>
			<h2>App</h2>
			<div
				ref={flasherRef}
				className="flasher-box"
				onClick={testRun}
			>
				<span>Click to Test Run</span>
			</div>
		</main>
		<style jsx>{`
			main {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.flasher-box {
				width: 200px;
				height: 200px;
				background: rgba(255,255,255,0.2);
				color: #fff;
				margin-top: 1rem;
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: space-around;
			}
		`}</style>
		</>
  )
}
