import React from 'react';

type Props = {
  code: string;
};

const AnalysisLinks: React.FC<Props> = ({ code }) => {
  const links = [
    {
      name: "Yahoo!ファイナンス（日本）",
      url: `https://finance.yahoo.co.jp/quote/${code}.T`,
      color: "bg-red-700 hover:bg-red-800",
      description: "株価詳細・チャート・ニュース"
    },
    {
      name: "Yahoo!掲示板",
      url: `https://finance.yahoo.co.jp/quote/${code}.T/bbs`,
      color: "bg-red-800 hover:bg-red-900",
      description: "投資家の反応・口コミ"
    },
    {
      name: "株探（ニュース・特集）",
      url: `https://kabutan.jp/stock/?code=${code}`,
      color: "bg-red-600 hover:bg-red-700",
      description: "速報ニュースと決算情報"
    },
    {
      name: "空売りネット（機関の動き）",
      url: `https://karauri.net/${code}/`,
      color: "bg-yellow-600 hover:bg-yellow-700", // オレンジ寄りの黄色
      description: "機関投資家の空売り残高"
    },
    {
      name: "IR BANK（信用需給・業績）",
      url: `https://irbank.net/${code}/`,
      color: "bg-blue-600 hover:bg-blue-700",
      description: "財務状況と信用倍率"
    },
    {
      name: "Yahoo Finance US (ニュース)",
      url: `https://finance.yahoo.com/quote/${code}.T/news`,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "米国版Yahooのニュース（英語）"
    },
    {
      name: "Google ファイナンス",
      url: `https://www.google.com/finance/quote/${code}:TYO`,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Googleの株価・ニュース"
    }
  ];

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-gray-200 mb-2 border-l-4 border-blue-500 pl-3">
        分析ツール
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white p-4 rounded-lg shadow transition-transform transform hover:scale-102 flex flex-col items-start justify-center group`}
          >
            <span className="font-bold text-lg flex items-center">
                {link.name}
                 <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </span>
            <span className="text-xs opacity-80 mt-1">{link.description}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AnalysisLinks;
