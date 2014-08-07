var chat = new Firebase('http://roomchat.firebaseio.com');
var userName = '';
var latlong, room, users, posts, addPost, pos, rooms, userID, usersPush;
var $newPost = $('#send');
$(document).ready(function() {
	$('#submitName').click(function(e) {
		e.preventDefault();
		userName = $('[name=title]').val();
		$('#namePlaceholder').text(userName);
		$('#tag').css('display','none');
		$('#welcome').css('display','block');
		$('#initiate').css('display','block');
		
		
	    usersPush = users.push();
	    usersPush.set(userName);
	    usersPush.onDisconnect().remove();
	    
	    users.on('child_added', addUser);
    
        users.on('child_removed', removeUser);
        
        posts.endAt().limit(1).on('child_added', newPost);
	});
	$('#initiate').click(function(e) {
		e.preventDefault();
		$('#initiate').css('display','none');
		$('#welcome').css('display','none');
		$('#chatBox').css('display','block');
		$('#participants').css('display','block');
		$('#participants').append("<div class='self'>" + userName + "</div>");
	});
	$('#send').click(function(e) {
		e.preventDefault();
		newMessage = $('#newMessage').val();
		$('#chat').prepend("<div class='own " + userName + "'>" + userName + ': ' + newMessage+"</div>");
		$('#newMessage').val('');
		$('#chat').scroll();
		posts.push(JSON.parse('{"' + userName + '":"' + newMessage + '"}'));
	});
});


var position = function (p) {
    var positions = JSON.stringify(p);
    positions = JSON.parse(positions);
	var long = String(positions.coords.longitude).slice(0,2);
	var lat = String(positions.coords.latitude).slice(0,2);
    //(lat + ' ' + long);

	latlong = (lat.toString() + long.toString()).replace(/-/g, 'n').replace(/\./g, 'p');
	rooms = chat.child('rooms/' + latlong);
	users = rooms.child('users');
	posts = rooms.child('posts');
};

navigator.geolocation.getCurrentPosition(position, null, { enableHighAccuracy: true });

function addUser(data) {
    console.log('user added');
    var names = data.name();
    var value = data.val();
    if (value !== userName)  { //don't add the current user twice
        $('#participants').append("<div class='user " + value + "'>" + value + "</div>");
    }
}

function removeUser(data) {
    console.log('user removed')
    $('.' + data.val()).remove();
}

function newPost(data) {
    console.log('new post');
    data = data.val();
    var u, post;
    for (d in data) {
        u = d;
        post = data[d];
    }
    console.log('u: ' + u + ' post: ' + post );
    addPost(u, post);
}

addPost = function (user, post) {
	if (user !== userName) {
	    $('#chat').prepend("<div class='user " + user + "'>" + user + ': ' + post + "</div>");
	}
};

$('#send').on('click', function sumbitPost (e) {
    e.preventDefault();
    var postsList = posts.push();
    var nPost = $newPost.val();
    $newPost.val('');
    postsList.set({ 'user': user, 'post': nPost });
});