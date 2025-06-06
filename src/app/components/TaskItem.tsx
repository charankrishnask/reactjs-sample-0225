type Task = {
  id: number
  title: string
  completed: boolean
}

type Props = {
  task: Task
}

export default function TaskItem({ task }: Props) {
  const isDone = task.completed

  return (
    <li
      className={`list-group-item d-flex align-items-center ${
        isDone ? "text-success" : ""
      }`}
    >
      {isDone ? (
        <>
          <i className="bi bi-check-circle me-2"></i>
          {task.title}
        </>
      ) : (
        <>
          <span
            className="rounded-circle border border-primary me-2"
            style={{ width: 20, height: 20 }}
          ></span>
          {task.title}
          <i className="bi bi-pencil ms-auto"></i>
        </>
      )}
    </li>
  )
}
