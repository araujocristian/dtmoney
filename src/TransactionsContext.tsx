import { createContext, ReactNode } from "react";
import { useEffect, useState } from "react";
import { api } from "./services/api";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: "deposit" | "withdraw";
  createdAt: string;
}

type TransactionInput = Omit<Transaction, "id" | "createdAt">;
// type TransactionInput = Pick<Transaction, 'type' | "amount" | "category" | "type">;

interface TransactionProviderProps {
  children: ReactNode;
}

interface TransactionContextData {
  transactions: Transaction[];
  createTransactions: (transaction: TransactionInput) => void;
}

export const TransactionsContext = createContext<TransactionContextData>(
  {} as TransactionContextData
);

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get("transactions")
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  function createTransactions(transaction: TransactionInput) {
    api.post("transactions", transaction);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}
