import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { SurveyAnswers } from "./Survey";

type ResultCategory = {
  title: string;
  emoji: string;
  description: string;
  advice: string;
  color: string;
};

function getResult(answers: SurveyAnswers): ResultCategory {
  const screenHours = parseFloat(answers.daily_screen_time) || 0;
  const regret = parseInt(answers.regret_level) || 1;
  const neverOffline = answers.last_offline_day === "never";
  const noDetox = answers.detox_methods.includes("Nothing — I embrace my phone addiction");

  const score =
    (screenHours >= 6 ? 2 : screenHours >= 3 ? 1 : 0) +
    (regret >= 4 ? 2 : regret >= 3 ? 1 : 0) +
    (neverOffline ? 2 : 0) +
    (noDetox ? 1 : 0) +
    (answers.phone_vs_child === "phone" ? 1 : 0);

  if (score >= 7) {
    return {
      title: "Terminal Scroll Syndrome",
      emoji: "☠️",
      description:
        "Congratulations. You have achieved a level of social media dependency that scientists are studying from a safe distance. Your phone is basically a third arm at this point, and your attention span is shorter than a TikTok transition effect. Historians will note that you were present for everything — through a screen.",
      advice:
        "Immediate action required: Put the phone down. No, seriously. After you screenshot these results to post, obviously.",
      color: "red",
    };
  } else if (score >= 5) {
    return {
      title: "Chronically Online",
      emoji: "🧟",
      description:
        "You're not quite in crisis mode, but you're definitely one viral tweet away from losing an hour of your life. You've tried quitting — bless your heart — but here you are, surveying your own screen addiction instead of, you know, not being on a screen.",
      advice:
        "Try this: Set one hour a day as phone-free. Use it to remember what boredom feels like. It's actually fine.",
      color: "orange",
    };
  } else if (score >= 3) {
    return {
      title: "Casually Compromised",
      emoji: "🌀",
      description:
        "You're in the gray zone — aware enough to take this survey, addicted enough to need it. You have a somewhat healthy relationship with social media in the same way one has a 'somewhat healthy' relationship with fast food: fine until it isn't.",
      advice:
        "You're doing okay. Just keep asking yourself: 'Would I be embarrassed if someone saw my screen time report?' If yes — act accordingly.",
      color: "yellow",
    };
  } else {
    return {
      title: "Deceptively Functional",
      emoji: "🌱",
      description:
        "Either you have genuinely good digital habits, or you lied on every question. Either way, you're presenting well. Your relationship with social media seems relatively healthy — or at least healthy enough that you can take a survey about it without having an existential crisis.",
      advice:
        "Keep it up. Or not. You clearly have the self-control to make your own decisions, which is honestly more than most people here.",
      color: "green",
    };
  }
}

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  red: {
    bg: "bg-red-950/40",
    border: "border-red-700",
    text: "text-red-400",
    badge: "bg-red-900 text-red-300",
  },
  orange: {
    bg: "bg-orange-950/40",
    border: "border-orange-700",
    text: "text-orange-400",
    badge: "bg-orange-900 text-orange-300",
  },
  yellow: {
    bg: "bg-yellow-950/40",
    border: "border-yellow-700",
    text: "text-yellow-400",
    badge: "bg-yellow-900 text-yellow-300",
  },
  green: {
    bg: "bg-green-950/40",
    border: "border-green-700",
    text: "text-green-400",
    badge: "bg-green-900 text-green-300",
  },
};

export default function Results() {
  const [location, setLocation] = useLocation();
  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);
  const [result, setResult] = useState<ResultCategory | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("data");
    if (raw) {
      try {
        const parsed: SurveyAnswers = JSON.parse(decodeURIComponent(raw));
        setAnswers(parsed);
        setResult(getResult(parsed));
      } catch {
        setLocation("/");
      }
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  if (!answers || !result) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Loading your diagnosis…
      </div>
    );
  }

  const colors = colorMap[result.color];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-extrabold text-red-400 mb-2">Your Results Are In</h1>
          <p className="text-gray-500 text-sm italic">
            The data doesn't lie. (Unlike your screen time.)
          </p>
        </header>

        {/* Main Result Card */}
        <div className={`rounded-2xl p-6 border ${colors.bg} ${colors.border}`}>
          <div className={`text-2xl font-extrabold mb-3 ${colors.text}`}>{result.title}</div>
          <p className="text-gray-300 leading-relaxed mb-4">{result.description}</p>
          <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
            💡 Advice
          </div>
          <p className="text-gray-300 text-sm mt-2 italic">{result.advice}</p>
        </div>

        {/* Your Answers Summary */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-lg font-bold text-yellow-400 mb-4">Your Confession Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">📱 Daily screen time:</span>
              <span className="text-gray-200">{answers.daily_screen_time}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">👶 Phone vs firstborn:</span>
              <span className="text-gray-200 capitalize">
                {answers.phone_vs_child === "phone"
                  ? "Phone — the phone stays 📱"
                  : answers.phone_vs_child === "firstborn"
                  ? "Firstborn — (questionable parenting)"
                  : "Refused to choose — coward"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">☠️ Most toxic platform:</span>
              <span className="text-gray-200">{answers.toxic_platform}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">🧪 Detox attempts:</span>
              {answers.detox_methods.length > 0 ? (
                <ul className="ml-4 space-y-1">
                  {answers.detox_methods.map((m) => (
                    <li key={m} className="text-gray-300">• {m}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 ml-4 italic">None attempted. Admirable honesty.</span>
              )}
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">🏛️ Algo ban for minors:</span>
              <span className="text-gray-200 capitalize">
                {answers.algo_ban_minors
                  .replace(/_/g, " ")
                  .replace("yes absolutely", "Yes — protect the children")
                  .replace("yes but good luck", "Yes, but good luck")
                  .replace("no free speech", "No — free market")
                  .replace("idk too scrolling", "Can't focus enough to have an opinion")}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">🏕️ Last offline day:</span>
              <span className="text-gray-200 capitalize">
                {answers.last_offline_day
                  .replace("recently", "Recently (suspicious)")
                  .replace("months_ago", "A few months ago")
                  .replace("years_ago", "Years ago (RIP)")
                  .replace("never", "Never. Born scrolling.")}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">😬 Regret level:</span>
              <span className="text-gray-200">
                {answers.regret_level}/5{" "}
                {answers.regret_level === "5"
                  ? "— deeply, personally, spiritually regretful"
                  : answers.regret_level === "1"
                  ? "— blissful ignorance is truly a superpower"
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Fun Stat */}
        <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800 text-center">
          <p className="text-gray-500 text-xs mb-1">🧠 FUN FACT</p>
          <p className="text-gray-300 text-sm">
            The average person spends <strong className="text-white">6+ years</strong> of their life on social media.
            That's enough time to learn 3 languages, earn a master's degree, or simply exist.
          </p>
        </div>

        <button
          onClick={() => setLocation("/")}
          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-4 rounded-2xl text-base transition-all duration-200 active:scale-95"
        >
          ← Take the Survey Again (You Won't)
        </button>

        <p className="text-center text-gray-700 text-xs pb-6">
          Your response has been saved. Somewhere, in a database, your phone addiction lives forever.
        </p>
      </div>
    </div>
  );
}
