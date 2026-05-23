import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../index.css';

const UndoButton = ({ handleUndo }) => {
  return (
    <button onClick={handleUndo} className="add-btn">
      Undo
    </button>
  );
};

const RedoButton = ({ handleRedo }) => {
  return (
    <button onClick={handleRedo} className="add-btn">
      Redo
    </button>
  );
};

const Todos = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  const [undoStack, setUndoStack] = useState([]);

  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const todoString = localStorage.getItem('todos');

    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  const saveToLocalStorage = (updatedTodos) => {
    localStorage.setItem(
      'todos',
      JSON.stringify(updatedTodos)
    );
  };

  const saveState = () => {
    const updatedUndo = [
      JSON.parse(JSON.stringify(todos)),
      ...undoStack,
    ].slice(0, 5);

    setUndoStack(updatedUndo);

    setRedoStack([]);
  };

  const handleAdd = () => {
    if (todo.trim() === '') return;

    saveState();

    const newTodos = [
      ...todos,
      {
        id: uuidv4(),
        todo,
        isCompleted: false,
      },
    ];

    setTodos(newTodos);
    setTodo('');
    saveToLocalStorage(newTodos);
  };

  const handleEdit = (e, id) => {
    const taskToEdit = todos.find(
      (item) => item.id === id
    );

    setTodo(taskToEdit.todo);

    saveState();

    const newTodos = todos.filter(
      (item) => item.id !== id
    );

    setTodos(newTodos);
    saveToLocalStorage(newTodos);
  };

  const handleDelete = (e, id) => {
    saveState();

    const newTodos = todos.filter(
      (item) => item.id !== id
    );

    setTodos(newTodos);
    saveToLocalStorage(newTodos);
  };

  const handleCheckbox = (e) => {
    saveState();

    const id = e.target.name;

    const index = todos.findIndex(
      (item) => item.id === id
    );

    const newTodos = [...todos];

    newTodos[index].isCompleted =
      !newTodos[index].isCompleted;

    setTodos(newTodos);
    saveToLocalStorage(newTodos);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    setRedoStack([todos]);

    const previousState = undoStack[0];

    setTodos(previousState);
    saveToLocalStorage(previousState);

    setUndoStack(undoStack.slice(1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const updatedUndo = [
      todos,
      ...undoStack,
    ].slice(0, 5);

    setUndoStack(updatedUndo);

    const redoState = redoStack[0];

    setTodos(redoState);
    saveToLocalStorage(redoState);

    setRedoStack([]);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  return (
    <>
      <div className="todo-container">
        <h2 className="heading">
          Todo App
        </h2>

        <div className="add-task-container">
          <input
            onChange={handleChange}
            value={todo}
            type="text"
            placeholder="Enter a task..."
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                handleAdd();
            }}
            className="task-input"
          />

          <button
            onClick={handleAdd}
            className="add-btn"
          >
            Add
          </button>
        </div>
      </div>

      <div className="tasks-container">
        <h2 className="task-heading">
          Tasks
        </h2>

        <div className="task-list">
          {todos.length === 0 && (
            <div className="no-task">
              No tasks available.
            </div>
          )}

          {todos.map((item) => (
            <div
              key={item.id}
              className="task-wrapper"
            >
              <div className="task-card">
                <div className="task-content">
                  <input
                    name={item.id}
                    className="checkbox"
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={
                      item.isCompleted
                    }
                  />

                  <div
                    className={`task-text ${
                      item.isCompleted
                        ? 'completed'
                        : ''
                    }`}
                  >
                    {item.todo}
                  </div>
                </div>

                <div className="button-group">
                  <button
                    onClick={(e) =>
                      handleEdit(
                        e,
                        item.id
                      )
                    }
                    className="add-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) =>
                      handleDelete(
                        e,
                        item.id
                      )
                    }
                    className="add-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="button-group">
          <UndoButton
            handleUndo={handleUndo}
          />

          <RedoButton
            handleRedo={handleRedo}
          />
        </div>

        <div className="task-count">
          Total tasks: {todos.length}
        </div>
      </div>
    </>
  );
};

export default Todos;