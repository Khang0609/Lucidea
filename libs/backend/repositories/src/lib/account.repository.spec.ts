import { InMemoryAccountRepository } from './account.repository';
import { db } from '@lucidea/database';
import { Account } from '@lucidea/types';

describe('InMemoryAccountRepository', () => {
  let repository: InMemoryAccountRepository;

  beforeEach(() => {
    db.clear();
    repository = new InMemoryAccountRepository();
  });

  const sampleAccount: Account = {
    username: 'test_user',
    email: 'test@example.com',
    password: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g',
    isAnonymous: false,
  };

  it('should store and retrieve an account by email', async () => {
    await repository.create(sampleAccount);
    const found = await repository.findByEmail('test@example.com');
    expect(found).toEqual(sampleAccount);

    const foundUpper = await repository.findByEmail('TEST@EXAMPLE.COM');
    expect(foundUpper).toEqual(sampleAccount);
  });

  it('should store and retrieve an account by username', async () => {
    await repository.create(sampleAccount);
    const found = await repository.findByUsername('test_user');
    expect(found).toEqual(sampleAccount);

    const foundUpper = await repository.findByUsername('TEST_USER');
    expect(foundUpper).toEqual(sampleAccount);
  });

  it('should return null if account does not exist', async () => {
    const found = await repository.findByEmail('nonexistent@example.com');
    expect(found).toBeNull();

    const foundUser = await repository.findByUsername('nonexistent');
    expect(foundUser).toBeNull();
  });
});
