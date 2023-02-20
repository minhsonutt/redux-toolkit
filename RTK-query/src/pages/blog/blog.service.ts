import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

export const blogApi = createApi({
  reducerPath: 'blogApi',
  tagTypes: ['Posts'], // những kiểu tag cho phép dùng trong blogApi
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (build) => ({
    // get các bài post thì sử dụng query
    getPosts: build.query<Post[], void>({
      query: () => 'posts',
      providesTags(result) {
        if (result) {
          /*
              biến đổi result(kết quả trả về khi getPosts thành công) thành một mảng mởi có dạng 
              [
                type: 'Post',
                id: string
              ]
              - tham số trong callback của map() không nhất thiết lúc nào cũng phải là các phần tử của mảng ví dụ(post)
              - trong trường hợp bên dưới ta sử dụng destructuring để lấy trường id của các bài post
              - {id} = post(item khi sử dụng map, nhưng trong trường hợp này chỉ cần lấy id)
              - {id, title} = post(item khi sử dụng map, nhưng trong trường hợp này chỉ cần lấy id và title)
              - rồi sau đó biến đổi thành các {} mới
              - Kết quả của hàm map là một mảng mới chứa các đối tượng mới được tạo ra bằng cách chuyển đổi từng phần tử trong mảng result. Mảng mới này sẽ được sao chép vào mảng final bằng cách sử dụng toán tử spread (...).
              - cách khác: 
              ...result.map((post) => ({ type: 'Posts' as const, id: post.id }))
            */
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Posts', id: 'LIST' }]
      }
    }),
    //thao tác POST PUT PATCH thì sử dụng mutation
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        return {
          url: 'posts',
          method: 'POST',
          body
        }
      },
      /*
        - khi invalidatesTags cung cấp các tag để báo hiệu cho những method bào có providesTags
        - nếu match với providesTags nào thì nó method đó sẽ bị gọi lại
        - trong trường hợp này thì getPosts sẽ chạy lại
      */
      invalidatesTags: (result, error, body) => [{ type: 'Posts', id: 'LIST' }]
    }),
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      invalidatesTags: (result, error, data) => [{ type: 'Posts', id: data.id }]
    }),
    deletePost: build.mutation<{}, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id: id }]
    })
  })
})

export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
