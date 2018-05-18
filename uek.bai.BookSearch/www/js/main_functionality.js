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
	var geoloc = $('#coords').val();

	/*var starCountRef = firebase.database().ref('users');
	var result = false;
	 starCountRef.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			if(childSnapshot.val().books!=null){
				var i = Object.keys(childSnapshot.val().books).length;;
				console.log("length: " + i);
				for(var j = 0; j<i; j++){
					if(isbn == Object.keys(childSnapshot.val().books)[j]){//проходится только по одной книге фіксіть надо
						result=true;
						console.log(result);
					}
				}
			}
		});
	});*/

	setTimeout(function(){
		//console.log("setout");
		//if(!result){
			var rootRef = firebase.database().ref('users/'+ userInfo.id);
			var newCarRef = rootRef.child('books/'+isbn);
			newCarRef.set({
				title: title,
				authors: authors,
				published_date: publishedDate,
				page_count: pageCount,
				price: price,
				mobile_number: mobilenumber,
				book_status: "true",
				location_ccords: geoloc
			});
			alert("Your book successfully added");
			$.mobile.changePage("#mainMenu");
		//}else{
			//alert("The book already exist in database");
		//}
	},1500);
}

function addedBooks(){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/books');
	 starCountRef.on('value', function(snapshot) {
		$("ul[id=list]").empty();
		//alert("number of childs:" + snapshot.numChildren());
		var childCount =0;
		snapshot.forEach(function(childSnapshot) {

			var title = "<li>" + "Title: " + childSnapshot.val().title + "</li>";
			var authors = "<li>" + "Authors: " + childSnapshot.val().authors + "</li>";
			var pageCount = "<li>" + "Pages: " + childSnapshot.val().page_count + "</li>";
			var published_date = "<li>" + "Published date: " + childSnapshot.val().published_date + "</li>";
			var price = "<li style=\"color:#ff0000;\">" + "Price: " + childSnapshot.val().price + "</li>";
			var mobile_number = "<li>" + "Mobile number: " + childSnapshot.val().mobile_number + "</li>";
			var isbn;
			if(childCount <  snapshot.numChildren()){
				isbn = Object.keys(snapshot.val())[childCount];
				childCount++;
			}

			var delete_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"deleteBook(" + isbn + ")\"" + ">DELETE BOOK</button></li>";
			$("#list").append(title);
			$("#list").append(authors);
			$("#list").append(pageCount);
			$("#list").append(published_date);
			$("#list").append(price);
			$("#list").append(mobile_number);

			var book_status = childSnapshot.val().book_status;
			if(book_status == "false"){
				var delete_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"deleteBook(" + isbn + ")\" disabled" + ">DELETE BOOK</button></li>";
				//var confirm_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"confirmTransaction(" + isbn + ")\"" + ">CONFIRM TRANSACTION</button></li>";
				$("#list").append(delete_button);
				//$("#list").append(confirm_button);

				var starCountRef1 = firebase.database().ref('users');
				 starCountRef1.on('value', function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						console.log(childSnapshot.val());
						if(childSnapshot.val().bookedbooks!=null){
							var i = Object.keys(childSnapshot.val().bookedbooks).length;
							console.log(isbn + " " + Object.keys(childSnapshot.val().bookedbooks).length);
							for(var j = 0; j<i; j++){
								if((isbn == Object.keys(childSnapshot.val().bookedbooks)[j]) && (userInfo.id!=childSnapshot.key)){
									var confirm_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"confirmTransaction(" + isbn + ")\"" + ">CONFIRM TRANSACTION</button></li>";
									$("#list").append(confirm_button);
									var cancel_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"cancelTransaction(" + isbn + "," + "'"+childSnapshot.key+"'" + ")\"" + ">CANCEL TRANSACTION</button></li>";
									$("#list").append(cancel_button);
								}
							}
						}
					});
				 });
			}else{
				$("#list").append(delete_button);
			}
		});
	});
	$.mobile.changePage("#addedBooks");
}

function deleteBook(isbn){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/books/' + isbn);
	starCountRef.remove();
}

