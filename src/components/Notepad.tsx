import React, { useState, useEffect } from 'react';

const Notepad: React.FC = () => {
  const [note, setNote] = useState("");

  useEffect(() => {
    const savedNote = localStorage.getItem("dashboard_note");
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setNote(newVal);
    localStorage.setItem("dashboard_note", newVal);
  };

  return (
    <div className="flex flex-col h-full mt-6">
      <h2 className="text-lg font-semibold text-gray-200 mb-2 border-l-4 border-green-500 pl-3">
        メモ帳 <span className="text-xs font-normal text-gray-500 ml-2">(自動保存)</span>
      </h2>
      <textarea
        className="flex-1 w-full bg-gray-800 text-gray-200 p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 resize-none font-sans leading-relaxed"
        placeholder="ここに分析メモを残せます..."
        value={note}
        onChange={handleChange}
      />
    </div>
  );
};

export default Notepad;
