"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

export default function BigTextApp() {
  const [text, setText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const hour = new Date().getHours();
      return hour >= 18 || hour < 6; // Dark mode from 6 PM to 6 AM
    }
    return false;
  });
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontSize, setFontSize] = useState(100);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && isInputVisible && text.trim()) {
        handleTextSubmit();
      } else if (e.key === 'Escape' && !isInputVisible) {
        handleBackToInput();
      }
    };

    const windowKeyHandler = (e: Event) => handleKeyDown(e as KeyboardEvent);
    window.addEventListener('keydown', windowKeyHandler);
    return () => window.removeEventListener('keydown', windowKeyHandler);
  }, [isInputVisible, text]);

  // Auto-adjust font size to fit screen without breaking words
  useEffect(() => {
    if (text && textDisplayRef.current) {
      const container = textDisplayRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      let testFontSize = Math.min(containerWidth, containerHeight) * 0.8;
      const words = text.trim().split(/\s+/);
      
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      tempElement.style.fontWeight = '900';
      tempElement.style.lineHeight = '1.1';
      tempElement.style.textAlign = 'center';
      tempElement.style.width = containerWidth * 0.9 + 'px';
      tempElement.style.wordWrap = 'break-word';
      tempElement.style.overflowWrap = 'break-word';
      tempElement.style.hyphens = 'none';
      document.body.appendChild(tempElement);
      
      while (testFontSize > 20) {
        tempElement.style.fontSize = testFontSize + 'px';
        tempElement.innerHTML = text;
        
        const textHeight = tempElement.offsetHeight;
        
        let wordTooBig = false;
        for (let word of words) {
          tempElement.innerHTML = word;
          if (tempElement.offsetWidth > containerWidth * 0.9) {
            wordTooBig = true;
            break;
          }
        }
        
        tempElement.innerHTML = text;
        
        if (!wordTooBig && textHeight <= containerHeight * 0.9) {
          break;
        }
        testFontSize -= 3;
      }
      
      document.body.removeChild(tempElement);
      setFontSize(testFontSize);
    }
  }, [text]);

  const handleTextSubmit = () => {
    if (text.trim()) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsInputVisible(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleBackToInput = () => {
    setIsAnimating(true);
    setIsInputVisible(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 300);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 text-white' 
    : 'bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 text-black';

  if (!isInputVisible && text) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center ${themeClasses} relative overflow-hidden transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-full ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' 
              : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
          }`}></div>
          
          {/* Floating orbs with different animations */}
          <div className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? 'bg-purple-500/10 opacity-60' : 'bg-blue-400/12 opacity-40'
          } animate-pulse`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? 'bg-pink-500/10 opacity-60' : 'bg-purple-400/12 opacity-40'
          } animate-pulse`} style={{animationDelay: '1.5s'}}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? 'bg-blue-500/8 opacity-40' : 'bg-pink-400/10 opacity-30'
          } animate-bounce`} style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
          
          {/* Subtle moving particles */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-white/10' : 'bg-gray-400/20'
                } animate-ping`}
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '4s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Control buttons with enhanced styling */}
        <button
          onClick={handleBackToInput}
          className={`absolute top-4 md:top-6 left-4 md:left-6 z-20 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 group ${
            isDarkMode 
              ? 'bg-gray-800/95 text-white hover:bg-gray-700/95 backdrop-blur-sm shadow-lg border border-purple-500/20' 
              : 'bg-white/95 text-black hover:bg-gray-100/95 backdrop-blur-sm shadow-lg border border-gray-200/50'
          }`}
        >
          <span className="group-hover:animate-bounce inline-block">←</span> Edit
        </button>

        <button
          onClick={toggleTheme}
          className={`absolute top-4 md:top-6 right-4 md:right-6 z-20 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 group ${
            isDarkMode 
              ? 'bg-gray-800/95 text-white hover:bg-gray-700/95 backdrop-blur-sm shadow-lg border border-purple-500/20' 
              : 'bg-white/95 text-black hover:bg-gray-100/95 backdrop-blur-sm shadow-lg border border-gray-200/50'
          }`}
        >
          <span className="group-hover:animate-spin inline-block">{isDarkMode ? '☀️' : '🌙'}</span>
        </button>

        {/* Copy notification */}
        {showCopied && (
          <div className={`fixed top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-30 px-6 py-3 rounded-2xl font-bold transition-all duration-300 animate-bounce ${
            isDarkMode 
              ? 'bg-green-600/95 text-white backdrop-blur-sm shadow-lg' 
              : 'bg-green-500/95 text-white backdrop-blur-sm shadow-lg'
          }`}>
            ✅ Copied to clipboard!
          </div>
        )}

        {/* Main text display with enhanced effects */}
        <div 
          ref={textDisplayRef}
          className="w-full h-full flex items-center justify-center p-4 md:p-8 relative z-10"
          onClick={handleCopyText}
        >
          <div
            className="text-center font-black leading-tight break-words max-w-full relative cursor-pointer hover:scale-105 transition-transform duration-300"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: '1.1',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'none'
            }}
          >
            {/* Multiple shadow layers for depth */}
            <div className={`absolute inset-0 blur-lg ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-red-400/30 bg-clip-text text-transparent opacity-40' 
                : 'bg-gradient-to-r from-purple-600/25 via-pink-600/25 to-red-600/25 bg-clip-text text-transparent opacity-35'
            }`}>
              {text}
            </div>
            <div className={`absolute inset-0 blur-sm ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-red-400/20 bg-clip-text text-transparent opacity-30 animate-pulse' 
                : 'bg-gradient-to-r from-purple-600/15 via-pink-600/15 to-red-600/15 bg-clip-text text-transparent opacity-25 animate-pulse'
            }`} style={{animationDuration: '3s'}}>
              {text}
            </div>
            <div className="relative z-10 hover:animate-pulse">
              {text}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 ${themeClasses} relative overflow-hidden transition-all duration-500 ${isAnimating ? 'scale-105 opacity-50' : 'scale-100 opacity-100'}`}>
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 ${
          isDarkMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-400 to-purple-400'
        } animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 ${
          isDarkMode ? 'bg-gradient-to-r from-pink-500 to-red-500' : 'bg-gradient-to-r from-purple-400 to-pink-400'
        } animate-pulse`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 ${
          isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-pink-400 to-red-400'
        } animate-bounce`} style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDarkMode ? 'bg-white/20' : 'bg-gray-400/30'
            } animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="w-full max-w-md space-y-6 md:space-y-8 relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            ScreenFuck
          </h1>
          <p className={`text-base md:text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Make your text <span className="font-black text-pink-500">fucking huge</span>
          </p>
        </div>

        {/* Enhanced input section */}
        <div className="space-y-4 md:space-y-6">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              placeholder="Type your fucking text here..."
              className={`w-full h-32 md:h-40 px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 text-lg md:text-xl resize-none focus:outline-none focus:ring-4 transition-all duration-300 font-medium ${
                isDarkMode 
                  ? 'bg-gray-800/60 border-purple-500/30 text-white placeholder-gray-300 focus:ring-purple-500/50 focus:border-purple-400 backdrop-blur-sm shadow-2xl' 
                  : 'bg-white/90 border-gray-300 text-black placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-400 backdrop-blur-sm shadow-lg'
              }`}
              autoFocus
            />
            <div className={`absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10' 
                : 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-red-500/5'
            }`}></div>
          </div>

          <button
            onClick={handleTextSubmit}
            disabled={!text.trim()}
            className={`w-full py-3 md:py-4 px-6 md:px-8 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl group ${
              text.trim()
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-red-700 hover:shadow-purple-500/25'
                : isDarkMode 
                  ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-400/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="group-hover:animate-bounce inline-block mr-2">{isDarkMode ? '🚀' : '🚀'}</span>
            {text.trim() ? 'ScreenFuck it' : 'Enter some text first'}
          </button>
        </div>

        {/* Enhanced theme controls */}
        <div className="flex items-center justify-center space-x-4 md:space-x-6">
          <span className={`text-base md:text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Vibe:
          </span>
          <button
            onClick={toggleTheme}
            className={`flex items-center space-x-3 px-4 md:px-6 py-2 md:py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg group ${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 border border-purple-500/30' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-black hover:from-gray-200 hover:to-gray-300'
            }`}
          >
            <span className="text-xl md:text-2xl group-hover:animate-spin">{isDarkMode ? '🌙' : '☀️'}</span>
            <span className="text-base md:text-lg font-bold">
              {isDarkMode ? 'Night' : 'Day'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
