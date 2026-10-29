import { setWorldConstructor } from '@cucumber/cucumber';
import { BaseWorld } from '@qa/core';

export class TemplateWorld extends BaseWorld {}

setWorldConstructor(TemplateWorld);
