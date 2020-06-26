import { getCustomRepository, getRepository } from 'typeorm';

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
    const categoryRepository = getRepository(Category);
    const { total } = await transactionsReposiotry.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You dont have enoght balance!');
    }

    let categoryTransaction = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryTransaction) {
      categoryTransaction = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryTransaction);
    }

    const category_id = categoryTransaction.id;

    const transaction = transactionsReposiotry.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsReposiotry.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
