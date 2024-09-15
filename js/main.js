$(function() {

  $('.submitbutton').on('click', function(e) {

    alert("submitting");

    if (!customValidation() || !$('.needs-validation')[0].checkValidity()) {
      alert ("NO validated")
      event.preventDefault()
      event.stopPropagation()
      if ($('#email2').val() == "") {
        $('#email2').addClass('noValidated');
      }
    }
    else {
      alert ("validated and process")
      processAndSend();
    }

    $('.needs-validation')[0].classList.add('was-validated')

  });

  $('.cloneButton').on('click', function(e) {

     var nHijos = $('.rowHijo');

     alert ("cloning hijo número " + (nHijos.length+1) );

     var fields_group = $('#datosHijo');
     var fields_template = fields_group.clone(true);

     this.id = "datosHijo" + nHijos.length;
     var field_section = fields_template.clone(true).find('.form-control').each(function(){

       alert (this.id)
       //set id to store the updated section number
       var newId = this.id + nHijos.length;

       //update for label
       $(this).siblings('label').attr('for', newId);

       //update id
       this.id = newId;

       //update name attribute
       $(this).attr('name', newId);

     }).end();

     $('#groupHijos').append(field_section);

   });

  $('.magic').on('change', checkIBAN);
  $('.magic').on('keyup', checkIBAN);
  $('.magic').on('paste', onPaste);

});

function customValidation() {
  return true;
}


function procssAndSend() {

    // Stop the browser from doing anything else
    e.preventDefault();

    // Do an AJAX post
    $.ajax({
      type: "POST",
      url: "https://formbold.com/s/3dGNb",
      data: {
        nombre: $("#nombre").val(),
        apellido: $("#apellido").val()
      },
      success: function(data) {
        // POST was successful - do something with the response
        alert('Server sent back: ' + data);
      },
      error: function(data) {
        // Server error, e.g. 404, 500, error
        alert(data.responseText);
      }
    });
  }


//mask
var $mask;

//input
var $input;

//define ibans
var ibans;

//space
var space = '<span class="mask-space"> </span>';

//part
var part = '<span class="mask-part"></span>';

//filled
var filled = function (val) {
	return '<span class="mask-part mask-filled">' + val + '</span>'
}

//default ibans
var defaults = {
	"AL": 28,
	"AD": 24,
	"AT": 20,
	"AZ": 28,
	"BH": 22,
	"BY": 28,
	"BE": 16,
	"BA": 20,
	"BR": 29,
	"BG": 22,
	"CR": 22,
	"HR": 21,
	"CY": 28,
	"CZ": 24,
	"DK": 18,
	"DO": 28,
	"SV": 28,
	"EE": 20,
	"FO": 18,
	"FI": 18,
	"FR": 27,
	"GE": 22,
	"DE": 22,
	"GI": 23,
	"GR": 27,
	"GL": 18,
	"GT": 28,
	"HU": 28,
	"IS": 26,
	"IQ": 23,
	"IE": 22,
	"IL": 23,
	"IT": 27,
	"JO": 30,
	"KZ": 20,
	"XK": 20,
	"KW": 30,
	"LV": 21,
	"LB": 28,
	"LI": 21,
	"LT": 20,
	"LU": 20,
	"MK": 19,
	"MT": 31,
	"MR": 27,
	"MU": 30,
	"MD": 24,
	"MC": 27,
	"ME": 22,
	"NL": 18,
	"NO": 15,
	"PK": 24,
	"PS": 29,
	"PL": 28,
	"PT": 25,
	"QA": 29,
	"RO": 24,
	"LC": 32,
	"SM": 27,
	"ST": 25,
	"SA": 24,
	"RS": 22,
	"SC": 31,
	"SK": 24,
	"SI": 19,
	"ES": 24,
	"SE": 24,
	"CH": 21,
	"TL": 23,
	"TN": 24,
	"TR": 26,
	"UA": 29,
	"AE": 23,
	"GB": 22,
	"VG": 24
}

//set mask function
function setMask(val) {
	$mask.html(val);
}

//set input max length function
function setLength(length) {
  if (length<100) $input.attr('minlength', length);
  $input.attr('maxlength', length);
}

//check inban function
function checkIBAN(e) {
	$input = $(this)
	$mask = $input.parent().find('.mask');

	//config array from input
	var config = $input.data('config')

	//check for config
	if (config != undefined) {
		//if config is defined check for merge
		if (config.merge === true) {
			//if merge is true, the defaults and the config ibans will be merged. the config ibans will overwrite the defaults. the merge config isn't mandatory, if it isn't set, it's no true.
			ibans = $.extend({}, defaults, config.ibans);
		} else {
			//if merge is false, use only config ibans
			ibans = config.ibans;
		}
	} else {
		//if config is undefined use default ibans
		ibans = defaults;
	}

	//value of input
	var val = $(this).val();

	//make all letters uppercase ISO 13616:1997
	var valUppercase = val.toUpperCase();

	//remove all spaces from userinput, prevent wrong spaces
	var edit = valUppercase.replace(/ /g, '');

	//check length, detect only if input is longer than 4
	if (edit.length >= 4) {
		//check if iban, check if first two inputs are characters and the following 2 have to be numbers
		if (edit.match(/^[a-zA-Z]{2}[0-9]{2}/)) {

			//get country, the first two characters of input
			var CountryCode = edit.match(/^[a-zA-Z]{2}/);

			//get max length of iban by country
			var maskLenght = ibans[CountryCode[0]];

			//calculate how many spaces are needed
			var spacesLength = Math.floor(maskLenght / 4);

			//calculate maxlength of whole input, iban length + spaces
			var maxLength = spacesLength + maskLenght;

			//set empty mask
			var maskVal = '';

			//remove all characters and special chars in iban
			edit = CountryCode + edit.replace(/[^0-9]/g, '');

			//add spaces in iban after every 4th input
			edit = edit.replace(/(.{4})/g, '$1 ');

			//change value to edited input with spaces
			val = edit;

			//make array of formated iban
			var editArray = edit.split('')

			//loop trought iabn array
			for (var i = 0; i < maxLength; i++) {

				//check if is value in the array
				if (editArray[i] != undefined) {

					//if has value, fill the input in the mask-par to get the exact length of the mask
					maskVal += filled(editArray[i]);
				} else {
					//if has no value in array set mask
					//because of different positions of spaces I have to do this check... first space matches i % 4 = 0 but the other spaces won't work with this.
					if (i == 4) {
						//add space after 4th input
						maskVal += space;
					} else {
						//check for space
						if ((i + 1) % 5 == 0) {
							//set space in mask
							maskVal += space;
						} else {
							//set mask
							maskVal += part;
						}
					}
				}
			}

			//set max-length on input
			setLength(maxLength);

			//dont set value if user deleted input
			if (e.which != 8) {
				//set formatted value of input
				$input.val(edit)
			}

			//set mask
			setMask(maskVal);
		} else {
			//if input is not iban, remove mask
			setMask('');
			//set maxlength
			setLength(500);
		}
	} else {
		//if input is to short, remove mask
		setMask('');

		//set maxlength
		setLength(500);
	}
}

//detect change on paste event
function onPaste(e) {
	//set clipboard value in input value because I can't catch the value after paste without using other events
	$(this).val(e.originalEvent.clipboardData.getData('text'))

	//prevent default event
	e.preventDefault();

	//trigger change
	$(this).change();
}
