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
import WorkFlowCard from "../components/WorkFLowCard";
gsap.registerPlugin(ScrollTrigger);

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

  useGSAP(() => {
    gsap.fromTo(
      "#systemworkflow",
      { y: 0 },
      {
        y: 200,
        ease: "power1.inOut",
        scrollTrigger: {
          pin: true,
          scrub: 1,
          trigger: "#section3",
          start: "top top",
          end: "+=3000",
        },
      },
    );
  });

  useGSAP(() => {
    gsap.fromTo(
      ".workflowcard",
      { x: 200, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#section3",
          start: "top center",
          end: "+=1300",
          scrub: 1,
        },
        stagger: 2,
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
    formData.append("mri", mriFileRef.current);
    formData.append("cha", chaFileRef.current);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Flask error:", err);
      setResult({ error: true });
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
    ? classColor[result.class]
    : classColor["Non Demented"];

  const speechRows = [
    ["Total Words", "total_words", ""],
    ["Speech Rate", "speech_rate_wpm", "wpm"],
    ["Pause Count", "pause_count", ""],
    ["Total Speech Time", "total_speech_time", "s"],
    ["Total Pause Time", "total_pause_time", "s"],
    ["Mean Word Duration", "mean_word_duration", "s"],
    ["Pause / Word", "pause_per_word", ""],
  ];

  return (
    <>
      <section className="pt-12 relative h-242" id="section1">
        <div className="relative flex justify-center flex-col">
          <h2 className="text-[120px] poppins-regular text-center -mt-10 header-1">
            Project Overview
          </h2>
          <div className="absolute border-b-1 top-50 left-13 p-1 herobox1 header-1">
            <h2 className="poppins-light text-xl">
              Alzheimer's: slowly affects memory and thinking.
            </h2>
          </div>
          <div className="absolute border-b-1 top-70 right-80 p-1 herobox1 header-1">
            <h2 className="poppins-light text-xl">AD/MCI Detection System</h2>
          </div>
          <img
            src="/images/heroimgtransparent.png"
            draggable={false}
            alt=""
            className="absolute top-10 h-220 left-30 header-1"
          />
          <div className="absolute top-120 w-120 left-13 herobox4 header-1">
            <h2 className="text-3xl poppins-regular">
              MCI Detection using MRI Images and Speech Analysis
            </h2>
            <h2 className="mt-2 poppins-light text-xl border-b-1 inline-block cursor-pointer">
              Test Now
            </h2>
          </div>
          <div className="absolute top-140 left-270 w-100 bg-[#f1ffef] p-5 rounded-2xl herobox4 header-1">
            <p className="poppins-light text-xl">
              A machine learning system detecting Mild Cognitive Impairment
              (MCI) from vocal patterns and MRI neuroimaging. Upload a patient
              interview transcript (.cha) and MRI scan to analyze diagnostic
              biomarkers.
            </p>
          </div>
        </div>
      </section>

      <section className="h-250 p-10 bg-[#f4f4f4]" id="section2">
        <div className="mt-10">
          <h2 className="text-5xl poppins-regular">Performance Overview</h2>
        </div>
        <div className="flex flex-row justify-between">
          <div className="space-y-8 mt-10">
            <ProjectOverviewCard
              title="Test Accuracy"
              num="73.2%"
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

          <div className="w-[90%] px-8 py-12">
            <div className="mb-8">
              <h2 className="text-2xl text-gray-800 poppins-semibold">
                Multimodal Biomarker Importance
              </h2>
              <p className="text-sm text-gray-500 mt-1 poppins-light">
                Key features contributing to MCI detection
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg text-gray-700 mb-4 poppins-medium">
                  Speech Biomarkers
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="vertical" data={speechData}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 15 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F8EF7" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg text-gray-700 mb-4 poppins-medium">
                  MRI Biomarkers
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="vertical" data={mriData}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={140}
                      tick={{ fontSize: 15 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6DA179" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-8 bg-[#F0FCED] p-6 rounded-2xl shadow-sm">
              <h4 className="text-xl font-semibold text-gray-700 mb-2 poppins-semibold">
                Model Insight
              </h4>
              <ul className="text-lg text-gray-600 space-y-1 poppins-regular">
                <li>• Speech patterns reveal early behavioral changes</li>
                <li>• MRI captures structural brain degeneration</li>
                <li>• Combined analysis improves diagnostic accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="h-200 p-10" id="section3">
        <div className="flex flex-col mt-10" id="systemworkflow">
          <div className="mt-10">
            <h2 className="text-5xl poppins-regular">System Workflow</h2>
          </div>
          <div className="flex flex-row my-5">
            <WorkFlowCard num="1" title="Data Acquisition" />
            <WorkFlowCard num="2" title="Data Input & Validation" />
            <WorkFlowCard num="3" title="Audio Feature Extraction" />
            <WorkFlowCard num="4" title="MRI Image Preprocessing" />
            <WorkFlowCard num="5" title="Feature Transformation & Scaling" />
            <WorkFlowCard num="6" title="Multimodal Deep Learning Analysis" />
            <WorkFlowCard num="7" title="Fusion & Decision Layer" />
            <WorkFlowCard num="8" title="Prediction & Result Generation" />
          </div>
        </div>
      </section>

      <section className="bg-white pb-20" id="section4">
        <div className="mt-10 p-6">
          <h2 className="poppins-regular text-5xl p-4">New Patient Analysis</h2>
          <p className="poppins-light text-base text-gray-500 px-4 mb-6">
            Upload both files to run multimodal MCI detection
          </p>

          <div className="border w-[98%] bg-[#f4f4f4] m-auto rounded-3xl border-[#aaa]/40 mt-6 p-8 grid grid-cols-2 gap-6 items-start">
            {/* LEFT */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="poppins-semibold text-sm">
                  Upload MRI Image
                </label>
                <label
                  className={`border-2 border-dashed rounded-2xl bg-white p-7 flex flex-col items-center gap-2 cursor-pointer transition-all ${mriSrc ? "border-[#6DA179] bg-[#f1ffef]" : "border-[#6DA179]/40 hover:border-[#6DA179] hover:bg-[#f1ffef]"}`}
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
                  <span className="poppins-light text-sm text-gray-500">
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
                  className={`border-2 border-dashed rounded-2xl bg-white p-7 flex flex-col items-center gap-2 cursor-pointer transition-all ${chaFile ? "border-[#6DA179] bg-[#f1ffef]" : "border-[#6DA179]/40 hover:border-[#6DA179] hover:bg-[#f1ffef]"}`}
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
                  <span className="poppins-light text-sm text-gray-500">
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
                  MCI in the training dataset.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#aaa]/20 p-6 flex flex-col gap-5">
              {!mriSrc && !chaFile && (
                <div className="flex flex-col items-center justify-center gap-3 opacity-40 py-16">
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
                    <p className="poppins-light text-sm text-yellow-600 mt-1">
                      Make sure <code>python app.py</code> is running on port
                      8000.
                    </p>
                  </div>
                ) : (
                  <div
                    className={`rounded-xl p-5 border ${rc.bg} ${rc.border}`}
                  >
                    <p className={`poppins-semibold text-2xl ${rc.text}`}>
                      {result.label === "Healthy" ? "✅" : "⚠️"} {result.class}
                    </p>

                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${rc.bar}`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <p className="poppins-light text-sm text-gray-500 mt-1">
                      Confidence:{" "}
                      <span className="poppins-semibold text-gray-700">
                        {result.confidence}%
                      </span>
                    </p>

                    <div className="h-px bg-black/10 my-4" />

                    {result.all_scores && (
                      <div className="space-y-2">
                        <p className="poppins-semibold text-xs text-gray-500 uppercase tracking-wider">
                          All Class Scores
                        </p>
                        {Object.entries(result.all_scores).map(
                          ([cls, score]) => (
                            <div key={cls}>
                              <div className="flex justify-between text-xs poppins-light text-gray-600 mb-1">
                                <span>{cls}</span>
                                <span>{score}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${rc.bar}`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    <div className="h-px bg-black/10 my-4" />

                    {result.speech_features && (
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="poppins-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
                          Speech Analysis
                        </p>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs poppins-light text-gray-600">
                          {speechRows.map(([label, key, unit]) => (
                            <>
                              <span key={label}>{label}</span>
                              <span
                                key={key}
                                className="poppins-semibold text-gray-800"
                              >
                                {result.speech_features[key] ?? "—"}
                                {unit}
                              </span>
                            </>
                          ))}
                        </div>
                      </div>
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