function confirmTransaction(isbn){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/books/' + isbn);
	starCountRef.update({
		book_status: "true"
	});
	starCountRef.remove();
	alert("Transakcja potwierdzona,ksiazka wendruje do kupujacej osoby");
	$.mobile.changePage("#mainMenu");
}

function cancelTransaction(isbn,friendID){
	var starCountRef1 = firebase.database().ref('users/' + friendID + '/bookedbooks/' + isbn);
	starCountRef1.remove();
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/books/' + isbn).update({
		book_status: "true"
	}).then(function(){
		alert("Transakcja odrzucona,ksiazka jest ponownie dostepna dla innych osob");
		$.mobile.changePage("#mainMenu");
	});

}


function searchBookOnTheList(){
	 var starCountRef = firebase.database().ref('users');
	 var bookSearchName = $("#searchBookName").val();
	 starCountRef.on('value', function(snapshot) {
		var lengthOfTable = 0;
		$("ul[id=list1]").empty();
		snapshot.forEach(function(childSnapshot) {

			if(childSnapshot.val().books!=null){
				var i = Object.keys(childSnapshot.val().books).length;

				for(var j = 0; j<i; j++){
					//alert(Object.values(childSnapshot.val().books)[j]);
					if((bookSearchName == Object.values(childSnapshot.val().books)[j].title) && (userInfo.id!=childSnapshot.key)){
						var user_name = "<li>" + "Name: " + childSnapshot.val().username + "</li>";
						var user_email = "<li>" + "Email: " + childSnapshot.val().email + "</li>";
						var mobile_number = "<li>" + "Mobile number: " + Object.values(childSnapshot.val().books)[j].mobile_number + "</li>";

						var title = "<li>" + "Title: " + Object.values(childSnapshot.val().books)[j].title + "</li>";
						var authors = "<li>" + "Authors: " + Object.values(childSnapshot.val().books)[j].authors + "</li>";
						var page_count = "<li>" + "Pages: " + Object.values(childSnapshot.val().books)[j].page_count + "</li>";
						var published_date = "<li>" + "Published date: " + Object.values(childSnapshot.val().books)[j].published_date + "</li>";
						var isbn2 = "<li>" + "ISBN: " + Object.keys(childSnapshot.val().books)[j] + "</li>";
						var price = "<li style=\"color:#ff0000;\">" + "Price: " + Object.values(childSnapshot.val().books)[j].price + "</li>";

						var coords = Object.values(childSnapshot.val().books)[j].location_ccords;
						var book_map = "<div class=\"bookmap\" id=\""+ Object.values(childSnapshot.val().books)[j].price + "MAP" +"\">";
						var status_of_book = Object.values(childSnapshot.val().books)[j].book_status;
						var book_button;
						//alert(Object.keys(childSnapshot.val().books)[j] + " in search book + wlascieciel ksiazki: " + childSnapshot.key);
						if(status_of_book=="true"){
							book_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"bookTheBook(" + "'" + Object.keys(childSnapshot.val().books)[j] + "'" +"," + "'"+childSnapshot.key+"'" + ")\"" + ">BOOK IT</button></li>";
						}else{
							book_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"bookTheBook(" + "'" + Object.keys(childSnapshot.val().books)[j] + "'" +"," + "'"+childSnapshot.key+"'" + ")\" disabled" + ">BOOK IT</button></li>";
						}
						var add_friend_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"addToFriend(" + "'"+childSnapshot.key+"'" + ")\"" + ">ADD TO FRIEND</button></li>";
						$("#list1").append(user_name);
						$("#list1").append(user_email);
						$("#list1").append(mobile_number);
						$("#list1").append(title);
						$("#list1").append(authors);
						$("#list1").append(page_count);
						$("#list1").append(published_date);
						$("#list1").append(isbn2);
						$("#list1").append(price);

						$("#list1").append(book_map);
						var bmap = L.map(Object.values(childSnapshot.val().books)[j].price + "MAP").setView([coords.split(" ")[0], coords.split(" ")[1]], 13);
						L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
						attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
						maxZoom: 18,
						id: 'mapbox.streets',
						accessToken: 'pk.eyJ1Ijoia29rYTk1IiwiYSI6ImNqZ3pxcXFsaTJxbzQzM3F3MDBhYXhvY2YifQ.1BZrM4aZkhZuJgYBt1F-Ag'
						}).addTo(bmap);
						var marker = L.marker([coords.split(" ")[0], coords.split(" ")[1]], {icon: stdmarker}).addTo(bmap);
						$("#list1").append(book_button);
						$("#list1").append(add_friend_button);
					}


				}
			}
			lengthOfTable++;
		});
	});

	/*$.get( "https://booksearch-79aa4.firebaseio.com/users.json", function( data ) {

	});*/


}

