const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    
    socket.on("joinRoom", (room) => {
      socket.join(room);
      
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, property, text } = data;

        // Save to DB
        const message = await Message.create({
          sender,
          receiver,
          property,
          text,
        });

        // Send realtime
        const room = `${sender}_${receiver}_${property}`;
        io.to(room).emit("receiveMessage", message);

      } catch (error) {
        
      }
    });

    socket.on("disconnect", () => {
      
    });
  });
};
