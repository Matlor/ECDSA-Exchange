import './index.scss';
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

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

	// Creating msg containing amount & recipient
	const amount = document.getElementById('send-amount').value;
	const recipient = document.getElementById('recipient').value;
	const msg = {
		amount: amount,
		recipient: recipient,
	};

	// Signing msg containing amount & recipient
	const privateKey = document.getElementById('private-key').value;
	const key = ec.keyFromPrivate(privateKey);
	const msgHash = SHA256(msg);
	const signature = key.sign(msgHash.toString());

	// Creating Request
	const body = JSON.stringify({
		sender,
		msg,
		signature,
	});

	const request = new Request(`${server}/send`, { method: 'POST', body });

	fetch(request, { headers: { 'Content-Type': 'application/json' } })
		.then((response) => {
			return response.json();
		})
		.then(({ balance }) => {
			document.getElementById('balance').innerHTML = balance;
		});
});
