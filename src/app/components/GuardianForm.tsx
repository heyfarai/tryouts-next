import React from "react";

export interface GuardianFormProps {
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
  onNext: () => void;
  loading: boolean;
}

const GuardianForm: React.FC<GuardianFormProps> = ({
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
  onNext,
  loading,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <label htmlFor="guardianName">Guardian/Emergency Contact Name</label>
      <input
        id="guardianName"
        name="guardianName"
        type="text"
        required
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Parent Name"
      />
      {nameError && <span style={{ color: "#ff2222" }}>{nameError}</span>}

      <label htmlFor="guardianPhone">Emergency Contact Phone</label>
      <input
        id="guardianPhone"
        name="guardianPhone"
        type="tel"
        required
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="555-555-5555"
      />
      {phoneError && <span style={{ color: "#ff2222" }}>{phoneError}</span>}

      <label htmlFor="guardianEmail">Guardian Email</label>
      <input
        id="guardianEmail"
        name="guardianEmail"
        type="email"
        required
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="parent@email.com"
      />
      {emailError && <span style={{ color: "#ff2222" }}>{emailError}</span>}

      <div style={{ marginBottom: 16, marginTop: 24 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={waiverLiability}
            onChange={(e) => onWaiverLiabilityChange(e.target.checked)}
          />
          <span style={{ marginLeft: 8 }}>
            I agree to the <b>Liability Waiver</b> (required)
          </span>
        </label>
        {waiverLiabilityError && (
          <span style={{ color: "#ff2222", display: "block" }}>
            {waiverLiabilityError}
          </span>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={waiverPhoto}
            onChange={(e) => onWaiverPhotoChange(e.target.checked)}
          />
          <span style={{ marginLeft: 8 }}>
            I consent to <b>Photo/Video Release</b> (required)
          </span>
        </label>
        {waiverPhotoError && (
          <span style={{ color: "#ff2222", display: "block" }}>
            {waiverPhotoError}
          </span>
        )}
      </div>
      <button
        type="submit"
        style={{ marginTop: 24, width: "100%" }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Next"}
      </button>
    </form>
  );
};

export default GuardianForm;
