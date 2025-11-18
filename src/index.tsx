import { render } from 'preact';

import preactLogo from './assets/preact.svg';
import './style.css';
import { useEffect } from 'preact/hooks';

export function App() {
	useEffect(() => {
		const fun = async () => {
			let data = await fetch('https://opentdb.com/api.php?amount=10');
			data.json().then((p)=>{
				console.log(p);
				console.log("win");
			})
		}
		fun();
	})
	
	return <div>Hello world!</div>
}


render(<App />, document.getElementById('app'));
