import { useState } from "react";
import { Play, Trash2, Send, Lock, Zap, Eye, Mail, Video, MessageCircle, ChevronRight, Check, Clock, Users } from "lucide-react";

const LandingPage = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Play size={16} fill="white" />
            </div>
            <span className="text-xl font-bold">TinyBot</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/auth" className="text-sm text-gray-400 hover:text-white transition">Log in</a>
            <a href="/auth" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <Mail size={14} className="text-blue-400" />
            <span className="text-sm text-blue-400">No app needed to receive</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Stop hearing
            <span className="bg-gradient-to-r from-red-400 via-orange-500 to-amber-500 bg-clip-text text-transparent"> "file too large"</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed">
            Email caps at 25MB. Your videos don't. TinyBot shrinks them down so you can send that birthday message, that project update, that moment — to anyone, without making them download another app.
          </p>

          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            <span className="text-blue-400 font-medium">Videos under 10 minutes</span> are compressed to email-friendly sizes. Just upload, send, done.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-80 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold transition flex items-center justify-center gap-2">
              Start Free <ChevronRight size={18} />
            </button>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Error Message Mockup */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-xl">✕</span>
                </div>
                <div className="text-left">
                  <p className="text-red-400 font-medium">Attachment failed</p>
                  <p className="text-sm text-red-400/70">File "vacation-video.mp4" (847 MB) exceeds the 25 MB limit</p>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex justify-center my-4">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-full p-2">
                  <ChevronRight size={24} className="rotate-90 text-gray-400" />
                </div>
              </div>

              {/* Success Message Mockup */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="text-green-400" size={20} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-green-400 font-medium">Sent via TinyBot</p>
                  <p className="text-sm text-green-400/70">"vacation-video.mp4" compressed to 18 MB and delivered</p>
                </div>
                <div className="text-right text-sm">
                  <span className="text-gray-500 line-through">847 MB</span>
                  <span className="text-green-400 ml-2 font-medium">18 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sound familiar?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-4xl mb-4">📧</p>
              <p className="text-gray-300">"I tried to email the video but it was too big"</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-4xl mb-4">🤷</p>
              <p className="text-gray-300">"My parents don't have WhatsApp and won't download it"</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-4xl mb-4">☁️</p>
              <p className="text-gray-300">"I uploaded to Google Drive but they couldn't figure out the link"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How TinyBot solves it</h2>
            <p className="text-gray-400 text-lg">No tech skills required. No app for them to install.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-blue-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Compression</h3>
              <p className="text-gray-400 leading-relaxed">
                Videos under 10 minutes are automatically compressed to under 25MB — small enough for any email. Quality stays sharp.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-purple-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">No App Required</h3>
              <p className="text-gray-400 leading-relaxed">
                Recipients don't need to download anything. They get a link, they click, they watch. Works for grandma, works for your boss.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-pink-500/50 transition">
              <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                <Trash2 className="text-pink-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto-Cleanup</h3>
              <p className="text-gray-400 leading-relaxed">
                Videos are deleted after viewing. No cloud clutter, no forgotten files, no storage fees. Send it and forget it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple as 1-2-3</h2>
            <p className="text-gray-400 text-lg">Send a video in under a minute</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload</h3>
              <p className="text-gray-400">
                Drop any video under 10 minutes. We compress it automatically to email-friendly size.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Address</h3>
              <p className="text-gray-400">
                Enter their email or TinyBot username. Add a message if you want.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Send</h3>
              <p className="text-gray-400">
                They get a link. One click to watch. No signups, no downloads, no friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What can you send?</h2>
            <p className="text-gray-400">Videos under 10 minutes compress to email-safe sizes</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-5 text-gray-400 font-medium">Video Length</th>
                  <th className="p-5 text-center text-gray-400 font-medium">Original Size</th>
                  <th className="p-5 text-center text-gray-400 font-medium">After TinyBot</th>
                  <th className="p-5 text-center text-gray-400 font-medium">Email-Safe?</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/10">
                  <td className="p-5 text-gray-300 flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" /> 1 minute
                  </td>
                  <td className="p-5 text-center text-gray-400">~120 MB</td>
                  <td className="p-5 text-center text-green-400 font-medium">~5 MB</td>
                  <td className="p-5 text-center"><Check className="text-green-400 mx-auto" size={20} /></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-5 text-gray-300 flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" /> 5 minutes
                  </td>
                  <td className="p-5 text-center text-gray-400">~600 MB</td>
                  <td className="p-5 text-center text-green-400 font-medium">~15 MB</td>
                  <td className="p-5 text-center"><Check className="text-green-400 mx-auto" size={20} /></td>
                </tr>
                <tr className="border-b border-white/10 bg-blue-500/5">
                  <td className="p-5 text-gray-300 flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" /> 10 minutes
                  </td>
                  <td className="p-5 text-center text-gray-400">~1.2 GB</td>
                  <td className="p-5 text-center text-green-400 font-medium">~25 MB</td>
                  <td className="p-5 text-center"><Check className="text-green-400 mx-auto" size={20} /></td>
                </tr>
                <tr>
                  <td className="p-5 text-gray-500 flex items-center gap-2">
                    <Clock size={16} className="text-gray-600" /> 20+ minutes
                  </td>
                  <td className="p-5 text-center text-gray-500">~2.4 GB</td>
                  <td className="p-5 text-center text-amber-400 font-medium">~50 MB</td>
                  <td className="p-5 text-center text-gray-500 text-xs">May exceed limits</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            * Compression results vary based on video content. Fast-moving footage may be slightly larger.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why not just use...?</h2>
            <p className="text-gray-400 text-lg">We know you have options. Here's why they fall short.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email attachments</h3>
                <p className="text-gray-400 text-sm">25MB limit. Your 2-minute video is 200MB. Rejected.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">WhatsApp / iMessage / Snapchat</h3>
                <p className="text-gray-400 text-sm">Great if they have it. Your uncle doesn't. Your client won't install it for one video.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">☁️</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Google Drive / Dropbox links</h3>
                <p className="text-gray-400 text-sm">They need to sign in. Or can't find the download button. Or the link expires. Or they're out of storage.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play size={20} fill="white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-blue-400">TinyBot</h3>
                <p className="text-gray-300 text-sm">Compresses to under 25MB. One-click viewing. No app needed. No sign-up for them. Just works.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to send that video?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Free for videos under 5 minutes. No credit card required.
            </p>
            <a 
              href="/auth" 
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Create Free Account <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Play size={16} fill="white" />
            </div>
            <span className="text-xl font-bold">TinyBot</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 TinyBot. Send videos to anyone.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
            <a href="/terms" className="hover:text-white transition">Terms</a>
            <a href="/contact" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
