import { useState } from "react";
import { analyzeText, AnalysisResult } from "./analyzer";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    // Small delay for UX feedback
    setTimeout(() => {
      const analysisResult = analyzeText(text);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                ЛингвоСкрин
              </h1>
              <p className="text-sm text-slate-500">
                Проверка текста на соответствие ФЗ «О рекламе»
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          <label
            htmlFor="text-input"
            className="block text-base font-semibold text-slate-700 mb-3"
          >
            Введите текст для проверки
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (result) setResult(null);
            }}
            placeholder="Вставьте или введите рекламный текст, который нужно проверить на наличие потенциальных нарушений ФЗ «О рекламе»…"
            className="w-full h-52 sm:h-64 p-4 border border-slate-300 rounded-xl text-slate-800 text-base leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all"
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
              className="flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold rounded-xl shadow-md shadow-blue-200 disabled:shadow-none transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Анализируем…
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Проверить текст
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-xl transition-colors cursor-pointer"
            >
              Очистить
            </button>
            <span className="sm:ml-auto text-sm text-slate-400">
              {text.length > 0 ? `${text.length} симв.` : ""}
            </span>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-7 space-y-5">
            {/* No violations */}
            {!result.hasViolations && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-emerald-800 mb-2">
                      Нарушений не обнаружено
                    </h2>
                    <p className="text-emerald-700 leading-relaxed">
                      В тексте не обнаружено потенциальных нарушений. Риск
                      низкий. Текст соответствует требованиям законодательства о
                      рекламе и может быть рекомендован к публикации без
                      доработки.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Misleading violations */}
            {result.misleadingViolations.length > 0 && (
              <ViolationsCard
                title="Недостоверная или недобросовестная реклама"
                icon={
                  <svg
                    className="w-7 h-7 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                }
                violations={result.misleadingViolations}
                colorScheme="red"
                generateMessage={(count, phrases) =>
                  `В тексте зафиксировано ${count} потенциальных нарушений, относящихся к категории недостоверной или недобросовестной рекламе. Среди нарушений фраза(ы): ${phrases
                    .map((p) => `«${p}»`)
                    .join(", ")}. Рекомендуется проверить выделенный(е) фрагмент(ы) и отредактировать их для приведения текста в соответствие с требованиями ФЗ «О рекламе».`
                }
              />
            )}

            {/* Manipulation violations */}
            {result.manipulationViolations.length > 0 && (
              <ViolationsCard
                title="Манипуляции пользователем"
                icon={
                  <svg
                    className="w-7 h-7 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                }
                violations={result.manipulationViolations}
                colorScheme="amber"
                generateMessage={(count, phrases) =>
                  `В тексте зафиксировано ${count} потенциальных нарушений, относящихся к категории манипуляций пользователем. Среди нарушений фраза(ы): ${phrases
                    .map((p) => `«${p}»`)
                    .join(", ")}. Рекомендуется проверить выделенный(е) фрагмент(ы) и отредактировать их для приведения текста в соответствие с требованиями ФЗ «О рекламе».`
                }
              />
            )}

            {/* Highlighted text */}
            {result.hasViolations && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Текст с выделенными фрагментами
                </h3>
                <div className="flex gap-4 mb-3 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded bg-red-200 border border-red-300"></span>
                    Недостоверная реклама
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded bg-amber-200 border border-amber-300"></span>
                    Манипуляции пользователем
                  </span>
                </div>
                <div
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-base leading-relaxed whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: result.highlightedText,
                  }}
                />
              </div>
            )}

            {/* Summary stats */}
            {result.hasViolations && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Всего нарушений"
                  value={
                    result.misleadingViolations.length +
                    result.manipulationViolations.length
                  }
                  color="slate"
                />
                <StatCard
                  label="Недостоверная реклама"
                  value={result.misleadingViolations.length}
                  color="red"
                />
                <StatCard
                  label="Манипуляции"
                  value={result.manipulationViolations.length}
                  color="amber"
                />
              </div>
            )}
          </div>
        )}

        {/* Info section */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            О сервисе
          </h3>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">
                Что проверяем
              </h4>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
                  Недостоверные утверждения и суперлативы (лучший, №1, лидер
                  рынка и др.)
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                  Манипулятивные приёмы (только сегодня,
                  последний шанс и др.)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">
                Основание
              </h4>
              <p>
                Проверка основана на требованиях Федерального закона «О
                рекламе» (ФЗ-38). Сервис выявляет паттерны, которые могут
                квалифицироваться как недостоверная, недобросовестная реклама
                или манипуляции. Результаты носят рекомендательный характер.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 text-center text-sm text-slate-400">
          ЛингвоСкрин — инструмент предварительной проверки рекламных текстов.
          Не является юридической консультацией.
        </div>
      </footer>
    </div>
  );
}

/* ---- Sub-components ---- */

interface ViolationsCardProps {
  title: string;
  icon: React.ReactNode;
  violations: { phrase: string }[];
  colorScheme: "red" | "amber";
  generateMessage: (count: number, phrases: string[]) => string;
}

function ViolationsCard({
  title,
  icon,
  violations,
  colorScheme,
  generateMessage,
}: ViolationsCardProps) {
  const colorMap = {
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      titleColor: "text-red-800",
      textColor: "text-red-700",
      badge: "bg-red-100 text-red-700 border-red-200",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      titleColor: "text-amber-800",
      textColor: "text-amber-700",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };
  const c = colorMap[colorScheme];

  const uniquePhrases = [...new Set(violations.map((v) => v.phrase))];

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-6 sm:p-7`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full ${c.iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`text-lg font-bold ${c.titleColor} mb-2`}>
            {title}
          </h2>
          <p className={`${c.textColor} leading-relaxed mb-4`}>
            {generateMessage(violations.length, uniquePhrases)}
          </p>
          <div className="flex flex-wrap gap-2">
            {uniquePhrases.map((phrase, i) => (
              <span
                key={i}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${c.badge}`}
              >
                «{phrase}»
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: "slate" | "red" | "amber";
}

function StatCard({ label, value, color }: StatCardProps) {
  const colorMap = {
    slate: "text-slate-700",
    red: "text-red-600",
    amber: "text-amber-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
      <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}
