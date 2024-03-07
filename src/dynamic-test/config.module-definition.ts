import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigOptions>().build();
