import { z } from 'zod'

export const CreatePostSchema = z.object({
  user_id: z.string(),
  content: z.string().max(200).min(1).optional(),
  image_url : z.string().url().optional(),
  category : z.string().min(1).optional(),
  parent_id : z.string().optional()
})

export const UpdatePostSchema = z.object({
  content: z.string().max(200).min(1).optional(),
  image_url : z.string().url(),
  category : z.string().min(1).optional(),
})