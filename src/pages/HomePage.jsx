import React, { useRef, useState } from "react";
import ProjectOverviewCard from "../components/ProjectOverviewCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

/* ─── Workflow step data ─────────────────────────────────────── */
const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Data Acquisition",
    desc: "Collect MRI scans & CHAT transcripts",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Input & Validation",
    desc: "Format check & integrity verification",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Audio Extraction",
    desc: "Pause, rate & duration features",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.51-.814-1.51-1.82v-3.22c0-1.006.63-1.82 1.51-1.82H6.75z"
        />
      </svg>
    ),
  },
  {
    num: "04",
    title: "MRI Preprocessing",
    desc: "Skull strip, normalize & segment",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Feature Scaling",
    desc: "Transform & normalise feature vectors",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
        />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Deep Learning",
    desc: "Multimodal neural network inference",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
  },
  {
    num: "07",
    title: "Fusion Layer",
    desc: "Combine modalities for joint decision",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
  },
  {
    num: "08",
    title: "Prediction Output",
    desc: "Class label + confidence score",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
];

/* ─── WorkflowCard ─────────────────────────────────────────────── */
function WorkFlowCard({ num, title, desc, icon }) {
  return (
    <div className="workflowcard group relative flex flex-col gap-3 bg-white border border-[#6DA179]/20 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-[#6DA179]/50 hover:-translate-y-1.5 transition-all duration-300 cursor-default min-w-0 w-full h-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest text-[#6DA179]/40 poppins-semibold">
          {num}
        </span>
        <div className="w-9 h-9 rounded-xl bg-[#f1ffef] flex items-center justify-center text-[#6DA179] group-hover:bg-[#6DA179] group-hover:text-white transition-colors duration-300 flex-shrink-0">
          {icon}
        </div>
      </div>
      <p className="poppins-semibold text-sm text-gray-800 leading-snug">
        {title}
      </p>
      <p className="poppins-light text-xs text-gray-400 leading-relaxed">
        {desc}
      </p>
      <div className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[#6DA179]/0 to-transparent group-hover:via-[#6DA179]/50 transition-all duration-500" />
    </div>
  );
}

/* ─── HomePage ─────────────────────────────────────────────────── */
function HomePage() {
  const [mriSrc, setMriSrc] = useState(null);
  const [chaFile, setChaFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const canvasRef = useRef(null);
  const mriFileRef = useRef(null);
  const chaFileRef = useRef(null);

  const speechData = [
    { name: "Pause Count", value: 0.92 },
    { name: "Speech Time", value: 0.85 },
    { name: "Pause Ratio", value: 0.7 },
    { name: "Pause Time", value: 0.58 },
    { name: "Speech Rate", value: 0.45 },
    { name: "Word Duration", value: 0.35 },
  ];

  const mriData = [
    { name: "Hippocampus", value: 0.88 },
    { name: "Temporal Lobe", value: 0.8 },
    { name: "Cortical Thickness", value: 0.65 },
    { name: "Ventricles", value: 0.55 },
    { name: "Brain Volume", value: 0.5 },
  ];

  /* ── Hero animations ── */
  useGSAP(() => {
    gsap.fromTo(
      ".header-1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, ease: "expo.inOut", duration: 1.2, stagger: 0.4 },
    );
    gsap.fromTo(
      ".herobox1",
      { y: 0 },
      {
        y: 100,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#section1",
          start: "top top",
          end: "+=400",
          scrub: 1,
        },
      },
    );
    gsap.fromTo(
      ".herobox4",
      { y: 0 },
      {
        y: -100,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#section1",
          start: "top top",
          end: "+=400",
          scrub: 1,
        },
      },
    );
    gsap.fromTo(
      ".overview-cards",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#section2",
          start: "top 2%",
          end: "+=10",
          scrub: 1,
        },
        stagger: 0.5,
      },
    );
  }, []);

  /* ── Workflow: stagger cards in on scroll ── */
  useGSAP(() => {
    gsap.fromTo(
      ".workflowcard",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: "#section3",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, []);

  function onMRI(e) {
    const file = e.target.files[0];
    if (!file) return;
    mriFileRef.current = file;
    const reader = new FileReader();
    reader.onload = (ev) => setMriSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  function onCHA(e) {
    const file = e.target.files[0];
    if (!file) return;
    chaFileRef.current = file;
    setChaFile(file.name);
    setTimeout(() => drawWave(canvasRef.current), 50);
  }

  function drawWave(canvas) {
    if (!canvas) return;
    const W = canvas.parentElement.offsetWidth - 32;
    const H = 64;
    canvas.width = W * 2;
    canvas.height = H * 2;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    const bars = Math.floor(W / 4);
    for (let i = 0; i < bars; i++) {
      const seed = Math.sin(i * 0.4) * Math.cos(i * 0.13) * Math.sin(i * 0.07);
      const h = 8 + Math.abs(seed) * (H * 0.7) + Math.random() * 6;
      const y = (H - h) / 2;
      ctx.fillStyle = i % 3 === 0 ? "#6DA179" : "rgba(109,161,121,0.4)";
      ctx.beginPath();
      ctx.roundRect(i * 4, y, 2.5, h, 2);
      ctx.fill();
    }
  }

  async function analyze() {
    if (!mriFileRef.current || !chaFileRef.current) return;
    setAnalyzing(true);
    setResult(null);
    const formData = new FormData();
    formData.append("mri_file", mriFileRef.current);
    formData.append("cha_file", chaFileRef.current);
    try {
      const res = await fetch(
        "https://mri-pause-d10.onrender.com/predict/cnn-cha-fusion",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!res.ok) {
        // HTTP error (4xx/5xx)
        setResult({ error: true, errorMsg: `Server returned ${res.status}` });
        return;
      }
      const raw = await res.json();
      // Normalise backend response → internal shape
      // Backend returns: Prediction, P(Control), P(MCI), speech_features, etc.
      const prediction = raw.Prediction ?? raw.class ?? null;
      const pControl = parseFloat(raw["P(Control)"] ?? 0) * 100;
      const pMCI = parseFloat(raw["P(MCI)"] ?? 0) * 100;
      const isControl = prediction === "Control";
      const confidence = isControl ? pControl : pMCI;
      const data = {
        class: isControl ? "Non Demented" : "Mild Demented",
        confidence: parseFloat(confidence.toFixed(1)),
        all_scores: {
          Control: parseFloat(pControl.toFixed(1)),
          MCI: parseFloat(pMCI.toFixed(1)),
        },
        speech_features: raw.speech_features ?? null,
        raw_prediction: prediction,
      };
      setResult(data);
    } catch (err) {
      console.error("Backend error:", err);
      // Network error or backend unreachable
      setResult({
        error: true,
        errorMsg:
          "Could not reach the backend. Make sure the server is running.",
      });
    } finally {
      setAnalyzing(false);
    }
  }

  const classColor = {
    "Non Demented": {
      bg: "bg-[#f1ffef]",
      border: "border-[#6DA179]/40",
      text: "text-[#3a7a4a]",
      bar: "bg-[#6DA179]",
    },
    "Very Mild Demented": {
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      text: "text-yellow-700",
      bar: "bg-yellow-400",
    },
    "Mild Demented": {
      bg: "bg-orange-50",
      border: "border-orange-300",
      text: "text-orange-700",
      bar: "bg-orange-400",
    },
    "Moderate Demented": {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-600",
      bar: "bg-red-400",
    },
  };
  const rc = result?.class
    ? (classColor[result.class] ?? classColor["Non Demented"])
    : classColor["Non Demented"];

  // FIX: keys aligned with _main_features.py output.
  // Removed 'total_words' (not in backend response).
  // Fixed 'pause_per_word' → 'pause_per_word_ratio'.
  const speechRows = [
    ["Word Count", "word_count", ""],
    ["Pause Count", "pause_count", ""],
    ["Speech Rate", "speech_rate_wpm", " wpm"],
    ["Total Speech Time", "total_speech_time", " s"],
    ["Total Pause Time", "total_pause_time", " s"],
    ["Total Duration", "total_duration", " s"],
    ["Mean Word Duration", "mean_word_duration", " s"],
    ["Pause / Word Ratio", "pause_per_word_ratio", ""],
    ["Silence Ratio", "silence_ratio", ""],
    ["Resp. Time Mean", "response_time_mean", " s"],
    ["Resp. Time Median", "response_time_median", " s"],
  ];

  // FIX: Determine if "healthy" by checking the class name directly, not result.label
  // (backend returns 'class', not 'label')
  const isHealthy = result?.raw_prediction === "Control";

  return (
    <>
      {/* ═══ SECTION 1 — Hero ═══ */}
      <section
        className="pt-8 sm:pt-12 relative h-auto min-h-[600px] sm:min-h-[800px] md:min-h-[900px] lg:h-242 overflow-hidden"
        id="section1"
      >
        <div className="relative flex justify-center flex-col px-4 sm:px-0">
          <h2 className="text-[clamp(40px,10vw,120px)] poppins-regular text-center -mt-2 sm:-mt-10 header-1">
            Project Overview
          </h2>

          <div className="hidden md:block absolute border-b top-50 left-13 p-1 herobox1 header-1">
            <h2 className="poppins-light text-xl">
              Alzheimer's: slowly affects memory and thinking.
            </h2>
          </div>
          <div className="hidden md:block absolute border-b top-70 right-80 p-1 herobox1 header-1">
            <h2 className="poppins-light text-xl">AD/MCI Detection System</h2>
          </div>

          <img
            src="/images/heroimgtransparent.png"
            draggable={false}
            alt=""
            className="hidden md:block absolute top-10 h-220 left-30 header-1 pointer-events-none"
          />

          <div className="md:hidden flex flex-col items-center text-center mt-6 px-4 header-1 gap-4">
            <p className="text-lg poppins-light text-gray-500">
              Alzheimer's: slowly affects memory and thinking.
            </p>
            <h2 className="text-2xl sm:text-3xl poppins-regular">
              MCI Detection using MRI Images and Speech Analysis
            </h2>
            <div className="bg-[#f1ffef] rounded-2xl p-5">
              <p className="poppins-light text-base text-gray-600">
                A machine learning system detecting Mild Cognitive Impairment
                (MCI) from vocal patterns and MRI neuroimaging.
              </p>
            </div>
            <span className="poppins-light text-base border-b border-current cursor-pointer">
              Test Now
            </span>
          </div>

          <div className="hidden md:block absolute top-120 w-120 left-13 herobox4 header-1">
            <h2 className="text-3xl poppins-regular">
              MCI Detection using MRI Images and Speech Analysis
            </h2>
            <h2 className="mt-2 poppins-light text-xl border-b-1 inline-block cursor-pointer">
              Test Now
            </h2>
          </div>
          <div className="hidden md:block absolute top-140 left-270 w-100 bg-[#f1ffef] p-5 rounded-2xl herobox4 header-1">
            <p className="poppins-light text-xl">
              A machine learning system detecting Mild Cognitive Impairment
              (MCI) from vocal patterns and MRI neuroimaging. Upload a patient
              interview transcript (.cha) and MRI scan to analyze diagnostic
              biomarkers.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — Performance Overview ═══ */}
      <section
        className="min-h-screen p-4 sm:p-6 md:p-10 bg-[#f4f4f4]"
        id="section2"
      >
        <div className="mt-6 sm:mt-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl poppins-regular">
            Performance Overview
          </h2>
        </div>
        <div className="flex flex-col xl:flex-row justify-between gap-8 mt-4">
          <div className="flex flex-row xl:flex-col flex-wrap gap-4 sm:gap-6 sm:gap-8">
            <ProjectOverviewCard
              title="Test Accuracy"
              num="78.17%"
              desc="Current Model Performance"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#6DA179"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 12h4.34a1 1 0 0 1 .92.606l2.584 6.029A.603.603 0 0 0 12 18.397V5.603a.603.603 0 0 1 1.157-.238l2.583 6.029a1 1 0 0 0 .92.606H21"
                  />
                </svg>
              }
            />
            <ProjectOverviewCard
              title="Control Class"
              num="Healthy"
              desc="Baseline Diagnosis"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="none"
                    stroke="#6DA179"
                    d="M4 7.5L7 10l4-5m-3.5 9.5a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"
                    strokeWidth="1"
                  />
                </svg>
              }
            />
            <ProjectOverviewCard
              title="Target Class"
              num="MCI / AD"
              desc="Cognitive Impairment"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                >
                  <g fill="#6DA179">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10m-10 8a8 8 0 1 0 0-16a8 8 0 0 0 0 16"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M12 14a1 1 0 0 1-1-1V8a1 1 0 1 1 2 0v5a1 1 0 0 1-1 1"
                      clipRule="evenodd"
                    />
                    <path d="M11 16a1 1 0 1 1 2 0a1 1 0 0 1-2 0" />
                  </g>
                </svg>
              }
            />
            <ProjectOverviewCard
              title="Dataset Size"
              num="1200"
              desc="Patients Analyzed"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="#6DA179"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  >
                    <path d="M14.5 19h-2c-2.829 0-4.243 0-5.121-.879c-.88-.878-.88-2.293-.88-5.121V8c0-2.828 0-4.243.88-5.121C8.256 2 9.67 2 12.499 2h1.344c.818 0 1.226 0 1.594.152c.367.152.656.442 1.234 1.02l2.657 2.656c.578.578.867.868 1.02 1.235c.152.368.152.776.152 1.594V13c0 2.828 0 4.243-.879 5.121C18.743 19 17.328 19 14.5 19" />
                    <path d="M15 2.5v1c0 1.886 0 2.828.586 3.414c.585.586 1.528.586 3.414.586h1M6.5 5a3 3 0 0 0-3 3v8c0 2.828 0 4.243.878 5.121C5.257 22 6.671 22 9.5 22h5a3 3 0 0 0 3-3M10 11h4m-4 4h7" />
                  </g>
                </svg>
              }
            />
          </div>

          <div className="w-full xl:w-[85%] px-0 sm:px-4 md:px-8 py-4 sm:py-8 md:py-12">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl text-gray-800 poppins-semibold">
                Multimodal Biomarker Importance
              </h2>
              <p className="text-sm text-gray-500 mt-1 poppins-light">
                Key features contributing to MCI detection
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm">
                <h3 className="text-base sm:text-lg text-gray-700 mb-4 poppins-medium">
                  Speech Biomarkers
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart layout="vertical" data={speechData}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fontSize: 13 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F8EF7" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm">
                <h3 className="text-base sm:text-lg text-gray-700 mb-4 poppins-medium">
                  MRI Biomarkers
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart layout="vertical" data={mriData}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={130}
                      tick={{ fontSize: 13 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6DA179" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 bg-[#F0FCED] p-4 sm:p-6 rounded-2xl shadow-sm">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 poppins-semibold">
                Model Insight
              </h4>
              <ul className="text-base sm:text-lg text-gray-600 space-y-1 poppins-regular">
                <li>• Speech patterns reveal early behavioral changes</li>
                <li>• MRI captures structural brain degeneration</li>
                <li>• Combined analysis improves diagnostic accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — System Workflow ═══ */}
      <section className="p-4 sm:p-8 md:p-12 bg-[#f9faf8]" id="section3">
        <div className="mt-4 sm:mt-8 mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl poppins-regular">
            System Workflow
          </h2>
          <p className="poppins-light text-sm text-gray-400 mt-2">
            8-step multimodal detection pipeline
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-stretch">
          {WORKFLOW_STEPS.slice(0, 4).map((step) => (
            <React.Fragment key={step.num}>
              <WorkFlowCard
                num={step.num}
                title={step.title}
                desc={step.desc}
                icon={step.icon}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="relative h-12 sm:h-14 my-0">
          <div className="absolute left-[12.5%] right-[12.5%] top-1/2 -translate-y-1/2">
            <div className="w-full h-px border-t border-dashed border-[#6DA179]/40" />
          </div>
          <div className="absolute left-[12.5%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#6DA179]/30" />
          <div className="absolute right-[12.5%] top-0 bottom-0 flex flex-col items-center">
            <div className="flex-1 w-px border-l border-dashed border-[#6DA179]/40" />
            <svg viewBox="0 0 10 6" className="w-3 h-2 text-[#6DA179]/50">
              <polyline
                points="0,0 5,5 10,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
            <span className="text-[10px] poppins-light tracking-[0.2em] text-[#6DA179]/30 bg-[#f9faf8] px-3">
              PIPELINE CONTINUES
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-stretch">
          {[...WORKFLOW_STEPS.slice(4)].reverse().map((step) => (
            <WorkFlowCard
              key={step.num}
              num={step.num}
              title={step.title}
              desc={step.desc}
              icon={step.icon}
            />
          ))}
        </div>

        <div className="hidden sm:flex items-center justify-between mt-6 px-1">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 20 8" className="w-8 h-2 text-[#6DA179]/35">
              <line
                x1="18"
                y1="4"
                x2="2"
                y2="4"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <polyline
                points="6,1 1,4 6,7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] poppins-light tracking-widest text-[#6DA179]/30">
              OUTPUT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] poppins-light tracking-widest text-[#6DA179]/30">
              INPUT
            </span>
            <svg viewBox="0 0 20 8" className="w-8 h-2 text-[#6DA179]/35">
              <line
                x1="2"
                y1="4"
                x2="18"
                y2="4"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <polyline
                points="14,1 19,4 14,7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4 — Patient Analysis ═══ */}
      <section className="bg-white pb-12 sm:pb-20" id="section4">
        <div className="mt-6 sm:mt-10 p-4 sm:p-6">
          <h2 className="poppins-regular text-3xl sm:text-4xl md:text-5xl p-2 sm:p-4">
            New Patient Analysis
          </h2>
          <p className="poppins-light text-base text-gray-500 px-2 sm:px-4 mb-6">
            Upload both files to run multimodal MCI detection
          </p>

          <div className="border w-full sm:w-[98%] bg-[#f4f4f4] mx-auto rounded-3xl border-[#aaa]/40 mt-6 p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ── LEFT: Upload controls ── */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="poppins-semibold text-sm">
                  Upload MRI Image
                </label>
                <label
                  className={`border-2 border-dashed rounded-2xl bg-white p-5 sm:p-7 flex flex-col items-center gap-2 cursor-pointer transition-all ${mriSrc ? "border-[#6DA179] bg-[#f1ffef]" : "border-[#6DA179]/40 hover:border-[#6DA179] hover:bg-[#f1ffef]"}`}
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.nii,.dcm"
                    className="hidden"
                    onChange={onMRI}
                  />
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#6DA179"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="poppins-light text-sm text-gray-500 text-center">
                    <strong className="text-[#6DA179] poppins-semibold">
                      Click to upload
                    </strong>{" "}
                    or drag and drop
                  </span>
                  <span className="text-xs text-gray-400 poppins-light">
                    {mriSrc
                      ? "✓ Image loaded"
                      : "Supported: .jpg, .png, .nii, .dcm"}
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <label className="poppins-semibold text-sm">
                  Upload Patient Transcript (.cha)
                </label>
                <label
                  className={`border-2 border-dashed rounded-2xl bg-white p-5 sm:p-7 flex flex-col items-center gap-2 cursor-pointer transition-all ${chaFile ? "border-[#6DA179] bg-[#f1ffef]" : "border-[#6DA179]/40 hover:border-[#6DA179] hover:bg-[#f1ffef]"}`}
                >
                  <input
                    type="file"
                    accept=".cha"
                    className="hidden"
                    onChange={onCHA}
                  />
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#6DA179"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m0-13.5L7.5 7.5M12 3l4.5 4.5"
                    />
                  </svg>
                  <span className="poppins-light text-sm text-gray-500 text-center">
                    <strong className="text-[#6DA179] poppins-semibold">
                      Click to upload
                    </strong>{" "}
                    or drag and drop
                  </span>
                  <span className="text-xs text-gray-400 poppins-light">
                    {chaFile
                      ? `✓ ${chaFile}`
                      : "Supported: .cha (CHAT transcript)"}
                  </span>
                </label>
              </div>

              <button
                onClick={analyze}
                disabled={analyzing || !mriSrc || !chaFile}
                className="w-full py-3.5 bg-[#6DA179] hover:bg-[#5a9068] disabled:bg-[#b5c9b8] text-white rounded-xl poppins-semibold text-base flex items-center justify-center gap-2 transition-all"
              >
                {analyzing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Patient"
                )}
              </button>

              <div className="bg-[#f1ffef] border border-[#6DA179]/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#5a9068] mb-1">
                  ⏱ Clinical Context
                </p>
                <p className="poppins-light text-xs text-[#4a7a56] leading-relaxed">
                  The model analyzes pause frequency, speech duration, and
                  MRI-derived brain structure. Higher pause counts, reduced
                  speech rates, and hippocampal atrophy are strong indicators of
                  MCI.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Preview & Results ── */}
            <div className="bg-white rounded-2xl border border-[#aaa]/20 p-4 sm:p-6 flex flex-col gap-5">
              {!mriSrc && !chaFile && (
                <div className="flex flex-col items-center justify-center gap-3 opacity-40 py-12 sm:py-16">
                  <svg
                    width="44"
                    height="44"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#6DA179"
                    strokeWidth="1"
                  >
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                  </svg>
                  <p className="poppins-light text-sm text-center text-gray-400 leading-relaxed">
                    Upload an MRI image and transcript
                    <br />
                    to view prediction
                  </p>
                </div>
              )}

              {mriSrc && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#6DA179] uppercase tracking-wider poppins-semibold">
                    MRI Scan Preview
                  </span>
                  <div className="bg-[#1a1a2e] rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={mriSrc}
                      alt="MRI"
                      className="w-full h-44 object-contain"
                    />
                  </div>
                </div>
              )}

              {mriSrc && chaFile && <div className="h-px bg-[#aaa]/15" />}

              {chaFile && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#6DA179] uppercase tracking-wider poppins-semibold">
                    Transcript Waveform
                  </span>
                  <div className="bg-[#f8fff8] border border-[#6DA179]/20 rounded-xl p-3">
                    <p className="text-xs text-[#5a9068] poppins-medium mb-2">
                      ♪ {chaFile}
                    </p>
                    <canvas
                      ref={canvasRef}
                      className="w-full rounded-lg"
                      style={{ height: 64 }}
                    />
                  </div>
                </div>
              )}

              {result &&
                (result.error ? (
                  <div className="rounded-xl p-5 border bg-yellow-50 border-yellow-300">
                    <p className="poppins-semibold text-lg text-yellow-700">
                      ⚠️ Connection Error
                    </p>
                    {/* FIX: removed wrong "port 8000" message — backend is hosted on Render (cloud) */}
                    <p className="poppins-light text-sm text-yellow-600 mt-1">
                      {result.errorMsg ??
                        "Unable to reach the analysis server. Please try again later."}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`rounded-xl p-5 border ${rc.bg} ${rc.border}`}
                  >
                    {/* FIX: use result.class directly instead of result.label which doesn't exist */}
                    <p
                      className={`poppins-semibold text-xl sm:text-2xl ${rc.text}`}
                    >
                      {isHealthy ? "✅" : "⚠️"}{" "}
                      {result.raw_prediction === "Control"
                        ? "Non Demented (Control)"
                        : "MCI Detected"}
                    </p>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${rc.bar}`}
                        style={{
                          width: `${Math.min(100, result.confidence ?? 0)}%`,
                        }}
                      />
                    </div>
                    <p className="poppins-light text-sm text-gray-500 mt-1">
                      Confidence:{" "}
                      <span className="poppins-semibold text-gray-700">
                        {result.confidence != null
                          ? `${result.confidence}%`
                          : "—"}
                      </span>
                    </p>

                    {result.all_scores && (
                      <>
                        <div className="h-px bg-black/10 my-4" />
                        <div className="space-y-2">
                          <p className="poppins-semibold text-xs text-gray-500 uppercase tracking-wider">
                            All Class Scores
                          </p>
                          {Object.entries(result.all_scores).map(
                            ([cls, score]) => (
                              <div key={cls}>
                                <div className="flex justify-between text-xs poppins-light text-gray-600 mb-1">
                                  <span>{cls}</span>
                                  <span>{parseFloat(score).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${rc.bar}`}
                                    style={{
                                      width: `${Math.min(100, parseFloat(score))}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </>
                    )}

                    {result.speech_features && (
                      <>
                        <div className="h-px bg-black/10 my-4" />
                        <div className="bg-white/60 rounded-lg p-3">
                          <p className="poppins-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
                            Speech Analysis
                          </p>
                          {/* FIX: keys now match _main_features.py exactly */}
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs poppins-light text-gray-600">
                            {speechRows.map(([label, key, unit]) => (
                              <React.Fragment key={key}>
                                <span>{label}</span>
                                <span className="poppins-semibold text-gray-800">
                                  {result.speech_features[key] != null
                                    ? `${result.speech_features[key]}${unit}`
                                    : "—"}
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <p className="poppins-light text-xs text-gray-400 mt-4">
                      * Research tool only. Consult a licensed physician for
                      clinical diagnosis.
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
