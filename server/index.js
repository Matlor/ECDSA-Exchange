const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// Generating keys & addresses
let keys = [];
for (i = 0; i < 3; i++) {
	let obj = {};
	let key = ec.genKeyPair();

	obj.privateKey = key.getPrivate().toString(16);
	let publicX = key.getPublic().x.toString(16);
	let publicY = key.getPublic().y.toString(16);

	obj.publicKey = {
		x: publicX,
		y: publicY,
	};

	// Stringified public keys used as addresses
	obj.address = JSON.stringify(obj.publicKey);
	keys.push(obj);
}

// Addresses are used as keys (stringified public key objects)
const balances = {
	[keys[0].address]: 100,
	[keys[1].address]: 50,
	[keys[2].address]: 75,
};

app.get('/balance/:address', (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post('/send', (req, res) => {
	const sender = req.body.sender;
	const msg = req.body.msg;
	const amount = req.body.msg.amount;
	const recipient = req.body.msg.recipient;
	const signature = req.body.signature;

	// verifying signature
	const key = ec.keyFromPublic(JSON.parse(sender), 'hex');
	const msgHash = SHA256(msg).toString();

	// if signature is valid message is executed
	if (key.verify(msgHash, signature) === true) {
		balances[sender] -= amount;
		balances[recipient] = (balances[recipient] || 0) + +amount;
		res.send({ balance: balances[sender] });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
