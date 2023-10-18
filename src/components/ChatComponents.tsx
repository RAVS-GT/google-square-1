import { ReactElement, use, useEffect, useState } from "react"
import { set } from "zod"
import { api } from "~/utils/api"
import { uniqueId } from "./functions"


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
            {/* <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div> */}
          <div className="chat-bubble chat-bubble-accent">{message}</div>
        </div>
    )
}

export const Chat = ({employeeId}:{employeeId:string}) => {
    const employeeName="Anakin"
    const li=[]

    const sessionId=uniqueId().toString()

    //fill ai with 100 chatBubbles
    // for(let i=0;i<100;i++){
    //     li.push(chatBubble("I am an assistant bot. How can I help you?.", false))
    // }
    const sendMessage=api.schedule.sendMessageLlm.useMutation({onSuccess:(data)=>{sendBotMessage(data.answer)}})
    const sendUnMessage=api.schedule.sendUnAnsMessageLlm.useMutation()
    const [chatBubbles,setChatBubbles]=useState<ReactElement<any, any>[]>([chatBubble("I am an assistant bot. How can I help you?.", false)])
    const [message,setMessage]=useState<string>("")
    const [isBotTyping,setIsBotTyping]=useState<boolean>(false)
    const [isLoading,setIsLoading]=useState<boolean>(false)

    useEffect(() => {

        if(sendMessage.isSuccess && sendMessage.data.answer.toLowerCase().split(' ')[0].split('.')[0].toLowerCase()=='unanswerable'){
            console.log('running google search', )

            sendUnMessage.mutate({message:message, employeeId:employeeId, sessionId:sessionId})
        } else if(sendMessage.isSuccess){
            console.log('running knowledge base search')
            sendBotMessage(sendMessage.data.answer)
            // setIsBotTyping(false)
            // setChatBubbles([...chatBubbles,chatBubble(sendMessage.data.answer,false)])
        }
    }, [sendMessage.isSuccess])

    useEffect(() => {
        if(sendUnMessage.isSuccess){
            console.log('running google search here')
            sendBotMessage(sendUnMessage.data.answer)
            // setIsBotTyping(false)
            // setChatBubbles([...chatBubbles,chatBubble(sendMessage.data.answer,false)])
        }
    }, [sendUnMessage.isSuccess])


    const sendToPalmModel=async (message) => {
        //send message to palm model
        //get response from palm model
        //setChatBubbles([...chatBubbles,chatBubble(response,false)])
        await sendMessage.mutate({message:message, sessionId:sessionId})
    }

    const sendBotMessage=async (message) => {
        // e.preventDefault()
        if(!isBotTyping) return
        setIsBotTyping(false)
        setChatBubbles([...chatBubbles,chatBubble(message,false)])
        // const m=message
        // setMessage("")
        // await sendToPalmModel(m)
    }

    const inputBox= () => {

        const sendMessage=async (e) => {
            e.preventDefault()
            if(isBotTyping) return
            setIsBotTyping(true)
            setChatBubbles([...chatBubbles,chatBubble(message,true)])
            const m=message
            setMessage("")
            await sendToPalmModel(m)
        }

        return(
            <form onSubmit={sendMessage}>
                <div
                    className="flex flex-row items-center h-16 bg-white w-full px-4"
                >
                    <div className="flex-grow ml-4">
                    <div className="relative w-full">
                        <input
                        type="text"
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        value={message}
                        onChange={(e)=>setMessage(e.target.value)}
                        />
                    
                    </div>
                    </div>
                    <div className="ml-4">
                    <button 
                        disabled={isBotTyping  || message==""}
                        type="button"
                        onClick={sendMessage}
                        className={`flex items-center justify-center bg-indigo-500 ${isBotTyping?"opacity-50":""} hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0`}
                    >
                        <span>Send</span>
                        <span className="ml-2">
                        <svg
                            className="w-4 h-4 transform rotate-45 -mt-px"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            ></path>
                        </svg>
                        </span>
                    </button>
                    </div>
                </div>
            </form>
          )
    }

    return(
        <div className="flex flex-row justify-center h-[calc(100vh-68px)] ">
            <div className="min-w-[500px] max-w-[1000px] w-full flex flex-col">
              <div className="grow overflow-y-auto">
                {chatBubbles.map((bubble) => bubble)}
                {isBotTyping?<div className="pl-10">
                    <span className="loading loading-bars loading-md"></span>
                </div>:null}
                <div className="w-2 h-24"></div>
              </div>
              <div>
                {inputBox()}
              </div>
        </div>
      </div>
    )
}
            