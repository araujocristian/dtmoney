import { createContext, ReactNode, useContext } from "react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

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
  createTransactions: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionContextData>(
  {} as TransactionContextData
);

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get("transactions")
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  async function createTransactions(transactionInput: TransactionInput) {
    const response = await api.post("transactions", {
      ...transactionInput,
      createdAt: new Date(),
    });
    const { transaction } = response.data;

    setTransactions((oldTransactions) => [...oldTransactions, transaction]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
