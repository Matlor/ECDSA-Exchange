import './index.scss';

// import EC library
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

const server = 'http://localhost:3042';

document
	.getElementById('exchange-address')
	.addEventListener('input', ({ target: { value } }) => {
		if (value === '') {
			document.getElementById('balance').innerHTML = 0;
			return;
		}

		fetch(`${server}/balance/${value}`)
			.then((response) => {
				return response.json();
			})
			.then(({ balance }) => {
				document.getElementById('balance').innerHTML = balance;
			});
	});

document.getElementById('transfer-amount').addEventListener('click', () => {
	// sender
	const sender = document.getElementById('exchange-address').value;

	// msg
	const amount = document.getElementById('send-amount').value;
	const recipient = document.getElementById('recipient').value;

	const msg = {
		amount: amount,
		recipient: recipient,
	};

	// signature
	const signature = 'this will be signature';

	const body = JSON.stringify({
		sender,
		msg,
		signature,
	});

	console.log(body, 'kjfdbvfkbjk');

	const request = new Request(`${server}/send`, { method: 'POST', body });

	fetch(request, { headers: { 'Content-Type': 'application/json' } })
		.then((response) => {
			return response.json();
		})
		.then(({ balance }) => {
			document.getElementById('balance').innerHTML = balance;
		});
});
