/**
 * Client-side Gemini Live Session Manager for Next.js
 * Based on the geminiLiveService.ts reference implementation
 */

import { GoogleGenAI, LiveServerMessage, Modality, Blob as GeminiBlob } from '@google/genai';

/**
 * Encodes a Uint8Array to a base64 string.
 */
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a base64 string to a Uint8Array.
 */
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data (Uint8Array) into an AudioBuffer.
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Creates an audio Blob from Float32Array PCM data.
 */
function createBlob(data: Float32Array): GeminiBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768; // Convert to 16-bit PCM
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export type MessageType = 'user' | 'model' | 'status';

export interface ChatMessage {
  type: MessageType;
  text: string;
  timestamp: number;
}

export class LiveSessionManager {
  private ai: GoogleGenAI | null = null;
  private sessionPromise: Promise<Awaited<ReturnType<GoogleGenAI['live']['connect']>>> | null = null;

  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;

  private nextStartTime: number = 0;
  private sources: Set<AudioBufferSourceNode> = new Set();

  private currentInputTranscription: string = '';
  private currentOutputTranscription: string = '';

  private readonly onMessage: (message: ChatMessage) => void;
  private readonly onRecordingStatusChange: (isRecording: boolean) => void;
  private readonly onApiError: (error: string) => void;
  private apiKey: string | null = null;

  constructor(
    onMessage: (message: ChatMessage) => void,
    onRecordingStatusChange: (isRecording: boolean) => void,
    onApiError: (error: string) => void,
  ) {
    this.onMessage = onMessage;
    this.onRecordingStatusChange = onRecordingStatusChange;
    this.onApiError = onApiError;
  }

