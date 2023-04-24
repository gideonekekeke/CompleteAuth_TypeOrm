import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import decode from 'jwt-decode'

function App() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
 
	//
	// const onSubmit = async () => {
	// await axios
	// .post("http://localhost:6637/api/auth/login", {
	// email,
	// password,
	// })
	// .then((res) => {
	// window.localStorage.setItem("access_token", res.data.access_token);
	// window.localStorage.setItem("refresh_token", res.data.refresh_token);
	// console.log(res);
	// });
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:6637/api/auth/login",
				{
					email,
					password,
				},
			);

			// Store the access token and refresh token in cookies
			Cookies.set("access_token", response.data.access_token);
			Cookies.set("refresh_token", response.data.refresh_token);

			// Redirect to the dashboard
		} catch (err) {}
	};

	const data = Cookies.get("access_token");
	const data2 = Cookies.get("refresh_token");

	const getUser = async () => {
		await axios
			.get("http://localhost:6637/api/users/me", {
				headers: {
					Authorization: `Bearer ${data}`,
				},
			})
			.then((res) => {
				console.log(res);
			});
	};
// 
  // const refreshToken = async()=>{
    // await axios
			// .get("http://localhost:6637/api/auth/refresh", {
				// sessionID: "DR5ez0bIYHFO",
        // data2,
			// 
			// 
			// 
			// })
			// .then((res) => {
				// console.log("token refreshed");
			// });
  // }
// 
  // const decodeToken = decode(data)
  // console.log(decodeToken);
// 
	// Check if access token has expired
	// useEffect(() => {
		// const intervalId = setInterval(() => {
			// if (decodeToken && new Date() >= decodeToken.exp) {
        // console.log("refreshed");
				// refreshToken();
			// }
		// }, 5000);
		// return () => clearInterval(intervalId);
	// }, [decodeToken]);
// 
	useEffect(() => {
		getUser();
	}, []);

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className='App-link'
					href='https://reactjs.org'
					target='_blank'
					rel='noopener noreferrer'>
					Learn React
				</a>
				<input
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<button onClick={handleSubmit}>Submit</button>
				
			</header>
		</div>
	);
}

export default App;
