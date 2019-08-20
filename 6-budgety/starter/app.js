var budgetController = (function() {
	// some code
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			// create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// push it to our data structure
			data.allItems[type].push(newItem);

			// return the new element
			return newItem;
		},

		deleteItem: function(type, id) {
			var ids, index;

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});
			index = ids.indexOf(id);
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
			// Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
		},

		calculatePercentages: function() {
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function() {
			console.log(data);
		}
	};
})();

var UIController = (function() {
	// some code
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
	};

	var formatNumber = function(num, type) {
		var numSplit, int, dec, type;
		/*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
		}

		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;
			// create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMStrings.incomeContainer;
				html =
					'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMStrings.expensesContainer;
				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			// insert the HTML into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		clearFields: function() {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current, index, array) {
				current.value = '';
			});
			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? (type = 'inc') : (type = 'exp');
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},

		getDOMStrings: function() {
			return DOMStrings;
		}
	};
})();

var controller = (function(budgetController, UIController) {
	// some code
	var setupEventListeners = function() {
		var DOM = UIController.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function() {
		// 1. Calculate the budget
		budgetController.calculateBudget();
		// 2. Return the budget
		var budget = budgetController.getBudget();
		// 3. Display the budget on the UI
		UIController.displayBudget(budget);
	};

	var updatePercentages = function() {
		// 1. calculate percentages
		budgetController.calculatePercentages();

		// 2. read percentages from the budget controller
		var percentages = budgetController.getPercentages();

		// 3. update the UI with the new percentages
		UIController.displayPercentages(percentages);
	};

	var ctrlAddItem = function() {
		// code
		var input, newItem;

		// 1. get the field input data
		input = UIController.getInput();
		console.log(input);

		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// 2. add the item to the budget controller
			newItem = budgetController.addItem(input.type, input.description, input.value);
			// 3. add the item to the UI
			UIController.addListItem(newItem, input.type);
			// 4. clear the fields
			UIController.clearFields();
			// 5. calculate the budget
			updateBudget();
			// 6. calculate and update percentages
			updatePercentages();
		}
	};

	var ctrlDeleteItem = function(event) {
		// console.log(event.target);
		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = splitID[1];

			// 1. delete the item from the data structure
			budgetController.deleteItem(type, ID);

			// 2. delete the item from UI
			UIController.deleteListItem(itemID);

			// 3. update and show the new budget
			updateBudget();

			// 4. calculate and update percentages
			updatePercentages();
		}
	};

	return {
		init: function() {
			console.log('application has started');
			UIController.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();
