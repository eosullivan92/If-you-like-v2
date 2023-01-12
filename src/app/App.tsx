import { Route, Routes } from 'react-router-dom';
import { PostList } from './components/PostList';
import { Post } from './components/Post';
import { PostProvider } from '../app/context/PostContext';
import { PostListProvider } from '../app/context/PostListContext';
import { Header } from './components/Header';

function App() {
  return (
    <div className="container">
      <Header />
      <PostListProvider>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route
            path="/posts/:id"
            element={
              <PostProvider>
                <Post />
              </PostProvider>
            }
          />
        </Routes>
      </PostListProvider>
    </div>
  );
}

export default App;
