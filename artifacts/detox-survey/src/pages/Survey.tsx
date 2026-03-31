import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export type SurveyAnswers = {
  daily_screen_time: string;
  phone_vs_child: string;
  toxic_platform: string;
  detox_methods: string[];
  algo_ban_minors: string;
  last_offline_day: string;
  regret_level: string;
};

const PLATFORMS = [
  "TikTok (the digital crack pipe)",
  "Instagram (comparison machine)",
  "Twitter/X (doomscrolling HQ)",
  "Facebook (for fighting with relatives)",
  "YouTube (there goes 4 hours)",
  "Reddit (where productivity goes to die)",
  "Snapchat (for teens and… others)",
];

const DETOX_METHODS = [
  "Put my phone in another room",
  "Deleted the apps (reinstalled them 2 days later)",
  "Bought a 'dumb phone' (still have the smartphone)",
  "Set screen time limits (promptly ignored them)",
  "Told everyone I was going on a digital detox (posted about it)",
  "Went outside (briefly)",
  "Nothing — I embrace my phone addiction",
];

export default function Survey() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    daily_screen_time: "",
    phone_vs_child: "",
    toxic_platform: "",
    detox_methods: [],
    algo_ban_minors: "",
    last_offline_day: "",
    regret_level: "",
  });

  const handleCheckbox = (method: string) => {
    setAnswers((prev) => ({
      ...prev,
      detox_methods: prev.detox_methods.includes(method)
        ? prev.detox_methods.filter((m) => m !== method)
        : [...prev.detox_methods, method],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!answers.daily_screen_time.trim()) {
      setError("Please tell us how many hours a day you stare at your phone.");
      return;
    }
    if (!answers.phone_vs_child) {
      setError("Come on, phone or firstborn? Make a choice.");
      return;
    }
    if (!answers.toxic_platform) {
      setError("You must pick your most toxic platform. We know you have one.");
      return;
    }
    if (!answers.algo_ban_minors) {
      setError("Share your opinion on banning algorithms for minors.");
      return;
    }
    if (!answers.last_offline_day) {
      setError("Tell us when you last survived without a screen.");
      return;
    }
    if (!answers.regret_level) {
      setError("Rate your regret level. It's just between you and the database.");
      return;
    }

    setLoading(true);
    try {
      const { error: supabaseError } = await supabase
        .from("survey_responses")
        .insert([
          {
            daily_screen_time: answers.daily_screen_time,
            phone_vs_child: answers.phone_vs_child,
            toxic_platform: answers.toxic_platform,
            detox_methods: answers.detox_methods,
            algo_ban_minors: answers.algo_ban_minors,
            last_offline_day: answers.last_offline_day,
            regret_level: answers.regret_level,
          },
        ]);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      const encoded = encodeURIComponent(JSON.stringify(answers));
      setLocation(`/results?data=${encoded}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something broke. Shocking. Social media probably caused this too."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="text-5xl mb-4">📵</div>
          <h1 className="text-4xl font-extrabold text-red-400 mb-2 tracking-tight">
            Social Media Detox Survey
          </h1>
          <p className="text-gray-400 text-sm italic">
            For people who <em>definitely</em> don't have a problem.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Q1: Screen Time */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-bold text-yellow-400 mb-1">
              1. On average, how many hours per day do you spend on social media?
            </label>
            <p className="text-gray-500 text-xs mb-3 italic">
              Be honest. The therapist already left the room.
            </p>
            <input
              type="text"
              placeholder='e.g. "4 hours" or "I lost count after 8"'
              value={answers.daily_screen_time}
              onChange={(e) =>
                setAnswers({ ...answers, daily_screen_time: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>

          {/* Q2: Phone vs Firstborn */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-bold text-yellow-400 mb-1">
              2. If you had to choose, which would you give up first?
            </label>
            <p className="text-gray-500 text-xs mb-4 italic">
              Your firstborn or your smartphone. (Results are anonymous. Probably.)
            </p>
            <div className="space-y-3">
              {[
                { value: "phone", label: "📱 My smartphone — life goes on without kids" },
                { value: "firstborn", label: "👶 My firstborn — at least my phone doesn't cry at 3am" },
                { value: "neither", label: "🙅 I refuse to choose — send help" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${
                    answers.phone_vs_child === opt.value
                      ? "border-red-500 bg-red-950/40"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="phone_vs_child"
                    value={opt.value}
                    checked={answers.phone_vs_child === opt.value}
                    onChange={() =>
                      setAnswers({ ...answers, phone_vs_child: opt.value })
                    }
                    className="accent-red-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q3: Toxic Platform */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-bold text-yellow-400 mb-1">
              3. Which social media platform is the most toxic?
            </label>
            <p className="text-gray-500 text-xs mb-3 italic">
              Pick one. You know which one. You're probably on it right now.
            </p>
            <select
              value={answers.toxic_platform}
              onChange={(e) =>
                setAnswers({ ...answers, toxic_platform: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition appearance-none"
            >
              <option value="" disabled>
                — Select your digital nemesis —
              </option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Q4: Detox Methods Tried */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-bold text-yellow-400 mb-1">
              4. Which "detox" methods have you tried? (Check all that apply)
            </label>
            <p className="text-gray-500 text-xs mb-4 italic">
              Don't worry, we won't judge. We will, however, definitely judge.
            </p>
            <div className="space-y-3">
              {DETOX_METHODS.map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${
                    answers.detox_methods.includes(method)
                      ? "border-red-500 bg-red-950/40"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={answers.detox_methods.includes(method)}
                    onChange={() => handleCheckbox(method)}
                    className="accent-red-500 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q5: Algo ban for minors */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-bold text-yellow-400 mb-1">
              5. Should social media algorithms be banned for users under 18?
            </label>
            <p className="text-gray-500 text-xs mb-4 italic">
              The algorithm that turned you into a doom-scroller — should children be spared?
            </p>
            <div className="space-y-3">
              {[
                { value: "yes_absolutely", label: "✅ Yes — protect them before it's too late" },
                { value: "yes_but_good_luck", label: "🤷 Yes, but good luck enforcing that" },
                { value: "no_free_speech", label: "🗽 No — free speech / free market" },
                { value: "idk_too_scrolling", label: "😵 I can't focus long enough to form an opinion" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${
                    answers.algo_ban_minors === opt.value
                      ? "border-red-500 bg-red-950/40"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="algo_ban_minors"
                    value={opt.value}
                    checked={answers.algo_ban_minors === opt.value}
                    onChange={() =>
                      setAnswers({ ...answers, algo_ban_minors: opt.value })
                    }
                    className="accent-red-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q6: Last offline day */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-bold text-yellow-400 mb-1">
              6. When was the last time you went a full day without social media?
            </label>
            <p className="text-gray-500 text-xs mb-4 italic">
              "Last Tuesday" or "2019" are both valid answers.
            </p>
            <div className="space-y-3">
              {[
                { value: "recently", label: "🌿 Recently — I'm basically enlightened" },
                { value: "months_ago", label: "📅 A few months ago (it was painful)" },
                { value: "years_ago", label: "🪦 Years ago. I'm not the same person anymore." },
                { value: "never", label: "👻 Never. I was born scrolling." },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${
                    answers.last_offline_day === opt.value
                      ? "border-red-500 bg-red-950/40"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="last_offline_day"
                    value={opt.value}
                    checked={answers.last_offline_day === opt.value}
                    onChange={() =>
                      setAnswers({ ...answers, last_offline_day: opt.value })
                    }
                    className="accent-red-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q7: Regret level */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-bold text-yellow-400 mb-1">
              7. On a scale of 1–5, how much do you regret your social media habits?
            </label>
            <p className="text-gray-500 text-xs mb-4 italic">
              (1 = blissfully unaware, 5 = actively composing a goodbye post)
            </p>
            <div className="flex gap-3 flex-wrap">
              {["1", "2", "3", "4", "5"].map((num) => (
                <label key={num} className="cursor-pointer">
                  <input
                    type="radio"
                    name="regret_level"
                    value={num}
                    checked={answers.regret_level === num}
                    onChange={() =>
                      setAnswers({ ...answers, regret_level: num })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full text-xl font-bold border-2 transition ${
                      answers.regret_level === num
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : "border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {num}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 active:scale-95"
          >
            {loading ? "Saving your shame to the database…" : "Submit & Face the Truth →"}
          </button>

          <p className="text-center text-gray-600 text-xs pb-4">
            Your responses are saved to a database. Don't worry — the algorithm already knows everything about you anyway.
          </p>
        </form>
      </div>
    </div>
  );
}
