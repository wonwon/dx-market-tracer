import React, { useState, type FormEvent } from 'react';

type Props = {
  currentCode: string;
  onCodeChange: (code: string) => void;
};

const Header: React.FC<Props> = ({ currentCode, onCodeChange }) => {
  const [input, setInput] = useState(currentCode);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 4桁の数字のみ許可
    if (/^\d{4}$/.test(input)) {
        onCodeChange(input);
    } else {
        alert("銘柄コードは4桁の半角数字で入力してください");
    }
  };

  return (
    <header className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white tracking-wide">
          📈 株情報分析
        </h1>
        <form onSubmit={handleSubmit} className="flex items-center">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="銘柄コード (例: 7203)"
                className="bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 font-mono text-lg"
                maxLength={4}
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors"
            >
                分析
            </button>
        </form>
      </div>
      <div className="text-gray-400 text-sm">
        市場: 東証 | データ: 遅延
      </div>
    </header>
  );
};

export default Header;
