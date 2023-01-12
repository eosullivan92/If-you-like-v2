import React, { useEffect } from 'react';
import { getPosts, getPost } from './api/posts';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App(): JSX.Element {
  useEffect(() => {
    const posts = getPosts().then((posts) => console.log(posts));
    const post = getPost('3c695825-5bd4-488f-922e-007910a24833').then((post) =>
      console.log(post)
    );
  });
  return <h1>hello </h1>;
}

export default App;
