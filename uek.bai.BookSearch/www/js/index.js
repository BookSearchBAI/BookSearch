/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


function login()
{
  document.getElementById('start').style.visibility = 'hidden';
  document.getElementById('login_p').style.visibility = 'visible';
}
function create()
{
  document.getElementById('start').style.visibility = 'hidden';
  document.getElementById('create_p').style.visibility = 'visible';
}
function account_setup()
{
  var username = document.getElementById("t_create").value;
  var password = document.getElementById("t_passw").value;
  var passauth  = document.getElementById("t_pass2").value;
  var email = document.getElementById("t_email").value;
  var avatar =document.getElementById("t_avatar").value;
  if(password!=passauth)
  {
    document.getElementById("deviceDetails").innerHTML = "Hasła się nie zgadzają";
  }
  else {
    firebase.database().ref('users/' + username).set({
  password: password,
  email: email,
  photo_url: avatar
});

  }
}

document.addEventListener("deviceready",app.onDeviceReady, false);
document.getElementById('login').addEventListener("click", login);
document.getElementById('create').addEventListener("click", create);
document.getElementById('b_pass').addEventListener("click",account_setup);

document.getElementById('login_p').style.visibility = 'hidden';
document.getElementById('create_p').style.visibility = 'hidden';
app.initialize();
