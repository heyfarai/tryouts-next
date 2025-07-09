// Hook to clear registration form data from localStorage on mount
import { useEffect } from "react";

export default function useClearRegistrationForm() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("registrationFormData");
    }
  }, []);
}
