import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";



function Chat({ socket }) {
    const [currentMessage, setCurrentMessage] = useState(""); // State to hold the current message being composed
    const [messageList, setMessageList] = useState([]); // State to hold the list of messages in the chat
    const { room, username } = useParams();

    const sendMessage = async () => {
        // Check if the message is not empty
        if (currentMessage !== "") {
            // Create a message data object
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            // Send the message data to the server
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    // Listen for incoming messages from the socket and update the message list
    useEffect(() => {
        // Create a socket connection
        console.log('Socket connected:', socket);

        socket.off("receive_message");
        socket.on("receive_message", (data) => {
            if (data.author === username) return;
            setMessageList((list) => [...list, data]);
        });
    }, [room, username]);

    return (
        <div className='chat-window'>
            {/* Chat header */}
            <div className="chat-header">
                <p>Live Chat</p>
            </div>

            {/* Chat body */}
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return (
                            <div
                                className="message"
                                id={username === messageContent.author ? "you" : "other"}
                            >
                                <div>

                                    {/* Message content */}
                                    <div className="message-content">
                                        <p className="sent-message">{messageContent.message}</p>
                                    </div>

                                    {/* Message meta info (time and author) */}
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>

            {/* Chat footer */}
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault(); // Prevents the newline
                            sendMessage(); // Send the message when Enter is pressed
                        }
                    }}
                />

                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div >
    )
}

export default Chat
