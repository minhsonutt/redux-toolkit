import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: ''
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload
    },
    cancleEditPost: (state) => {
      state.postId = ''
    },
    resetPostId: (state) => {
      state.postId = ''
    }
  }
})

const blogReducer = blogSlice.reducer
export const { cancleEditPost, startEditPost, resetPostId } = blogSlice.actions
export default blogReducer
