import * as publicApi from './public-api';
import { NgGenericPipe, NgGenericPipeModule } from './public-api';

describe('public API', () => {
  it('exports exactly the documented surface', () => {
    expect(Object.keys(publicApi).sort()).toEqual([
      'NgGenericDirective',
      'NgGenericPipe',
      'NgGenericPipeModule',
    ]);
  });

  it('keeps the deprecated NgGenericPipeModule alias pointing at the pipe', () => {
    expect(NgGenericPipeModule).toBe(NgGenericPipe);
  });
});
