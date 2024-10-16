import {
  getBankAccount,
  TransferFailedError,
  SynchronizationFailedError,
  InsufficientFundsError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  const balance = 1984;
  const withdraw = 999;

  test('should create account with initial balance', () => {
    expect(getBankAccount(balance)).toMatchObject({ _balance: balance });
    expect(getBankAccount(0)).toMatchObject({ _balance: 0 });
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() =>
      getBankAccount(balance).withdraw(balance).withdraw(1),
    ).toThrowError(new InsufficientFundsError(0));
  });

  test('should throw error when transferring more than balance', () => {
    expect(() =>
      getBankAccount(0).transfer(withdraw, getBankAccount(balance)),
    ).toThrowError(new InsufficientFundsError(0));
    expect(() =>
      getBankAccount(balance).transfer(balance * 2, getBankAccount(balance)),
    ).toThrowError(new InsufficientFundsError(balance));
  });

  test('should throw error when transferring to the same account', () => {
    const ba = getBankAccount(balance);

    expect(() => ba.transfer(0, ba)).toThrowError(new TransferFailedError());
  });

  test('should deposit money', () => {
    expect(getBankAccount(balance).deposit(withdraw)).toMatchObject({
      _balance: balance + withdraw,
    });
    expect(getBankAccount(0).deposit(withdraw)).toMatchObject({
      _balance: withdraw,
    });
    expect(getBankAccount(balance).deposit(0)).toMatchObject({
      _balance: balance,
    });
  });

  test('should withdraw money', () => {
    const ba = getBankAccount(balance);

    expect(ba.withdraw(withdraw)).toMatchObject({
      _balance: balance - withdraw,
    });
    expect(ba.withdraw(0)).toMatchObject({ _balance: balance - withdraw });
    expect(ba.withdraw(balance - withdraw)).toMatchObject({ _balance: 0 });
  });

  test('should transfer money', () => {
    const baSender = getBankAccount(balance);
    const baReceiver = getBankAccount(0);
    const baSenderWithdrawSpy = jest.spyOn(baSender, 'withdraw');
    const baReceiverDepositSpy = jest.spyOn(baReceiver, 'deposit');

    expect(baSender.transfer(balance, baReceiver)).toEqual(baSender);
    expect(baSenderWithdrawSpy).toHaveBeenCalledTimes(1);
    expect(baSenderWithdrawSpy).toHaveBeenCalledWith(balance);
    expect(baReceiverDepositSpy).toHaveBeenCalledTimes(1);
    expect(baReceiverDepositSpy).toHaveBeenCalledWith(balance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomSpy = jest.spyOn(lodash, 'random').mockReturnValue(balance);
    const ba = getBankAccount(0);

    await expect(ba.fetchBalance()).resolves.toBe(balance);
    expect(randomSpy).toHaveBeenCalledTimes(2);
    expect(randomSpy).toHaveBeenCalledWith(0, 100, false);
    expect(randomSpy).toHaveBeenCalledWith(0, 1, false);

    randomSpy.mockClear().mockReturnValueOnce(balance).mockReturnValueOnce(0);

    await expect(ba.fetchBalance()).resolves.toBeNull();
    expect(randomSpy).toHaveBeenCalledTimes(2);
    expect(randomSpy).toHaveBeenCalledWith(0, 100, false);
    expect(randomSpy).toHaveBeenCalledWith(0, 1, false);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const ba = getBankAccount(0);
    const fetchBalanceSpy = jest
      .spyOn(ba, 'fetchBalance')
      .mockResolvedValue(balance);

    await ba.synchronizeBalance();
    expect(fetchBalanceSpy).toHaveBeenCalledTimes(1);
    expect(ba).toMatchObject({ _balance: balance });
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const ba = getBankAccount(balance);
    const fetchBalanceSpy = jest
      .spyOn(ba, 'fetchBalance')
      .mockResolvedValue(null);

    await expect(ba.synchronizeBalance()).rejects.toThrowError(
      new SynchronizationFailedError(),
    );
    expect(fetchBalanceSpy).toHaveBeenCalledTimes(1);
    expect(ba).toMatchObject({ _balance: balance });
  });
});
