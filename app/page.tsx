"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
  Play,
  Code,
  Zap,
  MessageSquare,
  Globe,
  Headphones,
  CheckCircle,
  Moon,
  Sun,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"

export default function DevVoiceLanding() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const demoQueries = [
    "What does this stack trace mean?",
    "Explain event delegation in JavaScript",
    "Help me debug this error in Flask",
    "How do I write a binary search in Python?",
  ]

  const demoResponses = [
    "This stack trace indicates a null pointer exception. Let me break it down for you...",
    "Event delegation is a technique where you attach a single event listener to a parent element...",
    "This Flask error suggests an import issue. Check your virtual environment and dependencies...",
    "Here's a binary search implementation in Python with explanation...",
  ]

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
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#demo" className="text-sm font-medium hover:text-primary transition-colors">
                Demo
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
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
                <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#demo" className="text-sm font-medium hover:text-primary transition-colors">
                  Demo
                </a>
                <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                  Pricing
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

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                Try the Voice Demo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                See it in Action
              </Button>
            </div>

            {/* Voice Waveform Animation */}
            <div className="bg-card border rounded-lg p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: "20px" }}></div>
                <div
                  className="w-1 bg-purple-500 rounded-full animate-pulse"
                  style={{ height: "40px", animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 bg-blue-500 rounded-full animate-pulse"
                  style={{ height: "30px", animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1 bg-purple-500 rounded-full animate-pulse"
                  style={{ height: "50px", animationDelay: "0.3s" }}
                ></div>
                <div
                  className="w-1 bg-blue-500 rounded-full animate-pulse"
                  style={{ height: "25px", animationDelay: "0.4s" }}
                ></div>
                <div
                  className="w-1 bg-purple-500 rounded-full animate-pulse"
                  style={{ height: "35px", animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-1 bg-blue-500 rounded-full animate-pulse"
                  style={{ height: "45px", animationDelay: "0.6s" }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">"How do I implement a binary search tree in Python?"</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
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

      {/* Live Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Try the Live Demo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience DevVoice in action with these simulated interactions
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  className="w-20 h-20 rounded-full"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                  {isRecording ? "Listening..." : "Click to start voice demo"}
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {demoQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-4 h-auto text-left justify-start bg-transparent"
                      onClick={() => setCurrentDemo(index)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{query}</span>
                    </Button>
                  ))}
                </div>

                <div className="bg-muted rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium mb-2">DevVoice Response:</p>
                      <p className="text-muted-foreground">{demoResponses[currentDemo]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for voice-powered coding assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>Real-time Transcription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Powered by AssemblyAI for accurate, fast speech-to-text conversion optimized for technical language
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-purple-500 mb-2" />
                <CardTitle>GPT-4 Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced AI understanding for natural code support, debugging help, and detailed explanations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle>Stack Trace Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload error logs and get spoken explanations of what went wrong and how to fix it
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle>Multi-Language Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Works with Python, JavaScript, Java, C++, Go, Rust, and 20+ other programming languages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Headphones className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle>Voice-First UX</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No typing required. Perfect for hands-free coding sessions and accessibility
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-indigo-500 mb-2" />
                <CardTitle>IDE Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Works inside VS Code, IntelliJ, and other popular IDEs, or as a standalone application
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
              DevVoice uses AssemblyAI's JavaScript SDK to transcribe developer voice queries with high accuracy
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{`import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({ 
  apiKey: "your-api-key" 
});

const audioFile = 'https://assembly.ai/wildfires.mp3';
const params = {
  audio: audioFile,
  speech_model: "universal",
};

const run = async () => {
  const transcript = await client.transcripts.transcribe(params);
  console.log(transcript.text);
};

run();`}</code>
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/30">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your coding needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for trying out DevVoice</CardDescription>
                <div className="text-3xl font-bold">
                  $0<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    25 minutes/month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Basic voice queries
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Web interface
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For serious developers</CardDescription>
                <div className="text-3xl font-bold">
                  $20<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Unlimited usage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    IDE plugin access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Advanced features
                  </li>
                </ul>
                <Button className="w-full mt-6">Start Pro Trial</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>For development teams</CardDescription>
                <div className="text-3xl font-bold">
                  $50<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Shared usage pool
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Team analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Admin panel
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Custom integrations
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
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
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
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
