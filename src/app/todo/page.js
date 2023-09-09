import { revalidatePath, revalidateTag } from "next/cache";

export default async function Todo() {
  async function addTodo(formData) {
    "use server";

    // post todo to api
    let data = {};
    for (const [key, value] of formData) {
      data[key] = value;
    }

    await fetch("http://localhost:3001/api/todo/add", {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidateTag("todo-items");

    // revalidatePath("/todo");
  }

  async function getTodos() {
    let todos = await fetch("http://localhost:3001/api/todo/list", {
      next: { tags: ["todo-items"], revalidate: 3600 },
    });

    return todos.json();
  }

  let { todos } = await getTodos();

  return (
    <div>
      <form action={addTodo}>
        <div>
          <h3>Add new todo</h3>
          <label>Name</label>
          <br />
          <input name="name" type="text" />
        </div>
        <div>
          <button type="submit">Add todo</button>
        </div>
      </form>
      <div>
        <br />
        <h3>Todo items</h3>
        <ul>
          {todos.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
