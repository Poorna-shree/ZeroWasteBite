import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New socket connected:", socket.id);

    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        );

        console.log(`✅ User ${user?.fullName || userId} is now online`);
      } catch (error) {
        console.error("❌ Error setting user online:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false, socketId: null }
        );
        console.log("🔴 Socket disconnected:", socket.id);
      } catch (error) {
        console.error("❌ Error marking user offline:", error);
      }
    });


   
  });
};
