'use client'

import Image from 'next/image'
import activeAssistantIcon from '@/assets/active-assistant.gif'
import notActiveAssistantIcon from '@/assets/not-active-assistant.png'
import { useState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

export const Recorder = ({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const { pending } = useFormStatus()
  const [permission, setPermission] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recordingStatus, setRecordingStatus] = useState('inactive')
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const mimeType = 'audio/webm'

  useEffect(() => {
    getMicrophonePermission()
  }, [])

  // マイクの使用許可/拒否
  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        setPermission(true)
        setStream(streamData)
      } catch (err: any) {
        alert(err.message)
      }
    } else {
      alert('The MediaRecorder API is not supported on this browser.')
    }
  }

  const startRecording = () => {
    if (stream === null || pending) return

    setRecordingStatus('recording')

    // レコーダーのインスタンスを作成
    const media = new MediaRecorder(stream, { mimeType })
    mediaRecorder.current = media
    mediaRecorder.current.start()

    let localAudioChunks: Blob[] = []
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return
      if (event.data.size === 0) return

      localAudioChunks.push(event.data)
    }

    setAudioChunks(localAudioChunks)
  }

  const stopRecording = async () => {
    if (mediaRecorder.current === null || pending) return

    setRecordingStatus('inactive')
    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType })
      const audioUrl = URL.createObjectURL(audioBlob)
      uploadAudio(audioBlob)
      setAudioChunks([])
    }
  }

  return (
    <div
      className="flex item-center justify-center
  text-white"
    >
      {!permission && <button onClick={getMicrophonePermission}>音声の使用を許可します。</button>}

      {pending && (
        <Image
          alt="recorder"
          src={notActiveAssistantIcon}
          height={350}
          width={350}
          priority
          className="assistant grayscale cursor-not-allowed"
        />
      )}

      {permission && recordingStatus === 'inactive' && !pending && (
        <Image
          alt="recorder"
          src={notActiveAssistantIcon}
          height={350}
          width={350}
          onClick={startRecording}
          priority
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}

      {recordingStatus === 'recording' && (
        <Image
          alt="recorder"
          src={activeAssistantIcon}
          height={350}
          width={350}
          onClick={stopRecording}
          priority
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}
    </div>
  )
}
