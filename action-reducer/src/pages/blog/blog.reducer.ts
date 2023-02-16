import { createReducer, createAction, current, nanoid } from '@reduxjs/toolkit'
import { initalPostList } from 'constants/blog'
import { Post } from 'types/blog.type'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

//action
export const addPost = createAction('blog/addPost', (post: Omit<Post, 'id'>) => {
  return {
    payload: {
      ...post,
      id: nanoid()
    }
  }
})
export const deletePost = createAction<string>('blog/deletePost')
export const startEditPost = createAction<string>('blog/startEditPost')
export const finishEditPost = createAction<Post>('blog/finishEditPost')
export const cancelEditPost = createAction('blog/cancelEditPost')
//reducer
const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      state.postList.push(action.payload)
    })
    .addCase(deletePost, (state, action) => {
      const postIndex = state.postList.findIndex((post) => post.id === action.payload)
      state.postList.splice(postIndex, 1)
    })
    .addCase(startEditPost, (state, action) => {
      const postId = action.payload
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    })
    .addCase(cancelEditPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditPost, (state, action) => {
      const postId = action.payload.id

      state.postList.some((post, index) => {
        if (post.id === postId) {
          //chỉ cần kiểm tra 1 lần nên dùng some(trả về true nếu điều kiện đúng và không lặp qua các phần tử còn lại nữa)
          // dòng bên dưới mới cập nhật state
          state.postList[index] = action.payload
          return true
        }
        return false
      })
    })
    .addMatcher(
      (action) => action.type.includes('cancel'),
      (state, action) => {
        console.log(current(state))
      }
    )
})

export default blogReducer
