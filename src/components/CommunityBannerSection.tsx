import React from 'react';
import { motion } from 'motion/react';
import { Globe, QrCode, Heart, AlertCircle } from 'lucide-react';
import { COMMUNITY_BANNER, COMMUNITY_TABLE_DATA } from '../data/community-banner';

export const CommunityBannerSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900 p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-600 p-3 rounded-xl text-white">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-black text-emerald-900 dark:text-emerald-100">
            {COMMUNITY_BANNER.content.title}
          </h2>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-serif italic">
            {COMMUNITY_BANNER.content.subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Policies */}
        <div className="lg:col-span-2 space-y-4">
          {COMMUNITY_BANNER.content.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800"
            >
              <h3 className="font-serif font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                {section.heading}
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Right: QR Code */}
        <div className="space-y-4">
          {COMMUNITY_BANNER.imagery.qrCode.visible && (
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2 font-bold">
                {COMMUNITY_BANNER.imagery.qrCode.title}
              </p>
              <div className="mx-auto w-32 h-32 bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/5YczC5pk/qr-code.jpg"
                  alt="QR Code da Comunidade"
                  className="w-28 h-28 object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-2">
                {COMMUNITY_BANNER.imagery.qrCode.description}
              </p>
            </div>
          )}

          {/* Rat Symbol */}
          {COMMUNITY_BANNER.imagery.ratSymbol.visible && (
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2 font-bold">
                {COMMUNITY_BANNER.imagery.ratSymbol.title}
              </p>
              <div className="mx-auto w-24 h-24 bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/FdgxFnmv/rato-symbol.jpg"
                  alt="Símbolo do Rato"
                  className="w-20 h-20 object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-2">
                {COMMUNITY_BANNER.imagery.ratSymbol.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-6">
        <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-600" />
          {COMMUNITY_TABLE_DATA.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          Última atualização: {COMMUNITY_TABLE_DATA.lastUpdated}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMMUNITY_TABLE_DATA.statistics.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900"
            >
              <p className="text-xs text-neutral-600 dark:text-neutral-400">{stat.label}</p>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {stat.value}
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{stat.trendValue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-blue-900 dark:text-blue-200 text-sm mb-2">
              🌐 Política de Contribuições
            </h4>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✅</span>
                Divulgações de eventos e iniciativas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✅</span>
                Comentários e engajamento comunitário
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400">❌</span>
                Sem novas reportagens neste momento
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CommunityBannerSection;