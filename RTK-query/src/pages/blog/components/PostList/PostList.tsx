import { useGetPostsQuery } from 'pages/blog/blog.service'
import PostItem from '../PostItem'
import SkeletonPost from '../SkeletonPost'

export default function PostList() {
  // isLoading chỉ dành cho lần fetch đầu tiên
  // isFetching dành cho mỗi lần gọi API
  // data, isLoading, isFetching,... được cập nhật thì component sẽ rerender
  const { data, isLoading, isFetching } = useGetPostsQuery() // fetch API
  return (
    <div>
      <div className='bg-white py-6 sm:py-8 lg:py-12'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <div className='mb-10 md:mb-16'>
            <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Redux Blog</h2>
            <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
              Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
            </p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
            {isFetching && (
              <>
                <SkeletonPost />
                <SkeletonPost />
              </>
            )}
            {!isFetching && data?.map((post) => <PostItem key={post.id} post={post} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
