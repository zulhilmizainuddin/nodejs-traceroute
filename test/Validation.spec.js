import { expect } from 'chai';

import { Validation } from '../src/Validation';

describe('Validation', () => {
  it('should validate domain name, ipv4 and ipv6 address', () => {
    const inputs = [
      'github.com',
      '69.89.31.226',
      '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    ];

    for (const input of inputs) {
      expect(Validation.isValidDomainName(input)).to.be.true;
    }
  });

  it('should return false for invalid domain name or ip address', () => {
    expect(Validation.isValidDomainName('neitherDomainOrIpAddress')).to.be.false;
  });
});
