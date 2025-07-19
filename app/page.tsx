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
  const { theme, setTheme } = useTheme()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check if browser supports required APIs
    if (!navigator.mediaDevices || !window.SpeechSynthesis) {
      console.warn("Browser doesn't support required APIs")
    }
  }, [])

  const startRecording = async () => {
    try {
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
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setIsConnected(true)
      setTranscript("Listening...")
    } catch (error) {
      console.error("Error starting recording:", error)
      setTranscript("Error: Could not access microphone")
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

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true)

    try {
      // Convert audio to base64 for demo purposes
      const reader = new FileReader()
      reader.onloadend = async () => {
        // Simulate transcription with AssemblyAI
        await simulateTranscription()
      }
      reader.readAsDataURL(audioBlob)
    } catch (error) {
      console.error("Error processing audio:", error)
      setTranscript("Error processing audio")
      setIsLoading(false)
    }
  }

  const simulateTranscription = async () => {
    // Simulate realistic transcription delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const sampleQuestions = [
      "How do I implement a binary search algorithm in Python?",
      "What's the difference between let and const in JavaScript?",
      "How do I fix a null pointer exception in Java?",
      "Explain the concept of closures in JavaScript",
      "How do I create a REST API with Node.js?",
    ]

    const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
    setTranscript(randomQuestion)

    // Generate AI response
    await generateResponse(randomQuestion)
  }

  const generateResponse = async (question: string) => {
    const responses: { [key: string]: string } = {
      "binary search":
        "Here's a binary search implementation in Python: def binary_search(arr, target): left, right = 0, len(arr) - 1. While left <= right: mid = (left + right) // 2. If arr[mid] == target: return mid. This algorithm has O(log n) time complexity.",
      "let and const":
        "The main differences are: let allows reassignment while const doesn't. Both are block-scoped unlike var. const must be initialized at declaration. Use const by default, let when you need to reassign.",
      "null pointer":
        "Null pointer exceptions occur when you try to use a reference that points to no location in memory. To fix: check if object is null before using it, initialize objects properly, and use Optional in Java 8+.",
      closures:
        "A closure is when an inner function has access to variables from its outer function's scope even after the outer function returns. This creates a persistent scope chain that's useful for data privacy and callbacks.",
      "REST API":
        "To create a REST API with Node.js: install Express, set up routes for GET, POST, PUT, DELETE operations, use middleware for parsing JSON, implement error handling, and connect to a database like MongoDB or PostgreSQL.",
    }

    let aiResponse = "I can help you with that coding question. "

    // Find matching response based on keywords
    for (const [key, value] of Object.entries(responses)) {
      if (question.toLowerCase().includes(key)) {
        aiResponse = value
        break
      }
    }

    if (aiResponse === "I can help you with that coding question. ") {
      aiResponse +=
        "This is a great programming question. Let me break it down for you with a clear explanation and code examples."
    }

    setResponse(aiResponse)
    setIsLoading(false)

    // Speak the response
    speakResponse(aiResponse)
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
                  Click the microphone and ask a coding question to experience real-time voice assistance
                </p>

                {/* Voice Control Buttons */}
                <div className="flex justify-center items-center gap-4 mb-6">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="w-20 h-20 rounded-full relative"
                    onClick={toggleRecording}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
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
                </div>

                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mb-6">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span>{isConnected ? "Connected & Listening" : "Click microphone to start"}</span>
                </div>
              </div>

              {/* Transcript Display */}
              {transcript && (
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
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <p className="font-medium">DevVoice is thinking...</p>
                        <p className="text-sm text-muted-foreground">Processing your question</p>
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
                        <p className="text-foreground leading-relaxed">{response}</p>
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
                  DevVoice transcribes your voice using AssemblyAI and sends it to GPT-4 for intelligent analysis
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powered by AssemblyAI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              DevVoice uses AssemblyAI's streaming transcription for real-time voice processing with high accuracy
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{`import { AssemblyAI } from 'assemblyai'
import recorder from 'node-record-lpcm16'

const client = new AssemblyAI({
  apiKey: "your-api-key"
});

const transcriber = client.streaming.transcriber({
  sampleRate: 16_000,
  formatTurns: true
});

transcriber.on("turn", (turn) => {
  if (turn.transcript) {
    console.log("Transcript:", turn.transcript);
    // Send to AI for processing
    processWithAI(turn.transcript);
  }
});

await transcriber.connect();
const recording = recorder.record({
  channels: 1,
  sampleRate: 16_000,
  audioType: "wav"
});

// Stream audio to AssemblyAI
Readable.toWeb(recording.stream())
  .pipeTo(transcriber.stream());`}</code>
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
              and natural code support from GPT-4, it creates a voice-first coding experience you never knew you needed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">AssemblyAI</Badge>
              <Badge variant="secondary">GPT-4</Badge>
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
