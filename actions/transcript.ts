'use server'

import {
    AzureKeyCredential,
    ChatRequestMessage,
    OpenAIClient,
} from "@azure/openai"

async function transcript(prevState: any, formData: FormData) {
    console.log("PREV STATE: ", prevState)

    const id = Math.random().toString(36);

    if ( 
        process.env.AZURE_API_KEY === undefined ||
        process.env.AZURE_ENDPOINT === undefined ||
        process.env.AZURE_DEPLOYMENT_NAME === undefined ||
        process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
    ) {
        console.error("Required Env variable");
        return {
            sender: "",
            response: "Azure Credentials not set",
        };
    }

    const file = formData.get("audio") as File;

    if (file.size === 0) {
        return {
            sender: "",
            response: "No audio file provided!!!"
        };
    }

    console.log(">>", file);

    const arrayBuffer = await file.arrayBuffer();
    const audio = new Uint8Array(arrayBuffer);

    console.log("== Transcribe Audio Sample ==");

    const client = new OpenAIClient(
        process.env.AZURE_ENDPOINT,
        new AzureKeyCredential(process.env.AZURE_API_KEY)
    )

    // 音声 -> テキスト
    const whisperResult = await client.getAudioTranscription(
        process.env.AZURE_DEPLOYMENT_NAME,
        audio
    )

    console.log("Transcription: ", whisperResult.text)

    // テキスト -> 回答生成
    const messages: ChatRequestMessage[] = [
        {
            role: "system",
            content: "あなたはAIアシスタントです。ユーザーの質問に簡潔に回答してください。",
        },
        {
            role: "user",
            content: whisperResult.text
        }
    ]

    const completionsResult = await client.getChatCompletions(
        process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
        messages,
        {temperature: 0.7,  maxTokens: 120}
    )

    const response = completionsResult.choices[0].message?.content;

    console.log(prevState.sender, "+++", whisperResult.text);

    return {
        sender: whisperResult.text,
        response: response,
        id: id,
    }

}

export default transcript;