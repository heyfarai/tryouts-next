// Default values and constants for registration steps
import { Player } from "./PlayerForm";

export const DEFAULT_PLAYER: Player = {
  firstName: "Testy",
  lastName: "McPlayer",
  birthdate: "2010-06-15",
  gender: "male",
};

import { getPaymentAmount } from "../lib/paymentAmount";

export const PAYMENT_AMOUNT_PER_PLAYER = getPaymentAmount();
