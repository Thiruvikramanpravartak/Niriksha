import { z } from 'zod';

// Pagination Metadata
export const PaginationMetaSchema = z.object({
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().optional(),
});

// Common Envelopes
export const GenericSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().nullable().optional(),
});

export const GenericErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

// Health Endpoint
export const HealthSchema = z.object({
  status: z.string(),
  version: z.string().optional(),
  environment: z.string().optional(),
  uptime: z.number().optional(),
});

// Home Endpoint
export const HomeStatSchema = z.object({
  title: z.string(),
  value: z.number(),
  unit: z.string().optional(),
});

export const HomeResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    banner: z.string().optional(),
    stats: z.array(HomeStatSchema).optional(),
    recentUpdates: z.array(z.record(z.unknown())).optional(),
  }),
});

// Reports Endpoint
export const ReportItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  year: z.number(),
  category: z.string(),
  state: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export const PaginatedReportsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(ReportItemSchema),
    pagination: PaginationMetaSchema,
  }),
});

export const ReportDetailSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    year: z.number(),
    category: z.string(),
    state: z.string().optional(),
    pdfUrl: z.string().optional(),
    tabledDate: z.string().optional(),
    ministry: z.string().optional(),
    summary: z.string().optional(),
  }),
});

// Reports Filters Endpoint
export const ReportFiltersSchema = z.object({
  success: z.boolean(),
  data: z.object({
    years: z.array(z.number()),
    categories: z.array(z.string()),
    states: z.array(z.string()),
  }),
});

// Accounts Endpoint
export const AccountItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  financialYear: z.string(),
  volume: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export const PaginatedAccountsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(AccountItemSchema),
    pagination: PaginationMetaSchema,
  }),
});

// State Accounts Endpoint
export const StateAccountItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  state: z.string(),
  financialYear: z.string(),
  title: z.string(),
  pdfUrl: z.string().optional(),
});

export const PaginatedStateAccountsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(StateAccountItemSchema),
    pagination: PaginationMetaSchema,
  }),
});

export const StateAccountDetailSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    state: z.string(),
    financialYear: z.string(),
    title: z.string(),
    type: z.string().optional(),
    pdfUrl: z.string().optional(),
  }),
});

// Combined Accounts Endpoint
export const CombinedAccountItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  year: z.string(),
  summary: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export const PaginatedCombinedAccountsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(CombinedAccountItemSchema),
    pagination: PaginationMetaSchema,
  }),
});

export const CombinedAccountDetailSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    year: z.string(),
    volumeNumber: z.string().optional(),
    pdfUrl: z.string().optional(),
  }),
});

// Events Endpoint
export const EventItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  eventDate: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const PaginatedEventsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(EventItemSchema),
    pagination: PaginationMetaSchema,
  }),
});

// News Endpoint
export const NewsItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  date: z.string().optional(),
  category: z.string().optional(),
  summary: z.string().optional(),
});

export const PaginatedNewsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(NewsItemSchema),
    pagination: PaginationMetaSchema,
  }),
});

export const NewsDetailSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    date: z.string().optional(),
    category: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().optional(),
    author: z.string().optional(),
  }),
});

// CMS Dynamic Pages (/api/pages/{slug_or_id})
export const PageDetailSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    slug: z.string(),
    title: z.string(),
    content: z.string(),
    lastModified: z.string().optional(),
  }),
});

// Organisation Chart Endpoint
export const OrganisationChartSchema = z.object({
  success: z.boolean(),
  data: z.object({
    cagName: z.string(),
    wings: z.array(
      z.object({
        name: z.string(),
        head: z.string(),
        responsibilities: z.array(z.string()).optional(),
      }),
    ),
  }),
});

// Former CAG Directory Endpoint
export const FormerCagSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        tenure: z.string(),
        photoUrl: z.string().optional(),
      }),
    ),
  }),
});

// States Directory Endpoint
export const StateItemSchema = z.object({
  code: z.string(),
  name: z.string(),
  capital: z.string().optional(),
  officesCount: z.number().optional(),
});

export const PaginatedStatesSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(StateItemSchema),
    pagination: PaginationMetaSchema,
  }),
});

export const StateDetailSchema = z.object({
  success: z.boolean(),
  data: z.object({
    code: z.string(),
    name: z.string(),
    offices: z.array(
      z.object({
        name: z.string(),
        location: z.string(),
        contact: z.string().optional(),
      }),
    ),
  }),
});

// Admin Auth Endpoint
export const AdminLoginResponseSchema = z.union([
  z.object({
    success: z.boolean(),
    data: z.object({
      token: z.string(),
      expiresIn: z.number().optional(),
    }),
  }),
  z.object({
    access_token: z.string(),
    token_type: z.string().optional(),
    user: z.record(z.unknown()).optional(),
  }),
]);

// Admin Upload Endpoint
export const AdminUploadResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    fileUrl: z.string(),
    fileName: z.string().optional(),
    sizeBytes: z.number().optional(),
  }),
});

// Admin Options Endpoint
export const AdminOptionsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    categories: z.array(z.string()),
    states: z.array(z.string()),
    languages: z.array(z.string()),
    statuses: z.array(z.string()),
  }),
});

// Admin Generic CRUD
export const AdminRecordSchema = z.object({
  id: z.union([z.string(), z.number()]),
}).passthrough();

export const PaginatedAdminCrudSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(z.record(z.unknown())),
    pagination: PaginationMetaSchema,
  }),
});

export const AdminCrudRecordResponseSchema = z.object({
  success: z.boolean(),
  data: z.record(z.unknown()),
});

// OpenAPI Spec Schema
export const OpenApiSchema = z.object({
  openapi: z.string(),
  info: z.object({
    title: z.string(),
    version: z.string(),
  }),
  paths: z.record(z.unknown()),
});
