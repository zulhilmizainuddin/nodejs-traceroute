import os from 'os';

import { expect } from 'chai';

import Tracer from '../src/index';

import { Traceroute } from '../src/Traceroute';
import { Tracert } from '../src/Tracert';

describe('index', () => {
  it('should get Traceroute or Tracert depending on operating system', () => {
    if (os.platform() === 'win32') {
      expect(new Tracer()).to.be.instanceof(Tracert);
    } else {
      expect(new Tracer()).to.be.instanceof(Traceroute);
    }
  });
});
