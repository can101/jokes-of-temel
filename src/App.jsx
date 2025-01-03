import { ReactTyped } from "react-typed";
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";

const App = () => {
  const [state, setState] = useState(null);
  const [activeId, setActiveId] = useState(0);
  const [activeState, setActiveState] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/data.json");
      const json = await response.json();
      const arr = json.map((item, index) => {
        const content = item.dc_Fikra.split("\n");
        return { id: index, title: content[0], content: content.slice(1) };
      });
      setState(arr);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activeState]);

  const handleClick = (item, index) => {
    const formattedContent = item.content.map((txt, i) => ({
      id: i,
      isShow: i === 0,
      content: txt.replace(/\+/g, "").replace(/-/g, " ").trim(),
    }));
    setActiveState(formattedContent);
    setActiveId(index);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-indigo-700/[0.55]">
      <div className="h-[70%] w-[90%] max-w-[1200px] bg-white rounded-3xl grid grid-cols-6 overflow-hidden">
        {/* Sol Menü */}
        <div className="col-span-2 overflow-auto p-5">
          <ul>
            {state?.map((item, index) => (
              <li className="inline-block" key={`selection-${index}`}>
                <motion.div
                  className={`inline-block font-extrabold m-2 cursor-pointer rounded-md p-3 
            ${activeId === item.id ? "text-white bg-indigo-700 shadow-lg" : "bg-gray-200"}`}
                  onClick={() => handleClick(item, index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    activeId === item.id
                      ? { scale: 1.1, boxShadow: "0px 4px 10px rgba(0, 17, 255, 0.61)" }
                      : { scale: 1, boxShadow: "none" }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.div>
              </li>
            ))}
          </ul>
        </div>

        {/* İçerik */}
        <AnimatePresence>
          <div
            className="col-span-4 overflow-auto p-8 flex-column"
            id="jokens-box"
            ref={containerRef}
          >
            {activeState?.map(({ id, content, isShow }, index) => (
              isShow && (
                <motion.p
                  className="text-lg font-medium"
                  key={`detail-${activeId}-${index}`}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <ReactTyped
                    className="mb-3 inline-block p-3 rounded-r-2xl rounded-t-2xl bg-gray-200"
                    strings={[content]}
                    typeSpeed={20}
                    showCursor={false}
                    onComplete={() => {
                      setActiveState((prevState) => {
                        const updatedState = [...prevState];
                        if (updatedState[index + 1]) {
                          updatedState[index + 1].isShow = true;
                        }
                        return updatedState;
                      });
                    }}
                  />
                </motion.p>
              )
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

