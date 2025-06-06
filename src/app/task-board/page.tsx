'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';

export default function TaskBoardPage() {
  const { user, isLoading: isAuthLoading } = useUser();
  const router = useRouter();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [list, setList] = useState('');

  const utils = trpc.useUtils();
  const { data: tasks, isLoading: isTasksLoading } = trpc.tasks.getTasks.useQuery();
  const addTask = trpc.tasks.addTask.useMutation();
  const toggleComplete = trpc.tasks.toggleComplete.useMutation();
  const deleteTask = trpc.tasks.deleteTask.useMutation();
  const updateTask = trpc.tasks.updateTask.useMutation();
  const generateFromAI = trpc.tasks.generateFromAI.useMutation();
  type Task = {
    id: number;
    title: string;
    completed: boolean;
    description?: string | null;
    date?: string | null;
    list?: string | null;
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask.mutate(
        { title: newTaskTitle },
        {
          onSuccess: () => {
            setNewTaskTitle('');
            utils.tasks.getTasks.invalidate();
          },
        }
      );
    }
  };

  const handleDeleteTask = () => {
    if (!selectedTask?.id) return;

    deleteTask.mutate(
      { id: selectedTask.id },
      {
        onSuccess: () => {
          setSelectedTask(null);
          utils.tasks.getTasks.invalidate();

          const modal = document.getElementById('taskModal');
          if (modal) {
            // @ts-expect-error: Suppressing bootstrap modal type error
            const instance = bootstrap.Modal.getInstance(modal);
            instance?.hide();
            console.log(selectedTask?.id)
          }
        },
      }
    );
  };

  const handleSaveTask = () => {
    if (!selectedTask?.id) return;

    updateTask.mutate(
      { id: Number(selectedTask.id), description, date, list },
      {
        onSuccess: () => {
          utils.tasks.getTasks.invalidate();
        },
      }
    );
  };

  const handleGenerateAI = () => {
    generateFromAI.mutate(
      { prompt: 'Give me 5 tasks to boost productivity' },
      {
        onSuccess: () => utils.tasks.getTasks.invalidate(),
      }
    );
  };

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setDescription(task.description || '');
    setDate(task.date || '');
    setList(task.list || '');
  };

  const handleMarkComplete = (task: Task, completed: boolean) => {
    toggleComplete.mutate(
      { id: task.id, completed },
      {
        onSuccess: () => {
          utils.tasks.getTasks.invalidate();
        },
      }
    );
  };

  if (isAuthLoading || (!user && !isAuthLoading)) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Your Task Board</h1>

      <form onSubmit={handleAddTask} className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Add a new task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button className="btn btn-success" disabled={addTask.status === 'pending'}>
          {addTask.status === 'pending' ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Add Task'
          )}
        </button>
      </form>

      <button
        className="btn btn-outline-primary mb-4"
        onClick={handleGenerateAI}
        disabled={generateFromAI.status === 'pending'}
      >
        {generateFromAI.status === 'pending' ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Generating...
          </>
        ) : (
          'Generate from AI'
        )}
      </button>

      {isTasksLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <>
          <h4>Incomplete Tasks</h4>
          <ul className="list-group mb-4">
            {tasks?.filter((t) => !t.completed).map((task) => (
              <li
                key={task.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#taskModal"
                onClick={() => handleOpenTask(task)}
              >
                {task.title}
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkComplete(task, true);
                  }}
                >
                  Mark Complete
                </button>
              </li>
            ))}
          </ul>

          <h4>Completed Tasks</h4>
          <ul className="list-group">
            {tasks?.filter((t) => t.completed).map((task) => (
              <li
                key={task.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#taskModal"
                onClick={() => handleOpenTask(task)}
              >
                <span className="text-decoration-line-through">{task.title}</span>
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkComplete(task, false);
                  }}
                >
                  Mark Incomplete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Task Modal */}
      <div
        className="modal fade"
        id="taskModal"
        tabIndex={-1}
        aria-labelledby="taskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <button
                className="btn btn-link text-danger p-0 border-0"
                onClick={handleDeleteTask}
                title="Delete Task"
              >
                <i className="bi bi-trash" style={{ fontSize: '1.3rem', cursor: 'pointer' }} />
              </button>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <h5 className="mb-3">{selectedTask?.title}</h5>
            <textarea
              className="form-control mb-3"
              placeholder="Add details"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              className="form-control mb-3"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Move to another list"
              value={list}
              onChange={(e) => setList(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleSaveTask}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
