import React from 'react'
import { useFormStatus } from 'react-dom'
import { BeatLoader } from 'react-spinners'

export const LoadingMessages = () => {
    const { pending } = useFormStatus();
    return (
        pending && (
            <p className="message ml-auto">
                <BeatLoader />
            </p>
        )
    )
}