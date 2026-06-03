import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    readTime: z.string().optional(),
    // Tuyến bài (series)
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    seriesTitle: z.string().optional(),
    // Bài liên quan — tác giả chọn tay, tối đa 2
    relatedSlugs: z.array(z.string()).optional(),
    // Khối kết nối cuối bài
    callToAction: z.string().optional(),
  }),
});

export const collections = { blog };
