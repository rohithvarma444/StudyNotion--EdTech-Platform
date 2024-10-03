import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import CourseSubSectionAccordion from "./CourseSubSectionAccordion";

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  // Accordion state
  const [activeSections, setActiveSections] = useState({});
  const [sectionHeights, setSectionHeights] = useState({});
  const contentRefs = useRef([]);

  useEffect(() => {
    const newActiveSections = {};
    course?.courseContent?.forEach((section) => {
      newActiveSections[section._id] = isActive?.includes(section._id);
    });
    setActiveSections(newActiveSections);
  }, [isActive, course]);

  const toggleSection = (sectionId) => {
    setActiveSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
    handleActive(sectionId);
  };

  // Update section heights whenever activeSections changes
  useEffect(() => {
    const newSectionHeights = {};
    course?.courseContent?.forEach((section, index) => {
      newSectionHeights[section._id] = activeSections[section._id]
        ? contentRefs.current[index]?.scrollHeight || 0
        : 0;
    });
    setSectionHeights(newSectionHeights);
  }, [activeSections, course]);

  return (
    <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
      {course?.courseContent?.map((section, index) => (
        <div key={section._id}>
          <div
            className={`flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]`}
            onClick={() => toggleSection(section._id)}
          >
            <div className="flex items-center gap-2">
              <i className={activeSections[section._id] ? "rotate-180" : "rotate-0"}>
                <AiOutlineDown />
              </i>
              <p>{section.sectionName}</p>
            </div>
            <div className="space-x-4">
              <span className="text-yellow-25">
                {`${section.subSection.length || 0} lecture(s)`}
              </span>
            </div>
          </div>
          <div
            ref={(el) => (contentRefs.current[index] = el)} // Assign each section's ref
            className={`relative overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
            style={{
              height: sectionHeights[section._id] || 0,
            }}
          >
            <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
              {section.subSection?.map((subSec) => (
                <CourseSubSectionAccordion subSec={subSec} key={subSec._id} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
