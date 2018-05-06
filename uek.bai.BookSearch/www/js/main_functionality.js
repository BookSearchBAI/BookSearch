

var userInfo={};
var signup = false;
var signin = false;
var signinFB = false;
		
firebase.auth().getRedirectResult().then(function(result) {
	if (result.credential) {
		signinFB = true;
		var token = result.credential.accessToken;
	} else {
	}
	var user = result.user;
}).catch(function(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
	var email = error.email;
	var credential = error.credential;
	if (errorCode === 'auth/account-exists-with-different-credential') {
	  alert('You have already signed up with a different auth provider for that email.');
	} else {
	  console.error(error);
	}
	firebase.auth().signOut();
});
	  
firebase.auth().onAuthStateChanged(function(user) {			
	  if (user) {
		  if(signin==true){
			 $("#userName").text(user.displayName);
			 $("#userPhoto").attr("src",user.photoURL);
			 $("#userPhoto").attr("width","50px");
			 $("#userPhoto").attr("height","50px");
			 $("#userId").text(user.uid);
			 $("#userEmail").text(user.email);
			 userInfo.name = user.displayName;
			 userInfo.email = user.email;
			 userInfo.id = user.uid;
			 userInfo.photo = user.photoURL;
			 $.mobile.changePage("#mainMenu");
			 signin=false;
		  }
		  if(signup==true){
			user.updateProfile({
			  displayName: $("#signUpName").val(),
			  photoURL: "img/user-profile.png"
		  }).then(function() {
			$("#userName").text(user.displayName);
			$("#userPhoto").attr("src",user.photoURL);
			$("#userPhoto").attr("width","50px");
			$("#userPhoto").attr("height","50px");
			$("#userId").text(user.uid);
			$("#userEmail").text(user.email);
			userInfo.name = user.displayName;
			userInfo.email = user.email;
			userInfo.id = user.uid;
			userInfo.photo = user.photoURL;
			$.mobile.changePage("#mainMenu");
			//var userRefDBKey = firebase.database().ref('users/' + userInfo.id);
			//if(userRefDBKey.key != userInfo.id){
				addUserToDataBase(userInfo.name,userInfo.email,userInfo.id,userInfo.photo);
			//}
			signup=false;
			}).catch(function(error) {
			});
		  }
		  if(signinFB==true){
			  $("#userName").text(user.displayName);
			  $("#userPhoto").attr("src",user.photoURL);
			  $("#userPhoto").attr("width","50px");
			  $("#userPhoto").attr("height","50px");
			  $("#userId").text(user.uid);
			  $("#userEmail").text(user.email);
			  userInfo.name = user.displayName;
			  userInfo.email = user.email;
			  userInfo.id = user.uid;
			  userInfo.photo = user.photoURL;
			  $.mobile.changePage("#mainMenu");
			  var userRefDBKey = firebase.database().ref('users/' + userInfo.id);
			  var str1 = userRefDBKey.key;
				if(str1.localeCompare(userInfo.id)!=0){
					addUserToDataBase(userInfo.name,userInfo.email,userInfo.id,userInfo.photo);
				}
			  signinFB = false;
		  }
	  }else {
		  firebase.auth().signOut();
	  }
});
		
function addUserToDataBase(name,email,userId,photo_url){
	var rootRef = firebase.database().ref('users/'+userId).set({
		username: name,
		email: email,
		photo_url: photo_url
	});
}
		
function signUp(){
	signup=true;
	firebase.auth().createUserWithEmailAndPassword($("#signUpEmail").val(), $("#signUpPassword").val()).catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  alert(error.message);
	});
	firebase.auth().signOut();
}
function signIn(){
	signin=true;
	firebase.auth().signInWithEmailAndPassword($("#signInEmail").val(), $("#signInPassword").val()).catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  alert(error.message);
	});
	firebase.auth().signOut();
}
function facebookSignIn() {
	signinFB = true;
	var provider = new firebase.auth.FacebookAuthProvider();
	firebase.auth().signInWithRedirect(provider);
	firebase.auth().signOut();
}

