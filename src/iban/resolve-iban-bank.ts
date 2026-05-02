import banksData from "../../data/banks.tr.json";
import { validateIban } from "./validate-iban";

export type TrBankType =
  | "central_bank"
  | "bank"
  | "participation_bank"
  | "investment_bank"
  | "payment_provider";

export type TrBankRecord = {
  code: string;
  name: string;
  type: TrBankType;
};

export type ResolveIbanBankResult = {
  ok: boolean;
  ibanValid: boolean;
  bankCode: string | null;
  bank: TrBankRecord | null;
};

const BANKS = banksData.providers as TrBankRecord[];
const BANK_BY_CODE = new Map(BANKS.map((bank) => [bank.code, bank] as const));

export function resolveIbanBank(input: string): ResolveIbanBankResult {
  const ibanResult = validateIban(input);

  if (!ibanResult.ok) {
    return { ok: false, ibanValid: false, bankCode: null, bank: null };
  }

  const bankCode = ibanResult.normalized.slice(4, 9);
  const bank = BANK_BY_CODE.get(bankCode) ?? null;

  return {
    ok: bank !== null,
    ibanValid: true,
    bankCode,
    bank: bank ? { ...bank } : null,
  };
}

export function listTrBanks(): TrBankRecord[] {
  return BANKS.map((bank) => ({ ...bank }));
}
