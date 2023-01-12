import React, { useEffect } from 'react';
import { getPosts } from './api/posts';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App(): JSX.Element {
  useEffect(() => {
    const posts = getPosts();
    console.log(posts);
  });
  return <h1>hello </h1>;
}

export default App;