function userProfile(){
	$("#userName").text("Name: " + userInfo.name);
	$("#userPhoto").attr("src", userInfo.photo);
	$("#userPhoto").attr("width","200px");
	$("#userPhoto").attr("height","200px");
	$("#userId").text("Id: " +  userInfo.id);
	$("#userEmail").text("Email: " + userInfo.email);
	$.mobile.changePage("#userProfile");
}

function checkISBN(){
	  var isbn =$('#isbn').val();
	  $.getJSON( "https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn, function (data) {
	   var title = data['items']['0']['volumeInfo']['title'];
	   var authors =  data['items']['0']['volumeInfo']['authors']['0'];
	   var publishedDate = data['items']['0']['volumeInfo']['publishedDate'];
	   var pageCount = data['items']['0']['volumeInfo']['pageCount'];
	   if(title!=null && authors!=null){
		 $("#title").val(title);
		 $("#authors").val(authors);
		 $("#publishedDate").val(publishedDate);
		 $("#pageCount").val(pageCount);
		 $("#addBookButton").removeAttr("disabled");
	   }else{
		alert("Your book was not founded, please type proper ISBN code");
	   }
	  });
}
		
function addBookToDataBase(){

	var title = $("#title").val();
	var authors = $("#authors").val();
	var publishedDate = $("#publishedDate").val();
	var pageCount = $("#pageCount").val();
	var isbn = $('#isbn').val();
	var mobilenumber = $('#mobilenumber').val();
	var price = $('#price').val();
		 
	var rootRef = firebase.database().ref('users/'+ userInfo.id);
	var newCarRef = rootRef.child('books/'+isbn);
	newCarRef.set({
		title: title,
		authors: authors,
		published_date: publishedDate,
		page_count: pageCount,
		price: price,
		mobile_number: mobilenumber
	});
	alert("Your book was successfully added");
}

function addedBooks(){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/books');
	 starCountRef.on('value', function(snapshot) {
		$("ul[id=list]").empty();
		snapshot.forEach(function(childSnapshot) {
			var title = "<li>" + "Title: " + childSnapshot.val().title + "</li>";
			var authors = "<li>" + "Authors: " + childSnapshot.val().authors + "</li>";
			var pageCount = "<li>" + "Pages: " + childSnapshot.val().page_count + "</li>";
			var published_date = "<li>" + "Published date: " + childSnapshot.val().published_date + "</li>";
			var price = "<li style=\"color:#ff0000;\">" + "Price: " + childSnapshot.val().price + "</li>";
			var mobile_number = "<li>" + "Mobile number: " + childSnapshot.val().mobile_number + "</li>";
			var isbn = Object.keys(snapshot.val())[0];
			var delete_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"deleteBook(" + isbn + ")\"" + ">DELETE BOOK</button></li>";
			$("#list").append(title);
			$("#list").append(authors);
			$("#list").append(pageCount);
			$("#list").append(published_date);
			$("#list").append(price);
			$("#list").append(mobile_number);
			$("#list").append(delete_button);
			console.log(Object.keys(snapshot.val())[0]);
			console.log(childSnapshot.val());
		});
	});
	
	$.mobile.changePage("#addedBooks");
	
}

function deleteBook(isbn){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/books/' + isbn);
	starCountRef.remove();
}


