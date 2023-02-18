import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { blogApi } from 'pages/blog/blog.service'
import blogReducer from 'pages/blog/blogSlice'

export const store = configureStore({
  reducer: { blog: blogReducer, [blogApi.reducerPath]: blogApi.reducer }, // thêm reducer được tạo từ api slice

  // Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk-query
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware)
})

// Optional, nhưng bắt buộc nếu dùng tính năng refetchOnFoucs/refetchOnReconect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
