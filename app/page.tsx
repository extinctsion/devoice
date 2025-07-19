"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
  Zap,
  MessageSquare,
  Headphones,
  Moon,
  Sun,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react"
import { useTheme } from "next-themes"

export default function DevVoiceLanding() {
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [error, setError] = useState("")
  const { theme, setTheme } = useTheme()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check browser support
  useEffect(() => {
    if (!navigator.mediaDevices || !window.SpeechSynthesis) {
      setError("Your browser doesn't support the required audio features")
    }
  }, [])

  const startRecording = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsConnected(true)
      setTranscript("Listening...")
    } catch (error) {
      console.error("Error starting recording:", error)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsConnected(false)
      setTranscript("Processing...")
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setTranscript(data.transcript)

      // Generate AI response
      await generateAIResponse(data.transcript)
    } catch (error) {
      console.error("Transcription error:", error)
      setError("Failed to transcribe audio. Please try again.")
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResponse(data.response)
      setIsLoading(false)

      // Speak the response
      speakResponse(data.response)
    } catch (error) {
      console.error("AI response error:", error)
      setError("Failed to generate AI response. Please try again.")
      setIsLoading(false)
    }
  }

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const clearSession = () => {
    setTranscript("")
    setResponse("")
    setError("")
    stopSpeaking()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DevVoice</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#use-cases" className="text-sm font-medium hover:text-primary transition-colors">
                Use Cases
              </a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <a href="#docs" className="text-sm font-medium hover:text-primary transition-colors">
                Docs
              </a>
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button>Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                  How it Works
                </a>
                <a href="#use-cases" className="text-sm font-medium hover:text-primary transition-colors">
                  Use Cases
                </a>
                <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                  About
                </a>
                <a href="#docs" className="text-sm font-medium hover:text-primary transition-colors">
                  Docs
                </a>
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Live Demo */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Voice Assistant
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Talk to Code: Your AI-Powered{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Real-Time Coding Assistant
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              DevVoice helps developers solve bugs, learn syntax, and understand code — all by speaking. Code smarter.
              Speak naturally.
            </p>
          </div>

          {/* Live Voice Demo */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur border-2">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Try DevVoice Live</h2>
                <p className="text-muted-foreground mb-6">
                  Click the microphone and ask a coding question to experience real-time voice assistance powered by
                  AssemblyAI and OpenAI
                </p>

                {/* Voice Control Buttons */}
                <div className="flex justify-center items-center gap-4 mb-6">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="w-20 h-20 rounded-full relative"
                    onClick={toggleRecording}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : isRecording ? (
                      <MicOff className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                    {isConnected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </Button>

                  {isSpeaking && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-16 h-16 rounded-full bg-transparent"
                      onClick={stopSpeaking}
                    >
                      <VolumeX className="w-6 h-6" />
                    </Button>
                  )}

                  {(transcript || response) && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-16 h-16 rounded-full bg-transparent"
                      onClick={clearSession}
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  )}
                </div>

                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mb-6">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span>
                    {isLoading ? "Processing..." : isConnected ? "Connected & Listening" : "Click microphone to start"}
                  </span>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Transcript Display */}
              {transcript && transcript !== "Listening..." && transcript !== "Processing..." && (
                <div className="mb-6">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">Your Question:</p>
                        <p className="text-foreground">{transcript}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="mb-6">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                      <div>
                        <p className="font-medium">DevVoice is thinking...</p>
                        <p className="text-sm text-muted-foreground">
                          {transcript === "Processing..." ? "Transcribing audio..." : "Generating response..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {response && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {isSpeaking ? (
                          <Volume2 className="w-4 h-4 text-white animate-pulse" />
                        ) : (
                          <Headphones className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">DevVoice Response:</p>
                          {isSpeaking && (
                            <Badge variant="secondary" className="text-xs">
                              Speaking...
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{response}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Questions */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Try asking questions like:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3 text-left">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-blue-500" />
                    "How do I implement quicksort in Python?"
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-left">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-purple-500" />
                    "What does this error message mean?"
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-left">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-green-500" />
                    "Explain async/await in JavaScript"
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-left">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-orange-500" />
                    "How do I debug memory leaks?"
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How DevVoice Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your coding workflow with voice
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <CardTitle>1. Speak Your Query</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ask questions naturally: "How do I write quicksort in JavaScript?" or "What does this error mean?"
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle>2. AI Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  DevVoice transcribes your voice using AssemblyAI and sends it to Cohere's Command-R-Plus model for
                  intelligent analysis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <CardTitle>3. Get Spoken Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive detailed explanations, code examples, and solutions — all spoken back to you in real-time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Integration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powered by AssemblyAI & Cohere</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              DevVoice combines AssemblyAI's real-time transcription with Cohere's powerful language model for
              intelligent coding assistance
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{`// AssemblyAI Integration
import { AssemblyAI } from 'assemblyai'

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

// Transcribe audio
const transcript = await client.transcripts.transcribe({
  audio: audioFile,
  speech_model: 'best'
});

// Cohere Integration
import { generateText } from 'ai'
import { cohere } from '@ai-sdk/cohere'

const { text } = await generateText({
  model: cohere('command-r-plus'),
  prompt: transcript.text,
  system: "You are DevVoice, an AI coding assistant..."
});`}</code>
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Perfect For</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Debugging Errors on the Fly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Quickly understand and fix bugs without interrupting your flow</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Learning New Concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Ask questions and get explanations without typing or searching</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Stack Trace Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Get real-time explanations of complex error messages</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Hands-Free Coding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Perfect for accessibility or when your hands are busy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Developers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  "DevVoice saved me hours during debugging. I can just describe the error and get instant help."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Senior Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  "I learned faster by asking questions aloud. It's like having a coding mentor available 24/7."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Marcus Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Bootcamp Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  "I use it daily while troubleshooting logs. The voice interface is incredibly intuitive."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Alex Thompson</p>
                    <p className="text-sm text-muted-foreground">DevOps Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">About DevVoice</h2>
            <p className="text-xl text-muted-foreground mb-8">
              DevVoice is built by developers for developers. With ultra-fast streaming speech-to-text from AssemblyAI
              and intelligent responses from OpenAI GPT-4, it creates a voice-first coding experience you never knew you
              needed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">AssemblyAI</Badge>
              <Badge variant="secondary">Cohere Command-R-Plus</Badge>
              <Badge variant="secondary">Node.js</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">TailwindCSS</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DevVoice</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Code smarter. Speak naturally.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Use Cases
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="mailto:support@devvoice.ai" className="hover:text-foreground transition-colors">
                    support@devvoice.ai
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DevVoice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
