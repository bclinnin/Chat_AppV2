module.exports = function(app,io){

var userList = [];
var socketClients = [];
var userCount = 1;

var adjectives = ['Bedazzled','Cute','Distressed','Funny','Depressing'];
var animals = ['Panda','Antelope','Cockatiel','Puppy','Tiger','Orangutan','Dolphin','Zebra','Beaver','Kitty','Conure','Parakeet','Narwhal','Beluga','Crocodile','Sea Cucumber','Woodpecker'];

io.on('connection', function(socket){

  //~~~~~~~~~~~~~~~~~~
  //user connect logic
  //~~~~~~~~~~~~~~~~~~
  socketClients.push(socket);
  var seed_adj = Math.random() * 1000;
  var user_adj_idx = (Math.floor(seed_adj)%(adjectives.length));

  var seed_noun = Math.random() * 777;
  var user_noun_idx = (Math.floor(seed_noun)%(animals.length));
  var user_name = adjectives[user_adj_idx] + ' ' + animals[user_noun_idx];
  //add user to userList hash map
  userList.push({id:socket.id,name:user_name});
  io.emit('userConnected',user_name + ' has connected. Users connected: '+socketClients.length);
  //~~~~~~~~~~~~~~~~~~~~~~~
  // user disconnect logic
  //~~~~~~~~~~~~~~~~~~~~~~~
  socket.on('disconnect', function(){
    var d = new Date();
    // var datetext = d.toTimeString().split(' ')[0];
    var disconnectedUser = find_user(socket.id);
    for(var index in socketClients){
      if(socketClients[index].id == socket.id){
        socketClients.splice(index, 1);
        break;
      }
    }
    var return_array = [socket.id,find_user(socket.id)];
    io.emit('stopTyping', return_array);
    io.emit('userDisconnect', disconnectedUser + ' has disconnected. Users still connected: '+socketClients.length);
  });
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // msg - holds the message sent from the connected socket
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  socket.on('chatData', function(msg){
    //generate timestamp as 'hhmmss'
    var d = new Date();
    //var datetext = d.toTimeString().split(' ')[0];
    //loop through all of the users currently connected to the server
    var returnName = find_user(socket.id);
    var return_array = [d,returnName,msg];
    io.emit('chatData',return_array);  
  });
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // logic for 'user is typing'
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  socket.on('startTyping', function(msg){
    var return_array = [socket.id,find_user(socket.id)];
    io.emit('startTyping', return_array);
  });
  socket.on('stopTyping', function(msg){
    var return_array = [socket.id,find_user(socket.id)];
    io.emit('stopTyping', return_array );
  });

});

function find_user(socketID){
  for (var key in userList){
    //match sent in ID to hash map's ID
    if(userList[key].id == socketID){
      //pull out user's name
      return userList[key].name;
    }
  }
  return 'UnknownUser';
}

}//end of module
