import { z } from 'zod'

export const isValidUser = z.object({
  name: z.string().min(8).max(25),
  email: z.string().email(),
  password : z.string().min(8),
  img_url : z.string().url().optional(),
});

export const isValidPassword = z.object({
  password:z.string().min(8)
})
