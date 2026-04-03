import React from "react";

function WorkFlowCard({ num, title, desc }) {
  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className="flex flex-col gap-4 p-6 rounded-2xl bg-white shadow-md workflowcard mx-2 border-[#aaa]/30 border-2 max-w-[180px] hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-400">
        <span className="text-white text-sm" style={{ fontWeight: 600 }}>
          {num}
        </span>
      </div>

      <h3 className="text-gray-900 text-lg" style={{ fontWeight: 600 }}>
        {title}
      </h3>

      <p
        className="text-gray-500 text-sm leading-relaxed"
        style={{ fontWeight: 300 }}
      >
        {desc}
      </p>
    </div>
  );
}

export default WorkFlowCard;
