'use client'

import { ChangeEvent, useEffect, useState } from "react";

type State = {
    sender: string;
    response: string | null | undefined;
}

export const VoiceSynthesizer = ({
    state,
    displaySettings,
}: {
    state: State;
    displaySettings: boolean;
}) => {
    const [ synth, setSynth ] = useState<SpeechSynthesis | null>(null);
    const [ voice, setVoice ] = useState<SpeechSynthesisVoice | null>(null);
    const [ pitch, setPitch ] = useState(1.0)

    useEffect(() => {
        setSynth(window.speechSynthesis);
    }, []);
    
    useEffect(() => {
        if (!state.response || !synth) return;

        const wordsToSpeak = new SpeechSynthesisUtterance(state.response);

        wordsToSpeak.voice = voice;
        wordsToSpeak.pitch = pitch;

        synth.speak(wordsToSpeak);
        synth.resume();

        return () => {
            synth.cancel();
        }
    }, [state])

    const handleVoiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find((v) => v.name === e.target.value);
        if (!selectedVoice) return;
        setVoice(selectedVoice);
    }

    const handlePitchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPitch(parseFloat(e.target.value));
    }

    console.log("VoiceSynthesizer: ", displaySettings)
    return (
        <div className="flex flex-col items-center justify-center text-white">
            {displaySettings && (
                <>
                    <div>
                        <p className="text-xs font-bold p-2">Voice:</p>
                        <select 
                            value={voice?.name}
                            onChange={handleVoiceChange}
                            className="flex-1 bg-slay-100 text-black border border-gray-300 text-sm rounded-lg 
                            focus:ring-slay-500 focus:border-slay-500 block w-full p-2.5 dark:bg-gray-700 
                            dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-slay-500 dark:focus:border-slay-500"
                        >
                            {window.speechSynthesis.getVoices().map((voice) => {
                                return (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="flex pb-5">
                            <div>
                                <p className="text-xs text-gray-500">Pitch:</p>
                                <input 
                                    type="range" 
                                    min={0.5}
                                    max={2} 
                                    step={0.1} 
                                    value={pitch} 
                                    onChange={handlePitchChange}
                                    className="accent-slay-500"
                                    />
                            </div>
                    </div>
                </>
            )}
        </div>
    )
}