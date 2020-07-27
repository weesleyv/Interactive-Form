
// setting focus on a first text field
const $firstInput = $('#name');
$firstInput.focus();

//hide job role input
const $jobRoleInput = $('#other-title');
$jobRoleInput.hide();

$('#title').change( () => {
	if ($('#title').val() === 'other') {
		$jobRoleInput.show();
	} else {
		$jobRoleInput.hide();
	}
})

//hide option element from design menu
$("#design option:first-child").prop('hidden', true);

//add option element as "placeholder"
$("#color").prepend('<option value="" selected>Please select a T-shirt theme</option>');

//hide colors in color dropdown menu
$('#color option').each((i, color) => {
	$(color).prop('hidden', true);
})

//dependent select options. On change 1st select, show or hide 2nd select options 
$('#design').change(event => {
	if ($(event.target).val() === 'js puns') {
		$('#color option').prop('hidden', true);
		$('#color option:contains("Puns")').prop('hidden', false);
		$('#color option:contains("Puns")').eq(0).prop('selected', true);	
	} else {
		$('#color option').prop('hidden', true);
		$('#color option:contains("I")').prop('hidden', false);
		$('#color option:contains("I")').eq(0).prop('selected', true);	
	}
});

					//ACTIVITY SECTION//

//create and append element to activity section					
const $totalCost = $('<div></div>');
$('.activities').append($totalCost);
let totalActivityCost = 0;

//on change add or remove activity cost to total cost
$('.activities').change( event => {
	const $dataCost = $(event.target).attr('data-cost');
	const $dataCostToNumber = Number($dataCost.replace(/[^0-9\.-]+/g,"")); //data-cost to number
	
	if ($(event.target).prop('checked') === true) {
		totalActivityCost += $dataCostToNumber;
	} else {
		totalActivityCost -= $dataCostToNumber;
	}

	$totalCost.text(`Total: $${totalActivityCost}`);

	//if activity is checked disable other activities wich are happening same time
	const $dayAndTime = $(event.target).attr('data-day-and-time');
	$('input:checkbox').each(i => {
		const $currentInput = $('input:checkbox')[i];
		
		if ($($currentInput).attr('data-day-and-time') === $dayAndTime  &&
			event.target !== $currentInput) {
			if ($(event.target).prop('checked') === true) {
				$($currentInput).attr('disabled', true)
			} else {
				$($currentInput).attr('disabled', false)
			}
		}
		
	})
})

					//PAYMENT SECTION//

//hide “Select Payment Method” option
$('#payment option[value="select method"').hide();

//on change show and hide payment methods
$('#payment').change(event => {
	function ShowHideElement(elementToShow, firstElementToHide, secondElementToHide) {
		$(elementToShow).show();
		$(firstElementToHide).hide();
		$(secondElementToHide).hide();
	}
	if ($(event.target).val() === 'Credit Card') {
		ShowHideElement('#credit-card', '#paypal', '#bitcoin');
	} else if ($(event.target).val() === 'PayPal') {
		ShowHideElement('#paypal', '#bitcoin', '#credit-card');
	} else {
		ShowHideElement('#bitcoin', '#credit-card', '#paypal');
	}
})

//credit card payment method selected by default
$('#payment option[value="Credit Card"]').attr('selected', 'selected');
$('#paypal').hide();
$('#bitcoin').hide();

			
			//VALIDATION FUNCTIONS//


const errMessageAddRemove = (validation, input, name) => {
	const label = $(`label[for='${input}']`)
	if (validation === false) {
		label.text(`Invalid ${name}`)
		label.css('color', 'red')
	} else {
		label.text(`${name}:`)
		label.css('color', 'black')
	}
}

const nameValidation = () => {
	const inputName = $('#name');
	const name = inputName.val();
	const nameRegex = /[\w\-'\s]+/;
	const nameVal = nameRegex.test(name);
	errMessageAddRemove(nameVal, 'name', 'Name');
	return nameVal
}

const emailValidation = () => {
	const emailInput = $('#mail');
	const emailInputValue = emailInput.val();
	const mailRegex = /^[^@]+@[^@.]+\.[a-z]+$/i;
	const mailValidation = mailRegex.test(emailInputValue);
	errMessageAddRemove(mailValidation, 'mail', 'Email');
	return mailValidation
}

//error message for activity section
const errMessage = $('<p>Please check at least one activity</p>');
errMessage.css('color', 'red');
$('.activities').prepend(errMessage);
errMessage.hide();

const activityValidation = () => {
	const checkboxes = $("input[type='checkbox']");

	if (!checkboxes.is(':checked')) {
		errMessage.show();
		return false
	} else {
		errMessage.hide();
		return true
	}
}

const isCreditCardSelected = () => {
	const paymentMethod = $('#payment').val();
	if (paymentMethod === 'Credit Card') {
		return true
	} else {
		return false
	}
}

const cardNumberValidation = () => {
	const ccInput = $('#cc-num');
	const ccNumber = ccInput.val();
	const ccRegEx = /^[0-9]{13,16}$/;
	const ccValidation =  ccRegEx.test(ccNumber);
	errMessageAddRemove(ccValidation, 'cc-num', 'Card Number');
	return ccValidation
}

const zipCodeValidation = () => {
	const zipCodeInput = $('#zip');
	const zipCode = zipCodeInput.val();
	const zipRegEx = /^[0-9]{5}$/;
	const zipValidation =  zipRegEx.test(zipCode);
	errMessageAddRemove(zipValidation, 'zip', 'Zip Code');
	return	zipValidation
}

const cvvNumberValidation = () => {
	const cvvInput = $('#cvv');
	const cvv = cvvInput.val();
	const cvvRegEx = /^[0-9]{3}$/;
	const cvvValidation = cvvRegEx.test(cvv);
	errMessageAddRemove(cvvValidation, 'cvv', 'CVV');
	return cvvValidation
}

const masterValidation = () => {
	if (
		isCreditCardSelected() === false &&
		activityValidation() === true &&
		emailValidation() === true &&
		nameValidation() === true
	   ) {
		return true
	} else if (
		isCreditCardSelected() === true &&
	    cardNumberValidation() === true &&
	    zipCodeValidation() === true &&
		cvvNumberValidation() === true &&
		nameValidation() === true &&
		emailValidation() === true &&
		activityValidation() === true
		) {
		return true
	} else {
		return false
	}
}

// on submit form
$('form').on('submit', event => {
	event.preventDefault();
	if (masterValidation() === false) {
		nameValidation()
		emailValidation();
		activityValidation();
		if (isCreditCardSelected() === true) {
			cardNumberValidation();
			zipCodeValidation();
			cvvNumberValidation();
		}
	} 
})