function bookTheBook(isbn,ownerID){

	var owner_name;
	var owner_email;
	var owner_mobile;
	var owner_id;
	var book_title;
	var book_authors;
	var book_page_count;
	var book_price;
	var book_published_date;

	var ownerid = firebase.database().ref('users/' + ownerID);
	ownerid.once("value").then(function(snapshot) {
		var owner = snapshot.val();
		owner_name = owner.username;
		owner_email = owner.email;
		owner_id = snapshot.key
	});

	var bookid = firebase.database().ref('users/' + ownerID + '/books/' + isbn);
	bookid.once("value").then(function(snapshot) {
		bookid.update({
			  book_status: "false"
		}).then(function() {
			var ownersbook = snapshot.val();
			owner_mobile = ownersbook.mobile_number;
			book_title = ownersbook.title;
			book_authors = ownersbook.authors;
			book_page_count = ownersbook.page_count;
			book_price = ownersbook.price;
			book_published_date = ownersbook.published_date;
		});
	});

	setTimeout(function(){
		var rootRef = firebase.database().ref('users/' + userInfo.id);
		var newCarRef = rootRef.child('bookedbooks/' + isbn).set({
			owner_name: owner_name,
			owner_email: owner_email,
			owner_mobile: owner_mobile,
			owner_id: owner_id,
			title: book_title,
			authors:book_authors,
			page_count: book_page_count,
			price: book_price,
			published_date: book_published_date
		});
	},1000);

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
	},200);

	alert("Friend was successfully added");
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

function bookedBooks(){
	var starCountRef = firebase.database().ref('users/' + userInfo.id);
	 starCountRef.on('value', function(snapshot) {
		$("ul[id=list3]").empty();
		//var i = Object.keys(snapshot.val().bookedbooks).length;
			if(Object.values(snapshot.val().bookedbooks)!=null){
				var i = Object.keys(snapshot.val().bookedbooks).length;
				for(var j = 0; j<i; j++){
					var owner_name = "<li>" + "Owner name: " + Object.values(snapshot.val().bookedbooks)[j].owner_name + "</li>";
					var owner_email = "<li>" + "Owner email: " + Object.values(snapshot.val().bookedbooks)[j].owner_email + "</li>";
					var owner_mobile_number = "<li>" + "Owner mobile number: " + Object.values(snapshot.val().bookedbooks)[j].owner_mobile + "</li>";
					var title = "<li>" + "Title: " + Object.values(snapshot.val().bookedbooks)[j].title + "</li>";
					var authors = "<li>" + "Authors: " + Object.values(snapshot.val().bookedbooks)[j].authors + "</li>";
					var pageCount = "<li>" + "Pages: " + Object.values(snapshot.val().bookedbooks)[j].page_count + "</li>";
					var published_date = "<li>" + "Published date: " + Object.values(snapshot.val().bookedbooks)[j].published_date + "</li>";
					var price = "<li style=\"color:#ff0000;\">" + "Price: " + Object.values(snapshot.val().bookedbooks)[j].price + "</li>";
					//var isbn = Object.keys(snapshot.val())[0];
					//var isbn = Object.keys(snapshot.val().bookedbook)[j];

					//var delete_button = "<li><button class=\"ui-btn ui-corner-all\" onclick=\"deleteBookedBook(" + isbn + ")\"" + ">DELETE BOOKED BOOK</button></li>";
					$("#list3").append(owner_name);
					$("#list3").append(owner_email);
					$("#list3").append(owner_mobile_number);
					$("#list3").append(title);
					$("#list3").append(authors);
					$("#list3").append(pageCount);
					$("#list3").append(published_date);
					$("#list3").append(price);
					//$("#list3").append(delete_button);
				}
			}
		});


	$.mobile.changePage("#bookedBooks");

}

