/*CMD
  command: @
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

function handleJoinRequest(req) {
  // Return if request is empty
  if (!req) return;

  // Parse request if it's a JSON string
  if (typeof req === "string") {
    try {
      req = JSON.parse(req);
    } catch {
      return;
    }
  }

  const joinRequest = req.chat_join_request;
  if (!joinRequest || !joinRequest.from || !joinRequest.chat) return;

  const user = joinRequest.from;
  const chat = joinRequest.chat;

  const userId = user.id;
  const chatId = chat.id;
  const firstName = user.first_name || "User";
  const userLink = `<a href="tg://user?id=${userId}">${firstName}</a>`;

  // Approve the join request
  Api.approveChatJoinRequest({
    chat_id: chatId,
    user_id: userId
  });

  // Send welcome message to group or user's DM
  if (chat.type === "group" || chat.type === "supergroup") {
    Api.sendMessage({
      chat_id: chatId,
      text: `🎉 Welcome ${userLink} to the group!`,
      parse_mode: "HTML"
    });
  } else {
    Api.sendMessage({
      chat_id: userId,
      text: "🎉 Your request to join the channel has been approved. Welcome!"
    });
  }
}

