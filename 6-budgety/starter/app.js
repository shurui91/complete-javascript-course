var budgetController = (function() {
	// some code
})();

var UIController = (function() {
	// some code
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn'
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value
			};
		},
		getDOMStrings: function() {
			return DOMStrings;
		}
	};
})();

var controller = (function(budgetController, UIController) {
	// some code
	var DOM = UIController.getDOMStrings();

	var ctrlAddItem = function() {
		// code
		// 1. get the field input data
		var input = UIController.getInput();
		console.log(input);
		// 2. add the item to the budget controller
		// 3. add the item to the UI
		// 4. calculate the budget
		// 5. display the budget on the UI
		console.log('it works');
	};

	document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function(event) {
		if (event.keyCode === 13 || event.which === 13) {
			ctrlAddItem();
		}
	});
})(budgetController, UIController);
