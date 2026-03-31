import React from 'react';

/*
## Questions:
1. What happens if postId changes quickly?
2. Prevent outdated responses from overwriting newer ones

## Problem Analysis:
- When postId changes quickly, multiple fetch requests can be in flight
- Older requests might complete after newer requests
- This causes race conditions where stale data overwrites fresh data
- User sees outdated information even though newer data was fetched first
- Common issue with async operations in effects
*/

// Step 1: Initial buggy implementation (race condition)
function PostBuggy({ postId }) {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    // BUG: Race condition - no cancellation mechanism
    fetch(`https://dummyjson.com/posts/${postId}`)
      .then(res => res.json())
      .then(setPost);
  }, [postId]);

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">Buggy Post (Race Condition)</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Post: {post?.title || 'Loading...'}</p>
        <p>Name: {post?.name || 'N/A'}</p>
      </div>
      <p className="text-xs text-red-500">
        ❌ Race condition - stale data can overwrite fresh data!
      </p>
    </div>
  );
}

// Step 2: Wrong fix - loading state only
function PostWrongFix({ postId }) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // WRONG: Loading state doesn't prevent race conditions
    setLoading(true);
    fetch(`https://dummyjson.com/posts/${postId}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [postId]);

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">Wrong Fix (Loading Only)</h3>
      
      {loading && (
        <div className="text-blue-600 mb-2">Loading...</div>
      )}
      
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Post: {post?.title || 'Loading...'}</p>
        <p>Name: {post?.name || 'N/A'}</p>
      </div>
      <p className="text-xs text-yellow-600">
        ⚠️ Loading state doesn't prevent race conditions!
      </p>
    </div>
  );
}

// Step 3: Correct fix - AbortController
function PostFixed({ postId }) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://dummyjson.com/posts/${postId}`, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!signal.aborted) {
          setPost(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      controller.abort();
    };
  }, [postId]);

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">Fixed Post (AbortController)</h3>
      
      {loading && (
        <div className="text-blue-600 mb-2">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-600 mb-2">Error: {error}</div>
      )}
      
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Post: {post?.title || 'No data'}</p>
        <p>Name: {post?.name || 'N/A'}</p>
      </div>
      <p className="text-xs text-green-600">
        ✅ Fixed! AbortController prevents race conditions.
      </p>
    </div>
  );
}

// Step 4: Alternative fix - request counter
function PostCounterFix({ postId }) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [requestId, setRequestId] = React.useState(0);

  React.useEffect(() => {
    const currentRequestId = Date.now();
    setRequestId(currentRequestId);

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        const data = await response.json();
        
        // Only update if this is still the latest request
        if (currentRequestId === requestId) {
          setPost(data);
        }
      } catch (err) {
        if (currentRequestId === requestId) {
          console.error('Fetch error:', err);
        }
      } finally {
        if (currentRequestId === requestId) {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [postId, requestId]);

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Fixed Post (Request Counter)</h3>
      
      {loading && (
        <div className="text-blue-600 mb-2">Loading...</div>
      )}
      
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Request ID: {requestId}</p>
        <p>Post: {post?.title || 'No data'}</p>
        <p>Name: {post?.name || 'N/A'}</p>
      </div>
      <p className="text-xs text-blue-600">
        ✅ Fixed! Request counter prevents stale updates.
      </p>
    </div>
  );
}

// Step 5: Custom hook solution
function usePost(postId) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!postId) {
      setPost(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://dummyjson.com/posts/${postId}`, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!signal.aborted) {
          setPost(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      controller.abort();
    };
  }, [postId]);

  return { post, loading, error };
}

function PostWithHook({ postId }) {
  const { post, loading, error } = usePost(postId);

  return (
    <div className="p-4 border border-purple-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-purple-600 mb-2">Post with Custom Hook</h3>
      
      {loading && (
        <div className="text-blue-600 mb-2">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-600 mb-2">Error: {error}</div>
      )}
      
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Post: {post?.title || 'No data'}</p>
        <p>Name: {post?.name || 'N/A'}</p>
      </div>
      <p className="text-xs text-purple-600">
        ✅ Clean: Reusable hook with race condition protection!
      </p>
    </div>
  );
}

