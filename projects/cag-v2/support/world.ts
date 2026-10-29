import { setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { BaseWorld, BaseWorldParameters, loadConfig, ProbeCollector, AssertionChecklist } from '@qa/core';
import { envUat } from '../config/env.uat';
import { envE2e } from '../config/env.e2e';

export class CustomWorld extends BaseWorld {
  public customState = new Map<string, unknown>();
  public probes = new ProbeCollector();
  public checklist = new AssertionChecklist();

  constructor(options: IWorldOptions<BaseWorldParameters>) {
    super(options);
    const loaded = loadConfig({ uat: envUat, e2e: envE2e });
    this.init(loaded.env, loaded.secrets);
  }
}

setWorldConstructor(CustomWorld);
