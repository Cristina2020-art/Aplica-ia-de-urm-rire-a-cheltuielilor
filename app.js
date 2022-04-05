const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const inputText = document.getElementById('text');
const inputAmount = document.getElementById('amount');
const messageDiv = document.querySelector('.message');

form.addEventListener('submit', addTransaction);

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
	e.preventDefault();
	if (inputText.value.trim() == '' || inputAmount.value.trim() == '') {
		messageDiv.classList.add('show');
		messageDiv.innerHTML = '<h4>Vă rugăm să adăugați text și suma!</h4>';
		setTimeout(() => {
			messageDiv.classList.remove('show');
		}, 3000);
	} else {
		const transaction = {
			id: generateId(),
			text: inputText.value,
			amount: parseInt(inputAmount.value)
		};
		transactions.push(transaction);
		addTransToDom(transaction);
		updateValues();
		updateLocalStorage();

		messageDiv.classList.add('success');
		messageDiv.innerHTML = '<h4>Tranzacția a fost adăugată cu succes! </h4>';
		setTimeout(() => {
			messageDiv.classList.remove('success');
		}, 3000);

		inputText.value = '';
		inputAmount.value = '';
		console.log(transaction);
	}
}

function generateId() {
	return Math.floor(Math.random() * 10000);
}

function addTransToDom(transaction) {
	const sign = transaction.amount < 0 ? '-' : '+';
	const item = document.createElement('li');
	item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

	item.innerHTML = `${transaction.text}<span>${sign}${Math.abs(transaction.amount)} 
    </span> <button class = "btn-delete" onclick = "removeTransaction(${transaction.id})">X</button>`;

	list.appendChild(item);
}

function updateValues() {
	const amounts = transactions.map((transaction) => transaction.amount);
	const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
	const income = amounts.filter((amount) => amount > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
	const expense = amounts.filter((amount) => amount < 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
	balance.innerHTML = '€' + `${total}`;
	moneyPlus.innerHTML = '€' + income;
	moneyMinus.innerHTML = '€' + expense;
}

function updateLocalStorage() {
	localStorage.setItem('transactions', JSON.stringify(transactions));
}

function removeTransaction(id) {
	transactions = transactions.filter((item) => item.id !== id);
	updateLocalStorage();
	initApp();
}

function initApp() {
	list.innerHTML = '';
	transactions.forEach(addTransToDom);
	updateValues();
}

initApp();
