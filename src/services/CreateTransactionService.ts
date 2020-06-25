import {
  getCustomRepository,
  getRepository,
  TransactionRepository,
} from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsReposiotry = getCustomRepository(TransactionsRepository);

    const transaction = transactionsReposiotry.create({
      title,
      value,
      type,
    });

    await transactionsReposiotry.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