function searchBookOnTheList(){
	 var starCountRef = firebase.database().ref('users');
	 var bookSearchName = $("#searchBookName").val();
	 starCountRef.on('value', function(snapshot) {
		var lengthOfTable = 0;
		$("ul[id=list1]").empty();
		snapshot.forEach(function(childSnapshot) {
			if(childSnapshot.val().books!=null){
				if((bookSearchName == Object.values(childSnapshot.val().books)[0].title) && (userInfo.id!=childSnapshot.key)){
					var user_name = "<li>" + "Name: " + childSnapshot.val().username + "</li>";
					var user_email = "<li>" + "Email: " + childSnapshot.val().email + "</li>";
					var mobile_number = "<li>" + "Mobile number: " + Object.values(childSnapshot.val().books)[0].mobile_number + "</li>";
					
					var title = "<li>" + "Title: " + Object.values(childSnapshot.val().books)[0].title + "</li>";
					var authors = "<li>" + "Authors: " + Object.values(childSnapshot.val().books)[0].authors + "</li>";
					var page_count = "<li>" + "Pages: " + Object.values(childSnapshot.val().books)[0].page_count + "</li>";
					var published_date = "<li>" + "Published date: " + Object.values(childSnapshot.val().books)[0].published_date + "</li>";
					var price = "<li style=\"color:#ff0000;\">" + "Price: " + Object.values(childSnapshot.val().books)[0].price + "</li>";
					var isbn = "11";
					var buy_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"buyBook(" + isbn + ")\"" + ">BUY BOOK</button></li>";
					var add_friend_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"addToFriend(" + "'"+childSnapshot.key+"'" + ")\"" + ">ADD TO FRIEND</button></li>";
					$("#list1").append(user_name);
					$("#list1").append(user_email);
					$("#list1").append(mobile_number);
					$("#list1").append(title);
					$("#list1").append(authors);
					$("#list1").append(page_count);
					$("#list1").append(published_date);
					$("#list1").append(price);
					$("#list1").append(buy_button);
					$("#list1").append(add_friend_button);
				}
			}
			lengthOfTable++;
		});
	});
	
	/*$.get( "https://booksearch-79aa4.firebaseio.com/users.json", function( data ) {
		
	});*/

		
}

function buyBook(isbn){
	alert(isbn+"kupiona");
}

function addToFriend(friendID){
	var user_name;
	var user_email;
	var photoURL;
	var userid = firebase.database().ref('users/' + friendID);
	userid.once("value").then(function(snapshot) {
		var user = snapshot.val();
		user_name = user.username;
		user_email = user.email;
		photoURL = user.photo_url;
	});
	
	setTimeout(function(){
		var rootRef = firebase.database().ref('users/' + userInfo.id);
		var newCarRef = rootRef.child('friends/' + friendID).set({
			username: user_name,
			email: user_email,
			photo_url: photoURL
		});
	});
}

function showFriends(){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/friends');
	 starCountRef.on('value', function(snapshot) {
		$("ul[id=list2]").empty();
		snapshot.forEach(function(childSnapshot) {
			
			var friend_photo = "<li style='float:left;'>" + "<img src='" + childSnapshot.val().photo_url + "' width='100' height='100' </img>" + "</li>";
			var friend_name = "<li>" + "Name: " + childSnapshot.val().username + "</li>";
			var friend_email = "<li>" + "Email: " + childSnapshot.val().email + "</li>";
			

			var friend_id = childSnapshot.key;
			var delete_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"deleteFriend(" + "'" + friend_id + "'" + ")\"" + ">DELETE FRIEND</button></li>";
			$("#list2").append(friend_photo);
			$("#list2").append(friend_name);
			$("#list2").append(friend_email);
			$("#list2").append(delete_button);
			//console.log(Object.keys(snapshot.val())[0]);
			//console.log(childSnapshot.val());
		});
	});
	
	$.mobile.changePage("#showFriends");
}

function deleteFriend(friend_id){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/friends/' + friend_id);
	starCountRef.remove();
}
function logOut(){
	firebase.auth().signOut();
	alert("LOGGED OUT");
	$.mobile.changePage("#signInPage");
}
function currentUser(){
	var user = firebase.auth().currentUser;
	if (user) {
		alert(user.displayName);
		alert(user.uid);
		alert(user.photoURL);
	} else {
	  alert("noone");
	}
}

	
