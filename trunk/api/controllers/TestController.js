/**
 * Reference use only
 * The best place to handle socket event is config/sockets.js
 * Created by teng on 19.11.2014.
 */

module.exports = {

  /**
   *
   * Using raw socket.io functionality from a Sails.js controller
   *
   */

  index: function (req,res) {

    var socket = req.socket;
    var io = sails.io;

    // emit to all sockets (aka publish)
    // including yourself
    io.sockets.emit('messageName', {thisIs: 'theMessage'});

    // broadcast to a room (aka publish)
    // excluding yourself, if you're in it
    socket.broadcast.to('roomName').emit('messageName', {thisIs: 'theMessage'});

    // emit to a room (aka publish)
    // including yourself
    io.sockets.in('roomName').emit('messageName', {thisIs: 'theMessage'});

    // Join a room (aka subscribe)
    // If you're in the room already, no problem, do nothing
    // If the room doesn't exist yet, it gets created
    socket.join('roomName');

    // Leave a room (aka unsubscribe)
    // If you're not in the room, no problem, do nothing
    // If the room doesn't exist yet, no problem, do nothing
    socket.leave('roomName');

    // Get all connected sockets in the app
    sails.io.sockets.clients();

    // Get all conneted sockets in the room, "roomName"
    sails.io.sockets.clients('roomName');


  }

};
