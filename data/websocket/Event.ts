import { addFriend, receiveRequest, removedByFriend } from "../state/friendsSlice";
import { MessageType, openedByFriend, receiveMessage } from "../state/messagesSlice";
import { store } from "../state/store";

export type Event = {
  type: string,
  payload: any,
}

export const createConnection = (otp: string, username: string): WebSocket => {
  const conn = new WebSocket(`ws://localhost:8080/v1/ws/${otp}.${username}`);
  conn.onmessage = function(e: MessageEvent<string>) {
    const event: Event = JSON.parse(e.data);
    routeEvent(event);
  }

  return conn;
}

export const routeEvent = (event: Event) => {
  switch (event.type) {
    case "new_message":
      const message: MessageType = {
        id: event.payload.id,
        content: event.payload.message,
        friendname: event.payload.sender,
        role: "recipient",
        time: event.payload.time,
        opened: false,
      }
      console.log("received new message");
      store.dispatch(receiveMessage(message));
      break;
    case "opened_message":
      console.log("recipient opened sent messages");
      store.dispatch(openedByFriend(event.payload.eventSender));
      break;
    case "new_request":
      console.log("received new request");
      store.dispatch(receiveRequest(event.payload.eventSender));
      break;
    case "add_friend":
      console.log("friend request accepted");
      store.dispatch(addFriend(event.payload.eventSender));
      break;
    case "removed_friend":
      store.dispatch(removedByFriend(event.payload.eventSender));
      break;
    default: 
      alert("unsupported message type");
      break;
  }
}

export const sendEvent = (type: string, payload: any, conn: WebSocket) => {
  const event: Event = { type, payload };
  conn.send(JSON.stringify(event));
}

