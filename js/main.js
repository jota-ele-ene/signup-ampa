$(function() {

  $('.submitbutton').on('click', function(e) {

    // Stop the browser from doing anything else
    e.preventDefault();

    //alert("submitting");
    //alert("checkValidity:"+$('.needs-validation')[0].checkValidity());

    if (!customValidation() || !$('.needs-validation')[0].checkValidity()) {
      //alert ("NO validated")
      event.preventDefault()
      event.stopPropagation()
      if ($('#email2').val() == "") {
        $('#email2').addClass('noValidated');
      }
    }
    else {
      //alert ("validated and process")
      processAndSend();
      $(this).attr("disabled","");
    }

    $('.needs-validation')[0].classList.add('was-validated')

  });

  $('.cloneButton').on('click', function(e) {

     var nHijos = $('.rowHijo');

     //alert ("cloning hijo número " + (nHijos.length+1) );

     var fields_group = $('#datosHijo');
     var fields_template = fields_group.clone(true);

     this.id = "datosHijo" + nHijos.length;
     var field_section = fields_template.clone(true).find('.form-control').each(function(){

       //alert (this.id)
       //set id to store the updated section number
       var newId = this.id + nHijos.length;
       if (newId == "nombre1") $(this).on('change', updateCuota());


       //update for label
       $(this).siblings('label').attr('for', newId);

       //update id
       this.id = newId;

       //update name attribute
       $(this).attr('name', newId);
       $(this).val("");

     }).end();

     $('#groupHijos').append(field_section);

   });

   $('#checkSiAMPA').on('change', checkSiAMPA);
   $('#checkNoAMPA').on('change', checkSiAMPA);

  $('.magic').on('change', checkIBAN);
  $('.magic').on('keyup', checkIBAN);
  $('.magic').on('paste', onPaste);
  //$('#iban').on('change', validateIBAN);

  $('#email1').on('change', checkEmail);
  $('#email1').on('paste', onPaste);
  $('#email2').on('change', checkEmail);
  $('#email2').on('paste', onPaste);

  $('#nif').on('change', checkNIF);
  $('#nif').on('paste', onPaste);

});

function customValidation() {
  if (!validateEmail($('#email1').val())) {return false;}
  else if ($("#email2").val()&&!validateEmail($("#email2").val())) {return false;}
  else if($('#checkNoAMPA').is(':checked') && (!validateNIF($('#nif').val())||!validateIBAN($('#iban').val()))) {return false;}
  else {return true;}
}