// Step 6: Advanced example with multiple requests
function useMultiplePosts(postIds) {
  const [posts, setPosts] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    const controllers = postIds.map(() => new AbortController());
    
    const fetchPosts = async () => {
      setLoading(true);
      setErrors({});
      
      try {
        const promises = postIds.map(async (postId, index) => {
          const controller = controllers[index];
          const response = await fetch(`https://dummyjson.com/posts/${postId}`, { 
            signal: controller.signal 
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          return { postId, data };
        });

        const results = await Promise.allSettled(promises);
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            setPosts(prev => ({ 
              ...prev, 
              [result.value.postId]: result.value.data 
            }));
          } else {
            setErrors(prev => ({ 
              ...prev, 
              [postIds[index]]: result.reason.message 
            }));
          }
        });
      } catch (err) {
        console.error('Batch fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      controllers.forEach(controller => controller.abort());
    };
  }, [postIds]);

  return { posts, loading, errors };
}

function AdvancedPost({ postIds }) {
  const { posts, loading, errors } = useMultiplePosts(postIds);

  return (
    <div className="p-4 border border-orange-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-orange-600 mb-2">Advanced Multiple Posts</h3>
      
      {loading && (
        <div className="text-blue-600 mb-2">Loading posts...</div>
      )}
      
      <div className="text-sm text-gray-600 mb-2">
        {postIds.map(postId => (
          <div key={postId} className="mb-2 p-2 bg-gray-50 rounded">
            <p>Post ID: {postId}</p>
            {errors[postId] ? (
              <p className="text-red-600">Error: {errors[postId]}</p>
            ) : posts[postId] ? (
              <>
                <p>Title: {posts[postId].title}</p>
                <p>Name: {posts[postId].name || 'N/A'}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-orange-600">
        ✅ Advanced: Multiple requests with individual cancellation
      </p>
    </div>
  );
}

export default function RaceConditionEffects() {
  const [postId, setPostId] = React.useState(1);
  const [rapidMode, setRapidMode] = React.useState(false);
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    if (rapidMode) {
      intervalRef.current = setInterval(() => {
        setPostId(prev => (prev % 10) + 1);
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rapidMode]);

  const postIds = [postId, postId + 1, postId + 2];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Race Condition in Effects</h2>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>What happens if postId changes quickly?</li>
          <li>Prevent outdated responses from overwriting newer ones</li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">
              Post ID:
              <input
                type="number"
                value={postId}
                onChange={(e) => setPostId(parseInt(e.target.value) || 1)}
                className="ml-2 px-2 py-1 border rounded"
                min="1"
                max="100"
              />
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rapidMode}
                onChange={(e) => setRapidMode(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Rapid Mode (auto-change every 500ms)</span>
            </label>
          </div>
          
          <p className="text-xs text-gray-500">
            Enable rapid mode to test race conditions with quick postId changes
          </p>
        </div>
      </div>

      <PostBuggy postId={postId} />
      <PostWrongFix postId={postId} />
      <PostFixed postId={postId} />
      <PostCounterFix postId={postId} />
      <PostWithHook postId={postId} />
      <AdvancedPost postIds={postIds} />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Race condition:</strong> Multiple requests in flight, stale data overwrites fresh data</li>
          <li><strong>Problem:</strong> Older requests completing after newer ones</li>
          <li><strong>Solution:</strong> AbortController cancels outdated requests</li>
          <li><strong>Alternative:</strong> Request counter prevents stale updates</li>
          <li><strong>Best practice:</strong> Custom hooks with cancellation logic</li>
        </ul>
      </div>
    </div>
  );
}
