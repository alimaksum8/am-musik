import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Sparkles, Guitar, Play, Loader2, ChevronDown, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import { SPANISH_GENRES, MOODS, SPANISH_INSTRUMENTS, TEMPOS, DURATIONS } from './constants';
import { generateMusicStyle, MusicStyleParams } from './services/geminiService';

export default function App() {
  const [title, setTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedTempos, setSelectedTempos] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleInstrument = (instrument: string) => {
    setSelectedInstruments(prev =>
      prev.includes(instrument)
        ? prev.filter(i => i !== instrument)
        : [...prev, instrument]
    );
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Por favor, ingrese un título para su música.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const params: MusicStyleParams = {
        title,
        genre: selectedGenre,
        moods: selectedMoods,
        instruments: selectedInstruments,
        tempos: selectedTempos,
        duration: selectedDuration,
      };
      const generatedStyle = await generateMusicStyle(params);
      setResult(generatedStyle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-spanish-black font-sans selection:bg-spanish-orange/20">
      {/* Decorative Header */}
      <header className="relative h-64 overflow-hidden bg-spanish-black flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop" 
            alt="Spanish Guitar" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-spanish-black/80" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter mb-2">
            AM <span className="text-spanish-orange italic">MUSIK</span>
          </h1>
          <p className="text-spanish-gold font-serif italic text-lg md:text-xl tracking-widest uppercase opacity-80">
            Generador de Estilo Musical Español
          </p>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-6 md:p-8"
            >
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spanish-red mb-2">
                    Título de la Obra
                  </label>
                  <div className="relative">
                    <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spanish-orange" />
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Brisa de Sevilla"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-spanish-orange/20 focus:border-spanish-orange outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Genre Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spanish-red mb-2">
                    Género (Opcional)
                  </label>
                  <select 
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-spanish-orange/20 focus:border-spanish-orange outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar Género</option>
                    {SPANISH_GENRES.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Mood Multi-select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spanish-red mb-2">
                    Estado de Ánimo (Opcional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map(mood => (
                      <button
                        key={mood}
                        onClick={() => {
                          setSelectedMoods(prev => 
                            prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedMoods.includes(mood) 
                            ? 'bg-spanish-red text-white shadow-md' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instruments Multi-select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spanish-red mb-2">
                    Instrumentos Típicos (Opcional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SPANISH_INSTRUMENTS.map(instrument => (
                      <button
                        key={instrument}
                        onClick={() => handleToggleInstrument(instrument)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          selectedInstruments.includes(instrument)
                            ? 'bg-spanish-orange/10 border-spanish-orange text-spanish-orange'
                            : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                          selectedInstruments.includes(instrument) ? 'bg-spanish-orange border-spanish-orange' : 'border-stone-300'
                        }`}>
                          {selectedInstruments.includes(instrument) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {instrument}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tempo Multi-select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spanish-red mb-2">
                    Tempo (Opcional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TEMPOS.map(tempo => (
                      <button
                        key={tempo}
                        onClick={() => {
                          setSelectedTempos(prev => 
                            prev.includes(tempo) ? prev.filter(t => t !== tempo) : [...prev, tempo]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedTempos.includes(tempo) 
                            ? 'bg-spanish-orange text-white shadow-md' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {tempo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spanish-red mb-2">
                    Duración (Opcional)
                  </label>
                  <select 
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-spanish-orange/20 focus:border-spanish-orange outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar Duración</option>
                    {DURATIONS.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 bg-spanish-red hover:bg-spanish-red/90 disabled:bg-stone-300 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-spanish-red/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando Duende...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generar Estilo
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-red-600 text-sm text-center font-medium animate-pulse">
                    {error}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 overflow-hidden"
                >
                  <div className="bg-spanish-red px-8 py-4 flex items-center justify-between">
                    <h2 className="text-white font-serif italic text-xl">Composición Generada</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-spanish-gold/80 text-xs font-bold uppercase tracking-tighter">
                        {result ? result.trim().split(/\s+/).length : 0} Palabras
                      </span>
                      <Guitar className="text-spanish-gold w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="markdown-body">
                      <Markdown>{result}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50"
                >
                  <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                    <Play className="w-10 h-10 text-stone-300 fill-stone-300" />
                  </div>
                  <h3 className="text-2xl font-serif text-stone-400 mb-2 italic">Generador de Prompts</h3>
                  <p className="text-stone-400 max-w-xs">
                    Configure las opciones a la izquierda para generar un prompt detallado de estilo musical, ideal para guiar producciones o herramientas de creación musical.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-12 text-center text-stone-400 text-sm border-t border-stone-200 mt-12">
        <p>&copy; 2026 AM MUSIK. Inspirado por el alma de España.</p>
      </footer>
    </div>
  );
}
