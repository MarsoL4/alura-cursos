import { api } from './api'

export interface PostAuthor {
  id: string
  name: string
  email: string
}

export interface PostComment {
  id: string
  content: string
  author: { id: string; name: string }
  createdAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  thumbnail: string | null
  tags: string[]
  author: PostAuthor
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  createdAt: string
  updatedAt: string
}

export interface PostDetail extends Post {
  comments: PostComment[]
}

export interface PaginatedPosts {
  data: Post[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function getPosts(params: { search?: string; page?: number; limit?: number } = {}) {
  return api.get<PaginatedPosts>('/posts', { params })
}

export function getPost(id: string) {
  return api.get<PostDetail>(`/posts/${id}`)
}

export function createPost(data: { title: string; content: string; thumbnail?: string; tags?: string[] }) {
  return api.post<Post>('/posts', data)
}

export function addComment(postId: string, content: string) {
  return api.post(`/posts/${postId}/comments`, { content })
}

export function toggleLike(postId: string) {
  return api.post<{ liked: boolean }>(`/posts/${postId}/likes`)
}
