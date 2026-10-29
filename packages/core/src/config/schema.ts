import { z } from 'zod';

export const EnvConfigSchema = z.object({
  name: z.enum(['uat', 'e2e']),
  baseUrl: z.string().url('baseUrl must be a valid URL'),
  adminUrl: z.string().url('adminUrl must be a valid URL'),
  apiBaseUrl: z.string().url('apiBaseUrl must be a valid URL'),
  apiVersionPrefixes: z.array(z.string()).min(1),
  timeouts: z.object({
    action: z.number().positive(),
    navigation: z.number().positive(),
    expect: z.number().positive(),
    api: z.number().positive(),
  }),
  retries: z.number().nonnegative(),
  db: z
    .object({
      host: z.string().min(1),
      port: z.number().positive(),
      name: z.string().min(1),
      schema: z.string().min(1),
      user: z.string().min(1),
      password: z.string().min(1),
    })
    .optional(),
  features: z.object({
    visualBaselines: z.boolean(),
    dbChecks: z.boolean(),
    a11y: z.boolean(),
  }),
});

export const SecretsConfigSchema = z.object({
  adminUser: z.string().min(1, 'Admin user must be specified'),
  adminPassword: z.string().min(1, 'Admin password must be specified'),
  dbPassword: z.string().optional(),
});