function deleteBookedBook(booked_book_id){
	var starCountRef = firebase.database().ref('users/' + userInfo.id + '/bookedbooks/' + booked_book_id);
	starCountRef.remove();
}

function drawChart(){

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');
      data.addColumn('number', 'Users');
	  var usersCount = 0;
		var starCountRef1 = firebase.database().ref('users');
		 starCountRef1.on('value', function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				usersCount++;
			});
		});
		setTimeout(function(){
		  var date = new Date();

		  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		  var tempdate = date.getFullYear() + " " + months[date.getMonth()] + " " + date.getDate();


		  data.addRows([
			[tempdate, usersCount]
		  ]);

      var options = {
        hAxis: {
          title: 'Date'
        },
        vAxis: {
          title: 'Users'
        },
        backgroundColor: '#f1f8e9',
		legend: {position: 'none'}
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
	  $.mobile.changePage("#showChart");
		},900);

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

var stdmarker = L.icon({
    iconUrl: 'img/marker-icon.png',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


function geofetch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    $("#coords").val(position.coords.latitude + " " + position.coords.longitude);
}

function geomanual() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolock failed");
    }
	function showPosition(position) {
    var mymap = L.map('mapid').setView([position.coords.latitude, position.coords.longitude], 13);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoia29rYTk1IiwiYSI6ImNqZ3pxcXFsaTJxbzQzM3F3MDBhYXhvY2YifQ.1BZrM4aZkhZuJgYBt1F-Ag'
}).addTo(mymap);
mymap.on('click', function(e) {
    $("#coords").val(e.latlng.lat + " " + e.latlng.lng);
});
}
}

function lookupsetup()
{
	location.href = "#mapLookup";
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolock failed");
    }

	function showPosition(position)
	{
		var lmap = L.map('lookmap').setView([position.coords.latitude, position.coords.longitude], 13);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1Ijoia29rYTk1IiwiYSI6ImNqZ3pxcXFsaTJxbzQzM3F3MDBhYXhvY2YifQ.1BZrM4aZkhZuJgYBt1F-Ag'
		}).addTo(lmap);
		var starCountRef = firebase.database().ref('users');
	 var bookSearchName = $("#searchBookName").val();
	 starCountRef.on('value', function(snapshot) {
		var lengthOfTable = 0;
		//$("ul[id=list1]").empty();
		snapshot.forEach(function(childSnapshot) {
			if(childSnapshot.val().books!=null){
				if(userInfo.id!=childSnapshot.key){
					var i = Object.keys(childSnapshot.val().books).length;
					for(var j = 0; j<i; j++){
						
						var coords = Object.values(childSnapshot.val().books)[j].location_ccords;
						var price = Object.values(childSnapshot.val().books)[j].price;
						var isbn = isbn = Object.keys(snapshot.val())[j];
						var owner = childSnapshot.key;
						var title = "<li>" + "Title: " + Object.values(childSnapshot.val().books)[j].title + "<br>" + "Price:" + price  + "</li><br><button class=\"ui-btn ui-corner-all\" onclick=\"bookTheBook(" + "'" + isbn + "'" +"," + "'"+owner+"'" + ")\"" + ">BOOK IT</button></li>";
						if(typeof coords != 'undefined'){
							var mkr = L.marker([coords.split(" ")[0], coords.split(" ")[1]], {icon: stdmarker}).addTo(lmap);
							mkr.bindPopup(title);
						}
					}
				}
			}
			lengthOfTable++;
		});
	});
	}
}




function goToAddBook(){
	$.mobile.changePage("#addBook");
}

function goToSearchBook(){
	$.mobile.changePage("#searchBook");
}
