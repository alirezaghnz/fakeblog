import { useMemo, createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

//  1-CRETAE A POST CONTEXT
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, setSearchQuery]);

  return (
    //2 - PROVIDE VALUE TO CHILD COMPONENTS
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

// custome hook for useContext
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("PostcContext was uesd outside of the PostProvider");
  }
  return context;
}
export { usePosts, PostProvider };
