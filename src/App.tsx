// https://jsonplaceholder.typicode.com/todos

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type PostType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

function App() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<PostType[]>({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
      // staleTime: 6*1000
      // refetchInterval: 2*1000
  });

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (newPost: PostType) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      queryClient.setQueryData(["posts"], (oldPosts: PostType[]) => [...oldPosts, newPost]);
    },
  });

  if (error || isError) return <>There was an error</>;

  if (isLoading) return <>Data is Loading</>;

  return (
    <div>
      {isPending && <p>The is pending </p>}

      <button
        onClick={() =>
          mutate({
            userId: 5000,
            id: 5000,
            title: "I'm the Title",
            body: "I'm the Body",
          })
        }
      >
        Add Post
      </button>

      {data?.map((todo) => (
        <div key={todo.id}>
          <h1 className="text-3xl font-bold underline">{todo.id}</h1>
          <h1 className="text-3xl font-bold underline">{todo.title}</h1>
          <p className="text-xl">{todo.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
