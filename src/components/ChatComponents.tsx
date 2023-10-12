

const chatBubble = (message: string, currentUser: boolean) => {
    if(currentUser) {
        return (
            <div className="chat chat-end">
              <div className="chat-bubble">{message}</div>
            </div>
        )
    }
    return (
        <div className="chat chat-start">
          <div className="chat-bubble">{message}</div>
        </div>
    )
}