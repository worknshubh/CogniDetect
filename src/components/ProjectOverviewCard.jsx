import React from "react";

function ProjectOverviewCard(props) {
  return (
    <div className="h-40 w-90  p-6 shadow-lg rounded-2xl bg-[#ffffff] hover:shadow-xl transition-all duration-300 ease-in-out flex flex-row justify-between overview-cards">
      <div className="flex flex-col justify-around">
        <h2 className="text-xl poppins-regular">{props.title}</h2>
        <h2 className="text-2xl poppins-semibold mt-1">{props.num}</h2>
        <h2 className="text-lg poppins-light">{props.desc}</h2>
      </div>

      <div className="h-10 w-10  rounded-full bg-[#f1ffef] flex justify-center items-center">
        {props.icon}
      </div>
    </div>
  );
}

export default ProjectOverviewCard;
