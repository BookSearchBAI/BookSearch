var user = window.localStorage.getItem("login");
var dbhandle = firebase.database().ref('users/');

dbhandle.on("value", function(snapshot) {

snapshot.forEach(function(data){
  if(data.val()['email']==user)
  {
    document.getElementById('propic').src = data.val()['photo_url'];
  }
});

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function add()
{
  document.getElementById("addbookform").style.visibility = 'visible';
}

function loadb()
{
  var isbn = document.getElementById('isbn').value;
  $.getJSON( "https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn, function (data) {
    document.getElementById('title').innerHTML = data['items']['0']['volumeInfo']['title'];
   document.getElementById('authors').innerHTML =  data['items']['0']['volumeInfo']['authors']['0'];
  });
}

function adder()
{
  var isbn2 = document.getElementById('isbn').value;
  var user2 = window.localStorage.getItem("login");
  var bookhandle = firebase.database().ref('books/');
  bookhandle.push({
    isbn: isbn2,
    poster: user
  });
}
