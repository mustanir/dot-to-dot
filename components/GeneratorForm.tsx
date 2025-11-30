
import React, { useState, FormEvent } from 'react';
import { Lightbulb, Wand2, Loader2 } from 'lucide-react';
import { Difficulty } from '../types';

interface GeneratorFormProps {
    onGenerate: (category: string, count: number, difficulty: Difficulty) => void;
    isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
    const [category, setCategory] = useState('');
    const [count, setCount] = useState(10);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (category.trim() && count > 0) {
            onGenerate(category, count, difficulty);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 sticky top-24">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                        Book Category
                    </label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Farm Animals, Dinosaurs"
                        className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        disabled={isLoading}
                    />
                    <div className="flex items-start text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded-md">
                        <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>This will be the theme for your entire book, from cover to content.</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700">
                        Difficulty
                    </label>
                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={isLoading}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="count" className="block text-sm font-medium text-slate-700">
                        Number of Dot-to-Dot Pages
                    </label>
                    <input
                        type="number"
                        id="count"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value, 10))}
                        min="1"
                        max="50"
                        className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !category.trim()}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-5 w-5" />
                            Generate Book
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default GeneratorForm;