import axios from 'axios';
import React, { Component } from 'react';
import loadingGif from './loading.gif';
import './App.css';

import ListItem from './ListItem';

class App extends Component {


  constructor() {
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    }

    this.apiUrl = 'https://5bc5e216f85dce00138e4cb5.mockapi.io';

    this.alert = this.alert.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  async componentDidMount() {
    const response = await axios.get(`${this.apiUrl}/todo`);
    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false
      });
    }, 1000);
  }

  handleChange(event) {

    this.setState({
      newTodo: event.target.value
    });
  }

  async addTodo() {
    const response = await axios.post(`${this.apiUrl}/todo`, {
      name: this.state.newTodo
    });

    const todos = this.state.todos;
    todos.push(response.data);


    this.setState({
      todos: todos,
      newTodo: ''
    });

    this.alert('Todo added successfully');
  }

  async deleteTodo(index) {
    const todos = this.state.todos;
    const todo = todos[index];
    await axios.delete(`${this.apiUrl}/todo/${todo.id}`);
    delete todos[index];

    this.setState({ todos });
    this.alert('Todo deleted successfully');
  }

  editTodo(index) {
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    })
  }

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex]

    const response = await axios.put(`${this.apiUrl}/todo/${todo.id}`, {
      name: this.state.newTodo
    });
    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;
    this.setState({ todos, editing: false, editingIndex: null, newTodo: '' });
    this.alert('Todo updated successfully');
  }

  alert(notification) {
    this.setState({
      notification
    });

    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 2000)
  }

  render() {
    return (
      <div className="App">

        <div className="container">
          <h1>React Crud</h1>
          {
            this.state.notification &&
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          }

          <input type="text" className="my-4 form-control" placeholder="Add new todo" onChange={this.handleChange} name="todo" value={this.state.newTodo} />

          <button className="btn-success form-control mb-3" onClick={this.state.editing ? this.updateTodo : this.addTodo} disabled={this.state.newTodo < 5} >
            {this.state.editing ? 'Update todo' : 'Add todo'}
          </button>

          {
            this.state.loading &&
            <img src={loadingGif} alt="" />
          }

          {
            (!this.state.editing || this.state.loading) &&
            <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return <ListItem item={item} editTodo={() => { this.editTodo(index) }} deleteTodo={() => { this.deleteTodo(index) }} key={item.id} />
              })}
            </ul>
          }

        </div>

      </div>
    );
  }
}

export default App;
