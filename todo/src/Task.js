import React, { Component } from 'react';
import { variables } from './Variables';
import './style/style.css'


export default class TodoList extends Component {
    constructor() {
        super();        
        this.state = {
            modalTitle: "",
            Task: [],
            Id: 0,
            listTask: "",
            Completion: "Incomplete",
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    changeTask = (e) => {
        this.setState({ listTask: e.target.value })
    }

    changeCompletion = (e) => {
    
    this.setState({ Completion: e.target.value })
    }
    addClick() {
        this.setState({
            modalTitle: "Add Task",
            Id: 0,
            listTask: "",
            Completion: "Incomplete"
        })
    }

    editClick(todos) {
        this.setState({
            modalTitle: "Edit Task",
        })
        this.state.Id = todos.id;
        this.state.listTask = todos.tasks;
        this.state.Completion = todos.completion;
    }

    refreshList() {
        fetch(variables.API_URL + 'Task')
            .then(response => response.json())
            .then(data => {
                this.setState({ Task: data })
            });
    }

    createClick() {
        fetch(variables.API_URL + 'Task', {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tasks: this.state.listTask,
                completion: this.state.Completion
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            })
    }

    updateClick() {
        fetch(variables.API_URL + 'Task', {
            method: 'PUT',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.Id,
                tasks: this.state.listTask,
                completion: this.state.Completion
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            })
    }

    deleteClick(id) {
        if (window.confirm('Are you sure?')) {
            fetch(variables.API_URL + 'Task/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((res) => {
                    alert(res);
                    this.refreshList();
                }, (error) => {
                    alert('Failed');
                })
        }
    }

    render() {
        const {
            modalTitle,
            Task,
            Id,
            listTask,
            Completion
        } = this.state;

        return (
            <div style={{margin: '5%'}}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Task Completion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Task.map(t =>
                            <tr key={t.id}>
                                <td>{t.tasks}</td>
                                <td>{t.completion}</td>
                                <td>
                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.editClick(t)}>
                                        
                                    </button>

                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        onClick={() => this.deleteClick(t.id)}>
                                        
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className='modal-content'>
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" arial-label="Close" />
                            </div>

                            <div className='modal-body'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Task Name</span>
                                    <input type="text" className='form-control' value={listTask} onChange={this.changeTask} />
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Task Completion</span>
                                    <form className='form-control'>
                                        <select value={Completion} onChange={this.changeCompletion}>
                                            <option value="Incomplete">Incomplete</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </form>
                                </div>

                                {Id === 0
                                    ? <button type="button" className='btn btn-primary float-start' onClick={() => this.createClick()}>Create</button>
                                    : <button type="button" className='btn btn-primary float-start' onClick={() => this.updateClick()}>Update</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button"
                    className="btn btn-primary m-2 float-end"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    Add Task
                </button>

            </div >
        )
    }
}