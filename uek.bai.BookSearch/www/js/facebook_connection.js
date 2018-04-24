
$("document").ready(function(){

	function init() {
		document.addEventListener("deviceready",onDeviceReady, false);
	}

	function onDeviceReady() {
		navigator.notification.beep(1);
	}

	var isExist = [];
	var isExistPassword = [];
	firebase.database().ref('users').on('value',function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				if(!isUserExistInDatabase(childSnapshot.val().email)){
					isExist.push(childSnapshot.val().email);
					isExistPassword.push(childSnapshot.val().password);
				}
  			});
	});

	$("#facebookSignIn").click(function(){
		var facebookProvider = new firebase.auth.FacebookAuthProvider();
		signIn(facebookProvider);
	});

	$("#signOut").click(function(){
		signOut();
	});

	function signIn(provider){

		firebase.auth().signInWithPopup(provider).then(function(result){
			 var token = result.credential.accessToken;
			 var user = result.user;
			 console.log(token);
			 console.log(user);
			 //retrieving data from facebook user profile
			 $('#userName').text(user.providerData[0].displayName);
			 $("#userEmailAddress").text(user.providerData[0].email);
			 $("#userPhoneNumber").text(user.providerData[0].phoneNumber);
			 $("#userProfileImage").attr("src",user.providerData[0].photoURL);
			 $("#userProfileImage").attr("width","100px");
			 $("#userProfileImage").attr("height","100px");
			 $("#providerId").text(user.providerData[0].providerId);
			 $("#userId").text(user.providerData[0].uid);
		}).catch(function(error) {

			  var errorCode = error.code;
			  var errorMessage = error.message;
			  var email = error.email;
			  var credential = error.credential;

		});

	}

	function signOut(){

		firebase.auth().signOut().then(function(result) {
		 alert("successfull" + result);
		 $('#userName').text("");
		 $("#userEmailAddress").text("");
		 $("#userPhoneNumber").text("");
		 $("#userProfileImage").attr("src","");
		 $("#userProfileImage").attr("width","");
		 $("#userProfileImage").attr("height","");
		 $("#providerId").text("");
		 $("#userId").text("");
		}).catch(function(error) {
		  alert("error");
		});
	}

	var a = true;
	$("#register").click(function(){
		if(a){
			$('#signin').attr("disabled","");
			reduceFormAnimateAhead();

			$("#registrationForm").delay(1000).slideDown(3000);
			a = false;
		}else{
			$("#registrationForm").slideUp(2000);
			reduceFormAnimateBack();

			$('#signin').delay(3200).queue(function(next) { $(this).removeAttr('disabled'); next(); });
			a=true;
		}
	});

	var b = true;
	$("#signin").click(function(){
		if(b){
			$('#register').attr("disabled","");

			reduceFormAnimateAhead();

			$("#customSignIn").delay(1000).slideDown(3000);
			b = false;
		}else{
			$("#customSignIn").slideUp(2000);

			reduceFormAnimateBack();

			$('#register').delay(3200).queue(function(next) { $(this).removeAttr('disabled'); next(); });
			b=true;
		}
	});

	function reduceFormAnimateAhead(){
			$('#authorizationTitle').css("transition","top 1.5s");
			$('#authorizationTitle').css("top","20px");
			$('#authorizationTitle').css("-webkit-transition","top 1.5s");

			$('#facebookSignIn').css("transition","top 1.5s");
			$('#facebookSignIn').css("top","20px");
			$('#facebookSignIn').css("-webkit-transition","top 1.5s");

			$('#signin').css("transition","top 1.5s");
			$('#signin').css("top","25px");
			$('#signin').css("-webkit-transition","top 1.5s");

			$('#register').css("transition","top 1.5s");
			$('#register').css("top","25px");
			$('#register').css("-webkit-transition","top 1.5s");
	}

	function reduceFormAnimateBack(){
			$('#authorizationTitle').css("transition","top 1.5s");
			$('#authorizationTitle').css("top","65px");
			$('#authorizationTitle').css("-webkit-transition-delay", "2s");
			$('#authorizationTitle').css("transition-property","top");

			$('#facebookSignIn').css("transition","top 1.5s");
			$('#facebookSignIn').css("top","70px");
			$('#facebookSignIn').css("-webkit-transition-delay", "2s");
			$('#facebookSignIn').css("transition-property","top");

			$('#signin').css("transition","top 1.5s");
			$('#signin').css("top","75px");
			$('#signin').css("-webkit-transition-delay", "2s");
			$('#signin').css("transition-property","top");

			$('#register').css("transition","1.5s");
			$('#register').css("top","75px");
			$('#register').css("-webkit-transition-delay", "2s");
			$('#register').css("transition-property","top");
	}

	$("#user_register_button").click(function(){
		//alert(isExist.length);
		registration();
	});

	function registration(){

		var regRegisterFirstNameExpression = /^[A-Z]{1}[a-z]+[?=.\ ][A-Z]{1}[a-z]+$/; //good
		var regRegisterEmailExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;//good
		var regRegisterPasswordExpression = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$/; //good

		var userRegisterFirstName = $("#user_register_first_name").val();
		var userRegisterEmailAddress = $("#user_register_email_address").val();
		var userRegisterPassword = $("#user_register_password").val();
		var userRegisterConfirmPassword = $("#user_register_confirm_password").val();

		var userRegisterFirstNameMatch = userRegisterFirstName.match(regRegisterFirstNameExpression);
		var userRegisterEmailAddressMatch = userRegisterEmailAddress.match(regRegisterEmailExpression);
		var userRegisterPasswordMatch = userRegisterPassword.match(regRegisterPasswordExpression);
		var userRegisterConfirmPasswordMatch = userRegisterConfirmPassword.match(regRegisterPasswordExpression);

		if(userRegisterFirstName == userRegisterFirstNameMatch) {
			$("#user_register_first_name").css("border","1px solid green");
		}
		else {
			$("#user_register_first_name").css("border","1px solid red");
		}

		if(userRegisterEmailAddressMatch != null){
			if(userRegisterEmailAddress == userRegisterEmailAddressMatch[0]){
				$("#user_register_email_address").css("border","1px solid green");
			}
			else {
				$("#user_register_email_address").css("border","1px solid red");
			}
		}else {
			$("#user_register_email_address").css("border","1px solid red");
		}

		if(userRegisterPassword == userRegisterPasswordMatch) {
			$("#user_register_password").css("border","1px solid green");
		}
		else {
			$("#user_register_password").css("border","1px solid red");
		}

		if(userRegisterConfirmPassword == userRegisterConfirmPasswordMatch) {
			$("#user_register_confirm_password").css("border","1px solid green");
		}
		else {
			$("#user_register_confirm_password").css("border","1px solid red");
		}

		if(userRegisterFirstName == userRegisterFirstNameMatch && userRegisterEmailAddress == userRegisterEmailAddressMatch[0] && userRegisterPassword == userRegisterPasswordMatch && userRegisterConfirmPassword == userRegisterConfirmPasswordMatch){
			if(!isUserExistInDatabase(userRegisterEmailAddress)){
				addUserToDatabase(userRegisterFirstName,userRegisterEmailAddress,userRegisterConfirmPassword,"aa");
				firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
					//alert("registered");
				}).catch(function(error) {
				    var errorCode = error.code;
				    var errorMessage = error.message;
				});
				alert("Uzytkownik zarejestrowany");
			}else{
				alert("Uzytkownik z takim emailem juz istnieje");
			}

		}
	}

	var userData = {

	};


	var isExist1 = false;
	function isUserExistInDatabase(email){
		for(var i = 0; i<isExist.length; i++){
			if(isExist[i] == email){
				isExist1 = true;
				break;
			}else{
				isExist1 = false;
			}
		}
		return isExist1;
	}

	var isExist2 = false;
	function isUserExistInDatabase1(email,password){
		alert("a");
		for(var i = 0; i<isExist.length; i++){
			if(isExist[i] == email && isExistPassword[i] == password){
				isExist2 = true;
				break;
			}else{
				isExist2 = false;
			}
		}
		return isExist2;
	}


	function addUserToDatabase(name,email,password,photo_url){

  		var rootRef = firebase.database().ref();
  		var storesRef = rootRef.child('users');
  		var newStoreRef = storesRef.push();
  		//alert(newStoreRef.key);
  		newStoreRef.set({
    		username: name,
    		email: email,
    		password: password,
    		photo_url:photo_url
  		});
  		/*var newCarRef = newStoreRef.child('book').push();
		newCarRef.set({
	  		title: 'Mercedes',
	  		img: 'http://'
		});
		var newCarRef1 = newStoreRef.child('book').push();
		newCarRef1.set({
	  		title: 'Audi',
	  		img: 'http://'
		});*/
		userData.id = newStoreRef.key;
		userData.name = name;
		userData.email = email;
		userData.password = password;
		userData.photo_url = photo_url;
		alert(userData.id + " " + userData.name + " " + userData.password);
	}


	$("#user_custom_signin_button").click(function(){

		var regSignInEmailExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;//good
		var regSignInPasswordExpression = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$/; //good

		var userSignInEmailAddress = $("#user_custom_signin_email").val();
		var userSignInPassword = $("#user_custom_signin_password").val();


		var userSignInEmailAddressMatch = userSignInEmailAddress.match(regSignInEmailExpression);
		var userRegisterPasswordMatch = userSignInPassword.match(regSignInPasswordExpression);

		if(userSignInEmailAddressMatch != null){
			if(userSignInEmailAddress == userSignInEmailAddressMatch[0]){
				$("#user_custom_signin_email").css("border","1px solid green");
			}
			else {
				$("#user_custom_signin_email").css("border","1px solid red");
			}
		}else {
			$("#user_custom_signin_email").css("border","1px solid red");
		}

		if(userSignInPassword == userRegisterPasswordMatch) {
			$("#user_custom_signin_password").css("border","1px solid green");
		}
		else {
			$("#user_custom_signin_password").css("border","1px solid red");
		}
		if(userSignInEmailAddress == userSignInEmailAddressMatch[0] && userSignInPassword == userRegisterPasswordMatch){
			if(isUserExistInDatabase1(userSignInEmailAddress,userSignInPassword)){
				testSignIn(userSignInEmailAddress,userSignInPassword);
			}else{
				alert("Uzytkownik z takim loginem nie zarejestowany");
			}
		}

	});

	function testSignIn(email,password){
		window.localStorage.setItem("login",email);
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
			if(user){
				alert("awd");
			}
		});
		$.mobile.changePage( "./panel.html", { transition: "slideup", changeHash: false });
	}

});
