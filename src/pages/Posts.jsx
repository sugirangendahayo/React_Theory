import React from "react";

const Posts = ({data, isDisable}) => {
  return <>
  <div className="flex-7">
          <h1 className="text-2xl font-bold">LIST OF POSTS</h1>
          <div className="grid grid-cols-3  gap-4">
            {isDisable ? (
              data.map((post) => (
                <div
                  key={post.id}
                  className="p-3 m-2 shadow hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                >
                  <h1 className="text-red-700 font-semibold">
                    Post: {post.id}
                  </h1>
                  <h1 className="text-xl font-semibold">{post.title}</h1>
                  <p>{post.body}</p>
                </div>
              ))
            ) : (
              <p>No post yet!</p>
            )}
          </div>
        </div>
  </>;
};

export default Posts;
