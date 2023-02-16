import { createSlice, PayloadAction, current, createAsyncThunk } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
import http from 'ultils/http'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
  currentRequestId: undefined | string
  loading: boolean
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  currentRequestId: undefined,
  loading: false
}

export const getPost = createAsyncThunk('blog/getPost', async (_, thunkAPI) => {
  const response = await http.get<Post[]>('posts', {
    signal: thunkAPI.signal
  })
  return response.data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
  const response = await http.post<Post>('posts', body, {
    signal: thunkAPI.signal
  })
  return response.data
})

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    const response = await http.put(`posts/${postId}`, body, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const deletePost = createAsyncThunk('post/deletePost', async (postId: string, thunkAPI) => {
  const response = await http.delete<Post>(`posts/${postId}`, {
    signal: thunkAPI.signal
  })
  return response.data
})
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    },
    cancelEditPost: (state) => {
      state.editingPost = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getPost.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const postId = action.payload.id
        state.postList.find((post, index) => {
          if (post.id === postId) {
            state.postList[index] = action.payload
            return true
          }
          return false
        })
        state.editingPost = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postIndex = state.postList.findIndex((post) => post.id === action.meta.arg)
        state.postList.splice(postIndex, 1)
      })
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state, action) => {
          console.log(current(state))
        }
      )
      .addDefaultCase((state, action) => {
        console.log(current(state))
      })
  }
})

export const { cancelEditPost, startEditPost } = blogSlice.actions

const blogReducer = blogSlice.reducer
export default blogReducer
