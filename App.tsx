import React, { useState } from 'react';
import { Search, Loader2, Utensils, Leaf, Droplet, Zap, Flame, Info, Settings, RefreshCw } from 'lucide-react';
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
      // Show the actual error message to the user (e.g., "API Key missing")
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const isApiKeyError = error?.includes('API Key');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
              <Leaf size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">NutriScan AI</h1>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Search Section */}
        <section className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            What are you eating?
          </h2>
          <p className="text-slate-500 mb-8 text-lg">
            Enter any food item or meal to instantly get a detailed nutritional breakdown.
          </p>
          
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 1 avocado toast, large pepperoni pizza, grilled salmon..."
              className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-300"
              disabled={loadingState === LoadingState.LOADING}
            />
            <button
              type="submit"
              disabled={loadingState === LoadingState.LOADING || !query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-6 rounded-xl font-medium transition-all flex items-center gap-2"
            >
              {loadingState === LoadingState.LOADING ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className={`max-w-2xl mx-auto p-6 rounded-2xl border ${isApiKeyError ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-100'} mb-8`}>
             <div className="flex items-start gap-4">
               <div className={`p-2 rounded-full ${isApiKeyError ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-600'}`}>
                 {isApiKeyError ? <Settings size={24} /> : <Info size={24} />}
               </div>
               <div className="flex-1">
                 <h3 className={`font-bold text-lg mb-1 ${isApiKeyError ? 'text-slate-800' : 'text-red-800'}`}>
                   {isApiKeyError ? 'Configuration Required' : 'Analysis Failed'}
                 </h3>
                 <p className={`${isApiKeyError ? 'text-slate-600' : 'text-red-700'} mb-4`}>
                   {error}
                 </p>
                 
                 {isApiKeyError && (
                   <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-600 space-y-3">
                     <p className="font-semibold text-slate-800">How to fix this in Vercel:</p>
                     <ol className="list-decimal pl-5 space-y-2">
                       <li>Go to your Vercel Dashboard and select this project.</li>
                       <li>Navigate to <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">Settings</span> &gt; <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">Environment Variables</span>.</li>
                       <li>Add a new variable with Key: <span className="font-mono font-bold text-emerald-600">API_KEY</span></li>
                       <li>Paste your Google Gemini API Key as the Value.</li>
                       <li className="font-semibold text-amber-600">Important: Go to 'Deployments' and Redeploy for changes to apply.</li>
                     </ol>
                   </div>
                 )}

                 {!isApiKeyError && (
                   <button 
                     onClick={(e) => handleSearch(e as any)}
                     className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1"
                   >
                     <RefreshCw size={14} /> Try Again
                   </button>
                 )}
               </div>
             </div>
          </div>
        )}

        {/* Results Section */}
        {loadingState === LoadingState.SUCCESS && nutritionData && (
          <div className="animate-fade-in-up space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-3">
                  <Utensils size={14} />
                  {nutritionData.servingSize}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 capitalize mb-2">{nutritionData.foodName}</h3>
                <p className="text-slate-500 max-w-md">{nutritionData.healthTip}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-orange-50 rounded-2xl p-6 border border-orange-100 min-w-[160px]">
                <Flame className="text-orange-500 mb-2 h-8 w-8" />
                <span className="text-4xl font-black text-orange-600 tracking-tighter">{nutritionData.calories}</span>
                <span className="text-orange-400 font-medium text-sm uppercase tracking-wide">Calories</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Macro Chart Column */}
              <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  Macro Breakdown
                </h4>
                <div className="flex-1 flex items-center justify-center">
                  <NutritionChart data={nutritionData} />
                </div>
              </div>

              {/* Detailed Stats Grid */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
                <NutritionCard 
                  label="Protein" 
                  value={nutritionData.protein} 
                  unit="g" 
                  colorClass="text-emerald-600"
                  icon={<Zap className="w-5 h-5 text-emerald-600" />} 
                />
                <NutritionCard 
                  label="Carbs" 
                  value={nutritionData.carbs} 
                  unit="g" 
                  colorClass="text-blue-600"
                  icon={<Zap className="w-5 h-5 text-blue-600" />} 
                />
                <NutritionCard 
                  label="Fat" 
                  value={nutritionData.fat} 
                  unit="g" 
                  colorClass="text-amber-500"
                  icon={<Droplet className="w-5 h-5 text-amber-500" />} 
                />
                <NutritionCard 
                  label="Fiber" 
                  value={nutritionData.fiber} 
                  unit="g" 
                  colorClass="text-slate-600" 
                />
                <NutritionCard 
                  label="Sugar" 
                  value={nutritionData.sugar} 
                  unit="g" 
                  colorClass="text-pink-500" 
                />
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                   <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Density</p>
                   <p className="text-sm text-slate-600">
                     <span className="font-semibold text-slate-800">{(nutritionData.calories / 100).toFixed(1)}</span> kcal/g (approx)
                   </p>
                </div>
              </div>
            </div>
            
          </div>
        )}
        
        {loadingState === LoadingState.IDLE && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-slate-400 opacity-60">
             <div className="flex flex-col items-center">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                 <Search size={20} />
               </div>
               <p className="text-sm">Search any food</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                 <Zap size={20} />
               </div>
               <p className="text-sm">Instant Analysis</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                 <Leaf size={20} />
               </div>
               <p className="text-sm">Health Insights</p>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;