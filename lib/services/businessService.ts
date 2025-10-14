import businessAPI from '@/lib/api/business'

// Public APIs
export const getAllBusinesses = () => businessAPI.get('/business-profiles')
export const getBusinessDetail = (id: string) => businessAPI.get(`/business-profiles/${id}`)
export const searchBusinesses = (params: any) => businessAPI.get('/business/search', { params })
export const getNearByBusinesses = (params: any) => businessAPI.get('/nearby', { params })
export const getBusinessesByCategory = (id: string) => businessAPI.get(`/business/get/${id}`)

export const getAllCategories = () => businessAPI.get('/categories')
export const getCategoryById = (id: string) => businessAPI.get(`/categories/${id}`)
export const getTopPage = () => businessAPI.get('/main/toppage')
export const scanQr = (params: any) => businessAPI.get('/scan/business', { params })

// Protected APIs
export const createBusiness = (payload: any) => businessAPI.post('/business-profiles', payload)
export const updateBusiness = (id: string, payload: any) => businessAPI.put(`/business-profiles/${id}`, payload)

export const createReviewComment = (payload: any) => businessAPI.post('/review-comments', payload)
export const updateReviewComment = (id: string, payload: any) => businessAPI.put(`/review-comments/${id}`, payload)
export const deleteReviewComment = (id: string) => businessAPI.delete(`/review-comments/${id}`)
export const getReviewComments = (reviewId: string) => businessAPI.get(`/reviews/${reviewId}/comments`)

// Resource endpoints (Reviews)
export const createReview = (payload: any) => businessAPI.post('/reviews-ratings', payload)
export const getReviews = () => businessAPI.get('/reviews-ratings')
export const updateReview = (id: string, payload: any) => businessAPI.put(`/reviews-ratings/${id}`, payload)
export const deleteReview = (id: string) => businessAPI.delete(`/reviews-ratings/${id}`)
