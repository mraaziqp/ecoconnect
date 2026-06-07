import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./ui/Icon";

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to Nexus Hub",
    description: "Your centralized ecosystem orchestrator. Manage all applications, switch profiles, and orchestrate operations from one unified interface.",
    icon: "Cpu",
  },
  {
    title: "Profile Switching",
    description: "Switch between different user profiles (Developer, Partner, Family Member) to access role-specific applications and features.",
    icon: "Users",
  },
  {
    title: "App Marketplace",
    description: "Discover and launch 9+ integrated applications across Productivity, Community, Utilities, and Sandbox categories.",
    icon: "Grid",
  },
  {
    title: "Secondbrain AI",
    description: "Query the intelligent orchestrator for cross-app insights, search, and real-time system monitoring across your entire ecosystem.",
    icon: "Brain",
  },
  {
    title: "Secure Vault",
    description: "Manage API keys, credentials, and secrets with encrypted client-side obfuscation and server-side decryption.",
    icon: "Lock",
  },
];

interface OnboardingProps {
  onComplete: () => void;
  isOpen: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 to-[#0D0D12] p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Icon name={step.icon as any} size={24} className="text-cyan-400" />
            </div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {currentStep + 1} / {steps.length}
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight font-display">
            {step.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            {step.description}
          </p>

          <div className="w-full h-1 bg-white/[0.02] rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] text-slate-400 hover:text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Get Started
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
