import CreatePost from './components/CreatePost'
import PostList from './components/PostList'

export default function Blog() {
  return (
    <div className='p-5'>
      <PostList />
      <CreatePost />
    </div>
  )
}
