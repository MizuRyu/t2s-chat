'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { SettingsIcon } from 'lucide-react'
import { Messages } from '@/components/Messages'
import { Recorder } from '@/components/Recorder'
import { useFormState } from 'react-dom'
import transcript from '@/actions/transcript'
import { VoiceSynthesizer } from '@/components/VoiceSynthesizer'

const initialState = {
  sender: '',
  response: '',
  id: '',
}

export type Message = {
  sender: string;
  response: string;
  id: string;
}

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)
  const [state, formAction] = useFormState(transcript, initialState)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (state.response && state.sender) {
      setMessages(messages => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...messages
      ])
    }
  }, [state])

  // ボタン押下で音声ファイルをアップロードする
  const uploadAudio = (blob: Blob) => {
    //binaryデータをURLに変換
    const url = URL.createObjectURL(blob)

    const file = new File([blob], 'audio.webm', { type: blob.type })

    // ファイルを隠しファイル入力に設定
    if (fileRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileRef.current.files = dataTransfer.files

      // ファイルを送信する
      if (submitButtonRef.current) {
        submitButtonRef.current.click()
      }
    }
  }

  return (
    <main className="bg-slate-100 h-screen overflow-y-auto">
      {/* header */}
      <header className="flex justify-between fixed top-0 text-white w-full p-5">
        <Image alt="headerLogo" src="/bot.png" height={50} width={50} />

        <SettingsIcon
          size={40}
          className="p-2 m-2 rounded-full cursor-pointer bg-slate-400 text-black
          transition-all ease-in-out duration-150 hover:bg-slate-700 hover:text-white "
        />
      </header>
      {/* Form */}
      <form action={formAction} className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-slate-400 to-black">
          <Messages messages={messages} />
        </div>

        <input type="file" name="audio" hidden ref={fileRef} />
        <button type="submit" hidden ref={submitButtonRef}></button>

        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          {/* Recorder */}
          <Recorder uploadAudio={uploadAudio} />

          <div>{/* Voice -output */}</div>
        </div>
      </form>
    </main>
  )
}
