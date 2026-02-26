import { motion } from "framer-motion";
import { ArrowRight, User, Building } from "lucide-react";
import type { ProfileData, UserPath } from "../types";

interface ProfileScreenProps {
  profile: ProfileData;
  userPath: UserPath;
  onChange: (updates: Partial<ProfileData>) => void;
  onNext: () => void;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  delay = 0,
  icon,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  delay?: number;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
        {icon}
        {label}
        {required && <span className="text-brand">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border-line bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
      />
    </motion.div>
  );
}

export function ProfileScreen({
  profile,
  userPath,
  onChange,
  onNext,
}: ProfileScreenProps) {
  const canProceed =
    profile.brandName.trim() !== "" &&
    profile.firstName.trim() !== "" &&
    profile.email.trim() !== "";

  const contextLabel =
    userPath === "franchisor"
      ? "As a franchisor, we'll tailor projections to your network-wide strategy."
      : "As a multi-unit operator, we'll model your actual opening economics.";

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          Let's personalize your audit
        </h2>
        <p className="text-sm text-text-secondary">{contextLabel}</p>
      </motion.div>

      <div className="space-y-5">
        <InputField
          label="Franchise Brand"
          value={profile.brandName}
          onChange={(v) => onChange({ brandName: v })}
          placeholder="e.g. F45 Training, Orangetheory"
          required
          delay={0.1}
          icon={<Building size={12} />}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={profile.firstName}
            onChange={(v) => onChange({ firstName: v })}
            placeholder="First"
            required
            delay={0.2}
            icon={<User size={12} />}
          />
          <InputField
            label="Last Name"
            value={profile.lastName}
            onChange={(v) => onChange({ lastName: v })}
            placeholder="Last"
            delay={0.25}
          />
        </div>

        <InputField
          label="Email"
          value={profile.email}
          onChange={(v) => onChange({ email: v })}
          placeholder="you@company.com"
          type="email"
          required
          delay={0.3}
        />

        <InputField
          label="Phone"
          value={profile.phone}
          onChange={(v) => onChange({ phone: v })}
          placeholder="(555) 000-0000"
          type="tel"
          delay={0.35}
        />

        <InputField
          label="LinkedIn (optional)"
          value={profile.linkedin}
          onChange={(v) => onChange({ linkedin: v })}
          placeholder="linkedin.com/in/yourname"
          delay={0.4}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 ${
            canProceed
              ? "bg-brand text-surface-0 hover:bg-brand-dim"
              : "cursor-not-allowed bg-surface-3 text-text-muted"
          }`}
        >
          Continue to Launch Planning
          <ArrowRight size={16} />
        </button>
        <p className="mt-3 text-center text-xs text-text-muted">
          Your information stays confidential and is never shared with third parties.
        </p>
      </motion.div>
    </div>
  );
}