  /**
   * Fetches the API key from the server
   */
  private async fetchApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    try {
      const response = await fetch('/api/gemini-live-key');
      if (!response.ok) {
        throw new Error('Failed to fetch API key');
      }
      const data = await response.json();
      this.apiKey = data.apiKey;
      if (!this.apiKey) {
        throw new Error('API key not found in response');
      }
      return this.apiKey;
    } catch (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Could not retrieve API key');
    }
  }

  /**
   * Initializes and starts a new Live API session.
   */
  public async startSession(): Promise<void> {
    if (this.sessionPromise) {
      this.onMessage({ type: 'status', text: 'Session already active.', timestamp: Date.now() });
      return;
    }

    this.onMessage({ type: 'status', text: 'Initializing audio...', timestamp: Date.now() });
    this.onRecordingStatusChange(true);

    try {
      // Fetch API key from server
      const apiKey = await this.fetchApiKey();
      this.ai = new GoogleGenAI({ apiKey });

      // Initialize audio contexts
      this.inputAudioContext = new AudioContext({ sampleRate: 16000 });
      this.outputAudioContext = new AudioContext({ sampleRate: 24000 });

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphoneSource = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

      this.onMessage({ type: 'status', text: 'Connecting to Gemini Live API...', timestamp: Date.now() });

      // Connect to Gemini Live
      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            this.onMessage({ type: 'status', text: 'Connection established. You can start speaking.', timestamp: Date.now() });
            this.setupAudioInputProcessing();
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle audio output from the model
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString && this.outputAudioContext) {
              this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
              try {
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  this.outputAudioContext,
                  24000,
                  1,
                );
                const source = this.outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.outputAudioContext.destination);
                source.addEventListener('ended', () => {
                  this.sources.delete(source);
                });
                source.start(this.nextStartTime);
                this.nextStartTime += audioBuffer.duration;
                this.sources.add(source);
              } catch (audioDecodeError) {
                console.error('Error decoding audio data:', audioDecodeError);
                this.onApiError('Error processing model audio.');
              }
            }

            // Handle transcriptions
            if (message.serverContent?.outputTranscription) {
              this.currentOutputTranscription += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              this.currentInputTranscription += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              if (this.currentInputTranscription) {
                this.onMessage({ type: 'user', text: this.currentInputTranscription, timestamp: Date.now() });
                this.currentInputTranscription = '';
              }
              if (this.currentOutputTranscription) {
                this.onMessage({ type: 'model', text: this.currentOutputTranscription, timestamp: Date.now() });
                this.currentOutputTranscription = '';
              }
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              this.stopAllAudioPlayback();
              this.onMessage({ type: 'status', text: 'Model response interrupted.', timestamp: Date.now() });
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Gemini Live API error:', e);
            this.onApiError(`API Error: ${e.message || 'Unknown error'}. Please try again.`);
            this.stopSession();
          },
          onclose: (e: CloseEvent) => {
            console.debug('Gemini Live API connection closed:', e);
            this.onMessage({ type: 'status', text: `Connection closed. (${e.code} ${e.reason || 'No reason'})`, timestamp: Date.now() });
            this.cleanUpAudio();
            this.sessionPromise = null;
            this.onRecordingStatusChange(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are an AI language tutor for LinguistLM, helping learners develop speaking fluency and conversational confidence. Your role is to:

1. **Engage naturally**: Have authentic, flowing conversations that feel like speaking with a patient friend who happens to be a language expert.

2. **Provide gentle corrections**: When you notice pronunciation, grammar, or vocabulary errors, gently correct them in context without interrupting the flow. Say things like "Great! By the way, we usually say..." or "Perfect meaning! Native speakers might say..."

3. **Build confidence**: Celebrate progress, no matter how small. Encourage learners to speak more, even if they make mistakes. Remind them that mistakes are essential for learning.

4. **Adapt to their level**: Listen for their proficiency level and adjust your vocabulary, speaking pace, and sentence complexity accordingly. Start simple and gradually increase difficulty as they improve.

5. **Keep it conversational**: Ask follow-up questions, share interesting facts, and keep the dialogue dynamic. Make learning feel like a conversation, not a lesson.

6. **Focus on practical language**: Teach vocabulary and phrases learners will actually use in real-world situations - travel, work, social settings, daily life.

7. **Be encouraging and positive**: Use phrases like "Excellent pronunciation!", "You're making great progress!", "Don't worry about mistakes - they help you learn!", "That was much better!", etc.

Remember: Your goal is to make speaking practice enjoyable, confidence-building, and effective. Keep responses concise (2-3 sentences usually), natural, and encouraging. You're not just teaching a language - you're helping someone find their voice in a new language.`,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

    } catch (error: any) {
      console.error('Failed to start Live API session:', error);
      this.onApiError(`Initialization failed: ${error.message || 'Microphone access denied or unknown error.'}`);
      this.stopSession();
    }
  }

  /**
   * Sets up the audio input processing for streaming to the Live API.
   */
  private setupAudioInputProcessing(): void {
    if (!this.scriptProcessor || !this.microphoneSource || !this.inputAudioContext) return;

    this.scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
      const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
      const pcmBlob = createBlob(inputData);

      if (this.sessionPromise) {
        this.sessionPromise.then((session) => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      }
    };
    this.microphoneSource.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  /**
   * Stops the current Live API session and cleans up resources.
   */
  public async stopSession(): Promise<void> {
    if (this.sessionPromise) {
      try {
        const session = await this.sessionPromise;
        session.close();
      } catch (error) {
        console.warn('Error closing session:', error);
      } finally {
        this.sessionPromise = null;
      }
    }
    this.cleanUpAudio();
    this.onRecordingStatusChange(false);
    this.onMessage({ type: 'status', text: 'Conversation ended.', timestamp: Date.now() });
  }

  /**
   * Stops all active audio playback.
   */
  private stopAllAudioPlayback(): void {
    this.sources.forEach((source) => {
      source.stop();
      source.disconnect();
    });
    this.sources.clear();
    this.nextStartTime = 0;
  }

  /**
   * Cleans up all audio-related resources.
   */
  private cleanUpAudio(): void {
    this.stopAllAudioPlayback();

    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor.onaudioprocess = null;
      this.scriptProcessor = null;
    }
    if (this.microphoneSource) {
      this.microphoneSource.disconnect();
      this.microphoneSource = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.inputAudioContext) {
      this.inputAudioContext.close().catch(e => console.warn('Error closing input audio context:', e));
      this.inputAudioContext = null;
    }
    if (this.outputAudioContext) {
      this.outputAudioContext.close().catch(e => console.warn('Error closing output audio context:', e));
      this.outputAudioContext = null;
    }
    this.currentInputTranscription = '';
    this.currentOutputTranscription = '';
  }
}
