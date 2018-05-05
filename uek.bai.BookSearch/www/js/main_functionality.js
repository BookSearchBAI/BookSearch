
	
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
			 $("#lista").append("<ul id='list' data-role='listview' data-inset='true'></ul>");
		
			 starCountRef.on('value', function(snapshot) {
				$("ul[id=list]").empty();
			 	snapshot.forEach(function(childSnapshot) {
					var title = "<li>" + childSnapshot.val().title + "</li>";
					var authors = "<li>" + childSnapshot.val().authors + "</li>";
					var pageCount = "<li>" + childSnapshot.val().page_count + "</li>";
					var published_date = "<li>" + childSnapshot.val().published_date + "</li>";
					var price = "<li>" + childSnapshot.val().price + "</li>";
					var mobile_number = "<li>" + childSnapshot.val().mobile_number + "</li>";
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
		
	
