import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Phone, ShoppingBag, AlertCircle, ChevronDown } from 'lucide-react';
import { TWISTER_CAMPAIGN } from '../data/twister-campaign';

export const TwisterCampaignSection: React.FC = () => {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  if (!TWISTER_CAMPAIGN.active) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-3xl border-3 border-pink-300 dark:border-pink-800 p-8 shadow-lg"
    >
      {/* Header com ícone de coração */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-pink-300 dark:border-pink-800">
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-2xl text-white animate-pulse">
          <Heart className="w-8 h-8 fill-white" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-pink-900 dark:text-pink-100">
            {TWISTER_CAMPAIGN.title}
          </h2>
          <p className="text-sm md:text-base text-pink-700 dark:text-pink-300 font-serif italic mt-1">
            {TWISTER_CAMPAIGN.subtitle}
          </p>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Coluna esquerda: História */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-pink-200 dark:border-pink-900 space-y-4">
            <h3 className="font-serif text-2xl font-black text-pink-900 dark:text-pink-100">
              {TWISTER_CAMPAIGN.story.headline}
            </h3>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
              {TWISTER_CAMPAIGN.story.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="font-serif">{paragraph}</p>
              ))}
            </div>

            {/* Alertas de situação */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded mt-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1">Situação Delicada</p>
                  <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <li>🐭 Desnutrição: menor e mais magro que deveria</li>
                    <li>💧 Desidratação severa comprometeu sua saúde</li>
                    <li>🏥 Precisa de alimentação especial e veterinário</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita: Foto do Twister */}
        <div className="flex flex-col gap-4">
          {/* Foto do ratinho */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border-2 border-pink-300 dark:border-pink-800 overflow-hidden"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-100 dark:bg-neutral-800">
              <img
                src={TWISTER_CAMPAIGN.ratinho.photoUrl}
                alt={TWISTER_CAMPAIGN.ratinho.description}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                🐾 {TWISTER_CAMPAIGN.ratinho.name}
              </div>
            </div>
            <p className="text-center font-serif font-bold text-pink-900 dark:text-pink-100 text-sm">
              {TWISTER_CAMPAIGN.ratinho.description}
            </p>
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              Precisando de você! ❤️
            </p>
          </motion.div>

          {/* QR Code para contato rápido */}
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border-2 border-pink-300 dark:border-pink-800 text-center">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-bold mb-3">
              QR Code - Fale com Rapidez
            </p>
            <div className="mx-auto w-32 h-32 bg-neutral-50 dark:bg-neutral-800 border-2 border-pink-300 dark:border-pink-700 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={TWISTER_CAMPAIGN.contact.qrCodeUrl}
                alt="QR Code para contato"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2">
              {TWISTER_CAMPAIGN.contact.whatsappNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Tabelas de Preços */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border-2 border-pink-200 dark:border-pink-900 mb-8">
        <h3 className="font-serif text-2xl font-bold text-pink-900 dark:text-pink-100 mb-2 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          {TWISTER_CAMPAIGN.pricing.title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{TWISTER_CAMPAIGN.pricing.description}</p>

        <div className="space-y-3">
          {TWISTER_CAMPAIGN.pricing.tables.map((table) => (
            <div key={table.id} className="border border-pink-200 dark:border-pink-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedTable(expandedTable === table.id ? null : table.id)}
                className="w-full flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-950/30 hover:bg-pink-100 dark:hover:bg-pink-950/50 transition-colors"
              >
                <span className="font-serif font-bold text-pink-900 dark:text-pink-100">{table.label}</span>
                <ChevronDown
                  className={`w-5 h-5 text-pink-600 transition-transform ${
                    expandedTable === table.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {expandedTable === table.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
                      <img
                        src={table.imageUrl}
                        alt={table.label}
                        className="w-full rounded-lg border border-pink-200 dark:border-pink-800"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Opções de ajuda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {TWISTER_CAMPAIGN.helpOptions.map((option, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-neutral-900 p-5 rounded-xl border-2 border-pink-200 dark:border-pink-900 text-center"
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <h4 className="font-serif font-bold text-pink-900 dark:text-pink-100 mb-1">{option.title}</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{option.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Botão CTA Principal */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <a
          href={TWISTER_CAMPAIGN.contact.whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-serif font-bold py-4 px-8 rounded-2xl text-base transition-all shadow-lg hover:shadow-xl"
        >
          <Phone className="w-5 h-5" />
          Falar com {TWISTER_CAMPAIGN.ratinho.name} no WhatsApp
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(TWISTER_CAMPAIGN.contact.whatsappNumber)}
          className="inline-flex items-center justify-center gap-2 bg-pink-100 dark:bg-pink-950 hover:bg-pink-200 dark:hover:bg-pink-900 text-pink-900 dark:text-pink-100 font-mono font-bold py-4 px-8 rounded-2xl text-base transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          Copiar Número
        </button>
      </motion.div>

      {/* Footer da campanha */}
      <div className="mt-8 pt-6 border-t-2 border-pink-300 dark:border-pink-800 text-center">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-serif mb-2">
          🐾 <strong>Toda ajuda faz diferença!</strong>
        </p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Você pode contribuir comprando do catálogo, doando qualquer valor ou compartilhando esta mensagem. O Twister agradece! 💚
        </p>
      </div>
    </motion.section>
  );
};

export default TwisterCampaignSection;
