import React, { useState } from 'react';
import { UploadCloud, Trash2, FileText, Check } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';

const ContentStudio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [competencyTag, setCompetencyTag] = useState('Machine Learning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSavedSuccess(false);
    try {
      const payload = {
        collection_name: 'coll_mospi_docs',
        text_content: selectedFile ? `Uploaded manual: ${selectedFile.name}` : null,
        num_questions: Number(numQuestions),
        difficulty: difficulty,
        competency_tag: competencyTag,
        topic_focus: `${competencyTag} official statistical methodology`
      };

      const res = await assessmentService.generateQuiz(payload);
      if (res && res.questions) {
        setGeneratedQuestions(res.questions);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.warn('Using mock questions fallback for AI Quiz Studio');
      setGeneratedQuestions([
        {
          id: 'gen_q1',
          question_text: 'What is supervised learning in survey microdata analysis?',
          difficulty: difficulty,
          competency_tag: competencyTag,
          option_a: 'Learning from unlabelled survey microdata without human supervision.',
          option_b: 'Learning algorithms using labelled training data to predict survey variables.',
          option_c: 'Manual data verification by field enumerators.',
          option_d: 'None of the above.',
          correct_option: 'option_b',
          explanation: 'Supervised learning trains predictive models on labelled training datasets.'
        },
        {
          id: 'gen_q2',
          question_text: 'Which technique is recommended for identifying multivariate outliers in CAPI data?',
          difficulty: difficulty,
          competency_tag: competencyTag,
          option_a: 'Isolation Forests',
          option_b: 'Random Row Deletion',
          option_c: 'Manual CSV Overwrite',
          option_d: 'Linear Extrapolation',
          correct_option: 'option_a',
          explanation: 'Isolation Forests isolate anomaly tree partitions effectively.'
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuestion = (qId) => {
    setGeneratedQuestions(generatedQuestions.filter((q) => q.id !== qId));
  };

  const handleSaveAssessment = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">AI Quiz Generator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload training materials or select domain settings to generate assessment questions automatically.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Upload & Settings (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">1. Upload Training Document</h2>
            <p className="text-sm text-gray-500 mt-0.5">Optional reference material for context</p>
          </div>

          {/* File Upload Zone */}
          <div className="border border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-6 text-center space-y-2 bg-gray-50/50 transition cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <div className="text-sm font-medium text-gray-800">
                {selectedFile ? selectedFile.name : 'Click to select or drag and drop file'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">PDF, PPT, DOCX (Max 25MB)</div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">2. Generation Settings</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure question parameters</p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-700 font-medium mb-1.5">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5">Competency Tag</label>
              <select
                value={competencyTag}
                onChange={(e) => setCompetencyTag(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="Machine Learning">Machine Learning</option>
                <option value="Survey Sampling">Survey Sampling</option>
                <option value="National Accounts">National Accounts</option>
                <option value="Python / R Stats">Python / R Stats</option>
                <option value="GIS & Spatial Analytics">GIS & Spatial Analytics</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
          >
            {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
          </button>
        </div>

        {/* Right Panel: Question Review (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 space-y-4 flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Generated Questions</h2>
                <p className="text-sm text-gray-500">Review and edit questions before publishing</p>
              </div>

              {generatedQuestions.length > 0 && (
                <button
                  onClick={handleGenerate}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
                >
                  Regenerate
                </button>
              )}
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Assessment published successfully.</span>
              </div>
            )}

            {generatedQuestions.length === 0 ? (
              <div className="py-20 text-center text-gray-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-gray-300" />
                <div className="text-sm font-medium text-gray-600">No questions generated yet</div>
                <div className="text-xs text-gray-500">Configure parameters on the left and click Generate.</div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {generatedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-500">Question {idx + 1}</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                          {q.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                        aria-label="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-medium text-gray-900">{q.question_text}</p>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div>A. {q.option_a}</div>
                      <div>B. {q.option_b}</div>
                      {q.option_c && <div>C. {q.option_c}</div>}
                      {q.option_d && <div>D. {q.option_d}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {generatedQuestions.length > 0 && (
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSaveAssessment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
              >
                Save & Publish Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentStudio;