function processAndSend() {

  $('#modalCenter').modal();

  var nHijos = $('.rowHijo');
  var nrecord = 0;

  for (let i = 0; i < nHijos.length; i++) {

      var isAMPA = $('#checkSiAMPA').is(':checked') ? "SI" : "NO";
      var resHijos = "Hemos inscrito en la AMPA a {numHijos}.<br>Nos vemos en el cole.";
      var sufix = "";
      if (i>0) sufix = i;
        // Do an AJAX post
        $.ajax({
          type: "POST",
          url: "https://formbold.com/s/9x2zW",
          data: {
            nombre: $("#apellido"+sufix).val() + ", " + $("#nombre"+sufix).val(),
            curso: $("#curso"+sufix).val(),
            ampa: isAMPA,
            titular: $("#titular").val().toUpperCase(),
            nif: $("#nif").val(),
            iban: $("#iban").val(),
            email1: $("#email1").val(),
            email2: $("#email2").val()
          },
          success: function(data) {
            // POST was successful - do something with the response
            if (nrecord>-1) nrecord++;
            if (nrecord === nHijos.length)
            {
              $(".loader").addClass('d-none');
              $(".res-loader-ok").removeClass('d-none');
              if (nrecord === 1) { $("#resHijos").html(resHijos.replace("{numHijos}", "tu hijo")); }
              else { $("#resHijos").html(resHijos.replace("{numHijos}","tus "+nrecord+" hijos")); }
            }
          },
          error: function(data) {
            // Server error, e.g. 404, 500, error
            //alert ("fail after: "+ nrecord)
            nrecord = -1;
            $(".loader").addClass('d-none');
            $(".res-loader-nok").removeClass('d-none');
          }
        });

    }

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
	"AL": 28,	"AD": 24,	"AT": 20,	"AZ": 28,	"BH": 22,	"BY": 28,	"BE": 16,	"BA": 20,
	"BR": 29,	"BG": 22,	"CR": 22,	"HR": 21,	"CY": 28,	"CZ": 24,	"DK": 18,	"DO": 28,
	"SV": 28,	"EE": 20,	"FO": 18,	"FI": 18,	"FR": 27,	"GE": 22,	"DE": 22,	"GI": 23,
	"GR": 27,	"GL": 18,	"GT": 28,	"HU": 28,	"IS": 26,	"IQ": 23,	"IE": 22,	"IL": 23,
	"IT": 27,	"JO": 30,	"KZ": 20,	"XK": 20,	"KW": 30,	"LV": 21,	"LB": 28,	"LI": 21,
	"LT": 20,	"LU": 20,	"MK": 19,	"MT": 31,	"MR": 27,	"MU": 30,	"MD": 24,	"MC": 27,
	"ME": 22,	"NL": 18,	"NO": 15,	"PK": 24,	"PS": 29,	"PL": 28,	"PT": 25,	"QA": 29,
	"RO": 24,	"LC": 32,	"SM": 27,	"ST": 25,	"SA": 24,	"RS": 22,	"SC": 31,	"SK": 24,
	"SI": 19,	"ES": 24,	"SE": 24,	"CH": 21,	"TL": 23,	"TN": 24,	"TR": 26,	"UA": 29,
	"AE": 23,	"GB": 22,	"VG": 24
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

function checkSiAMPA(e) {
	$input = $(this)
  if($('#checkSiAMPA').is(':checked')) { $(".bank-data input").removeAttr("required"); $(".bank-data input").attr("disabled","")}
  else { $(".bank-data input").attr("required",""); $(".bank-data input").removeAttr("disabled")}
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

  if (validateIBAN(edit))
  {
    $input[0].classList.remove('is-invalid')
    $input[0].classList.add('is-valid')
    return true;
  }
  else
  {
    $input[0].classList.remove('is-valid')
    $input[0].classList.add('is-invalid')
    return false;
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

//check inban function
function checkEmail(e) {
	$input = $(this);
  const email = $input.val();

  if (email && validateEmail(email) )
  {
    $input[0].classList.remove('is-invalid')
    $input[0].classList.add('is-valid')
    return true;
  }
  else
  {
    $input[0].classList.remove('is-valid')
    $input[0].classList.add('is-invalid')
    return false;
  }
}

function validateEmail(email) {

  const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);

}

//check inban function
function checkNIF(e) {
	$input = $(this);
  const nif = $input.val();
  if (nif && validateNIF(nif) )
  {
    $input[0].classList.remove('is-invalid')
    $input[0].classList.add('is-valid')
    return true;
  }
  else
  {
    $input[0].classList.remove('is-valid')
    $input[0].classList.add('is-invalid')
    return false;
  }
}

function validateNIF(dni) {

    var numero, let, letra;
    var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    dni = dni.toUpperCase();

    if(expresion_regular_dni.test(dni) === true){
        numero = dni.substr(0,dni.length-1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        let = dni.substr(dni.length-1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero+1);
        if (letra != let) {
            //alert('Dni erroneo, la letra del NIF no se corresponde');
            return false;
        }else{
            //alert('Dni correcto');
            return true;
        }
    }else{
        //alert('Dni erroneo, formato no válido');
        return false;
    }
}

function validateIBAN(edit) {
    var digits = "";
    var iban = String(edit).toUpperCase().replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
            code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/), // match and capture (1) the country code, (2) the check digits, and (3) the rest
            digits;
    // check syntax and length
    //if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
    if (!code || iban.length !== defaults[code[1]]) {
        return false;
    }
    // rearrange country code and check digits, and convert chars to ints
    digits = (code[3] + (""+code[1]) + code[2]).replace(/[A-Z]/g, function (letter) {
        if (letter.charCodeAt(0) - 55) {
            return letter.charCodeAt(0) - 55;
        }
    });
    // final check
    if (mod97(digits) === 1)
    {
        return true;
    }
    else {
      return false;
    }

}

function mod97(string) {
    var checksum = string.slice(0, 2), fragment;
    for (var offset = 2; offset < string.length; offset += 7) {
        fragment = String(checksum) + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
}

function getnumIBAN(letra) {
    ls_letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return ls_letras.search(letra) + 10;
}

function updateCuota(letra) {
    var texto = $(".tyc").html();
    if (texto) $(".tyc").html(texto.replace("50€","65€"));
}
