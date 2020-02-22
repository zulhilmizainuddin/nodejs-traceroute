import validator from 'validator';

export class Validation {
  static isValidDomainName(domainName) {
    return validator.isFQDN(`${domainName}`) || validator.isIP(`${domainName}`);
  }
}
