

const chatBubble = (message: string, currentUser: boolean) => {
    return (
        <div className={currentUser ? "chat-bubble current-user" : "chat-bubble"}>
            <p>{message}</p>
        </div>
    )
}