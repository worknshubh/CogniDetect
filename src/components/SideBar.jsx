import React, { useState, useEffect } from "react";

const navItems = [
  {
    id: "section1",
    icon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke={isActive ? "#6DA179" : "#9CA3AF"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2 6s1.5-2 5-2s5 2 5 2v14s-1.5-1-5-1s-5 1-5 1zm10 0s1.5-2 5-2s5 2 5 2v14s-1.5-1-5-1s-5 1-5 1z"
        />
      </svg>
    ),
  },
  {
    id: "section2",
    icon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 16 16"
      >
        <path
          fill={isActive ? "#6DA179" : "#9CA3AF"}
          d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0m14.28 2.53l-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06L4.28 9.78a.75.75 0 0 1-1.042-.018a.75.75 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.75.75 0 0 1 1.042.018a.75.75 0 0 1 .018 1.042"
        />
      </svg>
    ),
  },
  {
    id: "section3",
    icon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
      >
        <path
          fill={isActive ? "#6DA179" : "#9CA3AF"}
          d="M8 20a1 1 0 1 0-2 0a1 1 0 0 0 2 0M8 4a1 1 0 1 0-2 0a1 1 0 0 0 2 0m10 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0m2 0a3 3 0 0 1-2 2.825v2.33c0 2.19-1.705 4.076-3.91 4.076H9.91c-.996 0-1.91.883-1.91 2.077v1.866A2.998 2.998 0 0 1 7 23a3 3 0 0 1-1-5.826V6.825A2.998 2.998 0 0 1 7 1a2.998 2.998 0 0 1 1 5.825v4.925c.56-.33 1.21-.52 1.91-.52h4.18c.996 0 1.91-.882 1.91-2.076V6.825A2.998 2.998 0 0 1 17 1a3 3 0 0 1 3 3"
        />
      </svg>
    ),
  },
  {
    id: "section4",
    icon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
      >
        <path
          fill={isActive ? "#6DA179" : "#9CA3AF"}
          d="M16.394 12L10 7.737v8.526zm2.982.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832"
        />
      </svg>
    ),
  },
];

function SideBar() {
  const [activeSection, setActiveSection] = useState("section1");

  useEffect(() => {
    const handleScroll = () => {
      const offsets = navItems.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        return { id, top: Math.abs(el.getBoundingClientRect().top) };
      });
      const closest = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      setActiveSection(closest.id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col justify-between h-lvh items-center py-15">
      <div className="flex flex-col items-center justify-center">
        <div>
          <img
            src="/images/cognidetectlogo.png"
            alt=""
            className="h-30 w-40"
            draggable={false}
          />
        </div>
        <div>
          <h2 className="text-3xl poppins-regular">
            Cogni<span className="text-[#6DA179] poppins-semibold">Detect</span>
          </h2>
        </div>
      </div>

      <div className="space-y-10">
        {navItems.map(({ id, icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`h-15 w-15 rounded-full flex justify-center items-center transition-colors duration-200 cursor-pointer border-none outline-none ${
                isActive
                  ? "bg-[#F0FCED]"
                  : "bg-transparent hover:bg-[#F0FCED]/50"
              }`}
            >
              {icon(isActive)}
            </button>
          );
        })}
      </div>

      <div className="h-10 w-40 bg-[#F0FCED] flex justify-center items-center rounded-3xl">
        <div className="h-2 w-2 bg-[#6da179] rounded-full mr-2"></div>
        <h2 className="poppins-semibold text-[#6DA179]">System Online</h2>
      </div>
    </div>
  );
}

export default SideBar;
