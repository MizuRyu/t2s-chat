import { Message } from '@/app/page'
import { ChevronDownCircle } from 'lucide-react'
import { LoadingMessages } from './LoadingMessages'

interface Props {
  messages: Message[]
}

export const Messages = ( {messages}: Props ) => {
  return (
    <div className={`flex flex-col min-h-screen h-5 p-5 pt-20 ${
      messages.length > 0 ? "pb-96" : "pb-40"
    }`}
    >
      <LoadingMessages />

      {!messages.length && (
        <div className="flex flex-col space-y-10 flex-1 items-center justify-end ">
          <p className="text-center text-white animate-pulse">AIと会話を始める</p>
          <ChevronDownCircle 
            size={64}
            className="animate-bounce text-gray-500"
          />
        </div>
      )}

      <div className="space-y-5">
        {messages.map(message => (
          <div key={message.id} className="space-y-5">
            {/* response */}
            <div className="pr-48">
              <p className="py-4 message text-white bg-gray-800 rounded-bl-none">
                {message.response}
              </p>
            </div>

            {/* sender */}
            <div className="pl-48">
              <p className="py-4 message text-left ml-auto bg-white rounded-br-none">
                {message.sender}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
