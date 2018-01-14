//Globals
var socket;
var sessionID;
var message_body;
var typingTimeout = 0;
var knownUsers = [];
var iAmTyping = false;
var myTypingTimeout = undefined;
var x;
$(document).ready ( function(){
    //initializations
    console.log('javascript has been initialized');
    socket = io({'forceNew': true});
    sessionID = socket.id;
    //entered page, send session token to server
    //message_body = [1,sessionID,' '];
    //socket.emit('chat data',message_body);

    socket.on('userConnected', function(msg){
        $('#messages').append($('<li>').html('<i>'+msg+'</i>'));
        $('#messages').animate({scrollTop: $(document).height() + $('#messages').height()});        
    });

    //handle the event for a user disconnecting from the server
    socket.on('userDisconnect', function(msg){
        //say that user has disconnected and move the chat window down
        $('#messages').append($('<li>').html('<i>'+msg+'</i>'));
        $('#messages').animate({scrollTop: $(document).height() + $('#messages').height()});

    });

    //handle a standard chat message
    socket.on('chatData', function(msg){
        //message return structure
        // index 0 - time stamp from server
        // index 1 - user's name assigned by server
        // index 2 - message to be added to chat room
        var date = new Date(msg[0]);
        var display_time = date.toLocaleString([], {hour: '2-digit', minute:'2-digit'});
        var user_info = display_time + '  ' + '<strong>' + msg[1] + ': </strong> '; 
        var message_from_server = msg[2];
        var x = new EmbedJS({
            input: message_from_server,
        });
        x.text(function(data){
            $('#messages').append($('<li>').html(user_info + data));
            $('#messages').animate({scrollTop: $(document).height() + $('#messages').height()});    
        });
        //potato
        //x.render();
    });

    //keypress callback for when user is typing
    $('#m').keypress(function(){
        if(iAmTyping == false){
            iAmTyping = true;
            socket.emit('startTyping');
            myTypingTimeout = setTimeout(doneTyping, 1000);
        }
        else{
            clearTimeout(myTypingTimeout);
            myTypingTimeout = setTimeout(doneTyping, 1000);
        }
    });
    function doneTyping(){
        iAmTyping = false;
        socket.emit('stopTyping');
    }


    //handle a server emitted message, saying who in the room is typing
    // msg is holding an array ['socketid','username']
    socket.on('startTyping', function(msg){
        var foundUser = false;
        //see if client already knows about this user

        for(var key in knownUsers){
            //if this is a known user, adjust their typing boolean
            if(knownUsers[key].socketid == msg[0]){
                if(knownUsers[key].typingStatus == false){
                    knownUsers[key].typingStatus = true;
                    pushTypingToScreen(knownUsers[key].socketid, knownUsers[key].username);
                }
                foundUser = true;
                break;
            }
        }
        if(!foundUser){
            var socketid = msg[0];
            var username = msg[1];
            addUserToDictionary(socketid, username, true);
            pushTypingToScreen(socketid,username);
        }
    });

    //msg is holding an array ['socketid', 'username']
    socket.on('stopTyping', function(msg){
        var foundUser = false;
        for(var key in knownUsers){
            //if this is a known user, adjust their typing boolean
            if(knownUsers[key].socketid == msg[0]){
                if(knownUsers[key].typingStatus == true){
                    knownUsers[key].typingStatus = false;
                    pullTypingFromScreen(knownUsers[key].socketid, knownUsers[key].username);
                }
                foundUser = true;
                break;
            }
        }
        if(!foundUser){
            var socketid = msg[0];
            var username = msg[1];
            addUserToDictionary(socketid, username, false);
        }

    });

    $('form').submit(function(){
        //message_body = [2,sessionID,$('#m').val()];
        //don't send if message is blank
        if (! $('#m').val() == ''){
            socket.emit('chatData', $('#m').val());    
        }
        
        $('#m').val('');
        return false;
    });
    $('#m').focusin(function(){
        if($(this).val() == 'Type Message Here'){
            $(this).val('');
        } 
    });
    $('#m').focusout(function(){
        var str = $(this).val();
        // string only contained whitespace (ie. spaces, tabs or line breaks)
        if (!str.replace(/\s/g, '').length) {
            $(this).val('Type Message Here');
        }
    });

    function addUserToDictionary(socketid, username, typingStatus){
        knownUsers.push({socketid:socketid, username:username, typingStatus:typingStatus});
    }

    function pushTypingToScreen(socketid, username){
        /*some logic here to push an element out to the screen saying someone is typing */
        var textToInsert = '<li id='+socketid+'>'+username+' is typing</li>';
        $('#userTyping').append(textToInsert);
    }
    function pullTypingFromScreen(socketid, username){
        //$('#TEST1').html("I tried to remove user: " + username+ ' with id: '+socketid);
        $('#userTyping li').filter('#'+socketid).remove();
    }

});




