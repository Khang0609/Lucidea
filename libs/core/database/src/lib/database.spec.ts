import { db } from './database';

describe('database', () => {
  it('should work', () => {
    expect(db).toBeDefined();
    expect(db.getAccounts()).toBeInstanceOf(Map);
  });
});
