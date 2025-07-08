import React from "react";

interface GuardianSectionProps {
  name: string;
  phone: string;
  email: string;
  nameError: string;
  phoneError: string;
  emailError: string;
  waiverLiability: boolean;
  waiverPhoto: boolean;
  waiverLiabilityError: string;
  waiverPhotoError: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onWaiverLiabilityChange: (v: boolean) => void;
  onWaiverPhotoChange: (v: boolean) => void;
  expanded: boolean;
  onExpand: () => void;
}

const GuardianSection: React.FC<GuardianSectionProps> = ({
  name,
  phone,
  email,
  nameError,
  phoneError,
  emailError,
  waiverLiability,
  waiverPhoto,
  waiverLiabilityError,
  waiverPhotoError,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onWaiverLiabilityChange,
  onWaiverPhotoChange,
  expanded,
  onExpand,
}) => {
  return (
    <div className={`mb-12 ${expanded ? '' : 'opacity-60 pointer-events-none'}`}>
      <button
        type="button"
        className="w-full text-left py-4 px-2 bg-neutral-900 text-white focus:outline-none flex items-center justify-between"
        onClick={onExpand}
        aria-expanded={expanded}
      >
        <span className="dela text-xl font-bold">1b. Guardian & Waivers</span>
        <span className="ml-2">{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <form className="mt-4">
          <label className="block text-xs font-bold mb-1">Guardian Name</label>
          <input
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            className="w-full px-2 py-2 mb-1 border-gray-900 bg-neutral-900 text-white focus:outline-none"
          />
          {nameError && <span className="text-red-500 text-xs mb-2 block">{nameError}</span>}
          <label className="block text-xs font-bold mb-1 mt-2">Guardian Phone</label>
          <input
            type="text"
            value={phone}
            onChange={e => onPhoneChange(e.target.value)}
            className="w-full px-2 py-2 mb-1 border-gray-900 bg-neutral-900 text-white focus:outline-none"
          />
          {phoneError && <span className="text-red-500 text-xs mb-2 block">{phoneError}</span>}
          <label className="block text-xs font-bold mb-1 mt-2">Guardian Email</label>
          <input
            type="email"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            className="w-full px-2 py-2 mb-1 border-gray-900 bg-neutral-900 text-white focus:outline-none"
          />
          {emailError && <span className="text-red-500 text-xs mb-2 block">{emailError}</span>}

          <div className="mb-4 mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={waiverLiability}
                onChange={e => onWaiverLiabilityChange(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-200">
                I agree to the <b>Liability Waiver</b> (required)
              </span>
            </label>
            {waiverLiabilityError && (
              <span className="text-red-500 text-xs block mt-1">
                {waiverLiabilityError}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={waiverPhoto}
                onChange={e => onWaiverPhotoChange(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-200">
                I consent to <b>Photo/Video Release</b> (required)
              </span>
            </label>
            {waiverPhotoError && (
              <span className="text-red-500 text-xs block mt-1">
                {waiverPhotoError}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default GuardianSection;
