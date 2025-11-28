import React, { useState } from 'react';
import { Search, Loader2, Sparkles, AlertCircle, ArrowRight, Activity, Flame, ChevronRight } from 'lucide-react';
import { analyzeFood } from './services/geminiService';
import { NutritionData, LoadingState } from './types';
import { NutritionChart } from './components/NutritionChart';
import { NutritionCard } from './components/NutritionCard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoadingState(LoadingState.LOADING);
    setError(null);
    setNutritionData(null);

    try {
      const data = await analyzeFood(query);
      setNutritionData(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setLoadingState(LoadingState.ERROR);
    }
  };

  // Case-insensitive check for "api key" to match both our custom errors and Google's raw errors
  const isApiKeyError = error?.toLowerCase().includes('api key');

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col items-center">
      
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-emerald-500 to-cyan-500 p-2 rounded-lg">
            <Activity className="text-slate-950" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">NutriScan<span className="text-emerald-400">AI</span></span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-400">
          <span>Model: Gemini 2.0 Flash</span>
          <div className="w-px h-4 bg-slate-800"></div>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Operational
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col">
        
        {/* Hero Section */}
        <section className={`transition-all duration-700 ease-out ${nutritionData ? 'mb-8' : 'flex-1 flex flex-col justify-center items-center text-center -mt-20'}`}>
          <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className={`font-extrabold tracking-tight transition-all duration-500 ${nutritionData ? 'text-2xl text-left' : 'text-5xl sm:text-6xl'}`}>
              <span className={nutritionData ? 'text-white' : 'text-gradient'}>
                {nutritionData ? 'Analysis Results' : 'Know Your Food.'}
              </span>
              {!nutritionData && <span className="block text-white mt-2">Instantly.</span>}
            </h1>
            
            {!nutritionData && (
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                Powered by advanced AI to breakdown calories, macros, and health insights for any meal you can imagine.
              </p>
            )}

            {/* Search Input */}
            <form onSubmit={handleSearch} className={`relative group transition-all duration-500 ${nutritionData ? 'w-full' : 'w-full max-w-lg mx-auto mt-8'}`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors ${loadingState === LoadingState.LOADING ? 'text-emerald-500' : 'text-slate-500 group-focus-within:text-emerald-400'}`} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What did you eat today?"
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl py-4 pl-12 pr-32 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg placeholder:text-slate-600 backdrop-blur-sm"
                disabled={loadingState === LoadingState.LOADING}
              />
              <div className="absolute right-2 top-2 bottom-2">
                <button
                  type="submit"
                  disabled={loadingState === LoadingState.LOADING || !query.trim()}
                  className="h-full px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingState === LoadingState.LOADING ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      <span>Scan</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Error Display */}
        {loadingState === LoadingState.ERROR && (
          <div className="animate-slide-up glass-panel p-6 rounded-2xl border-l-4 border-l-red-500 flex gap-4 items-start">
            <div className="bg-red-500/10 p-2 rounded-full text-red-500">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-white mb-1">Analysis Failed</h3>
              <p className="text-slate-400 mb-4">{error}</p>
              {isApiKeyError && (
                 <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-sm space-y-2">
                   <p className="font-mono text-emerald-400 font-bold">Vercel Configuration Required:</p>
                   <ul className="list-disc list-inside text-slate-400 space-y-1 ml-1">
                     <li>Check your Vercel Project Settings</li>
                     <li>Ensure <span className="text-slate-200 font-mono">API_KEY</span> value has no extra spaces</li>
                     <li>Ensure there are no quotes (e.g. use <span className="text-slate-200 font-mono">AIza...</span> not <span className="text-slate-200 font-mono">"AIza..."</span>)</li>
                   </ul>
                   <p className="text-slate-500 text-xs mt-2">After updating, go to deployments and redeploy.</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {loadingState === LoadingState.SUCCESS && nutritionData && (
          <div className="animate-slide-up space-y-6 pb-20">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Main Info Card */}
              <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={120} className="text-white" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4 border border-emerald-500/20">
                    {nutritionData.servingSize}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 capitalize leading-tight">
                    {nutritionData.foodName}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-emerald-500/50 pl-4 mt-4">
                    {nutritionData.healthTip}
                  </p>
                </div>
              </div>

              {/* Calories Card */}
              <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 font-medium">Total Energy</span>
                  <Flame className="text-orange-500" />
                </div>
                <div className="mt-4">
                  <span className="text-6xl font-bold text-white tracking-tighter">{nutritionData.calories}</span>
                  <span className="text-xl text-slate-500 ml-2 font-medium">kcal</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   {/* Visual bar just for aesthetic, assumed 800kcal max for visual scale */}
                   <div 
                     className="h-full bg-gradient-to-r from-orange-600 to-yellow-500 rounded-full" 
                     style={{ width: `${Math.min((nutritionData.calories / 800) * 100, 100)}%` }}
                   ></div>
                </div>
              </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center md:col-span-1 min-h-[300px]">
                <h3 className="w-full text-left font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" />
                  Macro Distribution
                </h3>
                <NutritionChart data={nutritionData} />
              </div>

              {/* Stat Cards */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <NutritionCard 
                  label="Protein" 
                  value={nutritionData.protein} 
                  unit="g" 
                  color="text-emerald-400" 
                  bg="bg-emerald-500/10"
                  delay="delay-100"
                />
                <NutritionCard 
                  label="Carbs" 
                  value={nutritionData.carbs} 
                  unit="g" 
                  color="text-blue-400" 
                  bg="bg-blue-500/10"
                  delay="delay-200"
                />
                <NutritionCard 
                  label="Fats" 
                  value={nutritionData.fat} 
                  unit="g" 
                  color="text-amber-400" 
                  bg="bg-amber-500/10"
                  delay="delay-300"
                />
                <NutritionCard 
                  label="Fiber" 
                  value={nutritionData.fiber} 
                  unit="g" 
                  color="text-purple-400" 
                  bg="bg-purple-500/10"
                  delay="delay-100"
                />
                <NutritionCard 
                  label="Sugar" 
                  value={nutritionData.sugar} 
                  unit="g" 
                  color="text-pink-400" 
                  bg="bg-pink-500/10"
                  delay="delay-200"
                />
                
                {/* Density Metric */}
                <div className="glass-card p-4 rounded-2xl flex flex-col justify-center animate-slide-up delay-300 border-l-2 border-slate-700">
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Density</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-200">
                      {(nutritionData.calories / (parseFloat(nutritionData.servingSize.match(/\d+/)?.[0] || '100') || 100)).toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500">cal/g</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;