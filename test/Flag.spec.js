import { expect } from 'chai';

import { Flag } from '../src/Flag';

describe('Flag', () => {
  it('should get correct ip flag', () => {
    let flag = Flag.getIpFlag('ipv4');
    expect(flag).to.equal('-4');

    flag = Flag.getIpFlag('ipv6');
    expect(flag).to.equal('-6');

    flag = Flag.getIpFlag('ipv5');
    expect(flag).to.equal('');
  });
});
