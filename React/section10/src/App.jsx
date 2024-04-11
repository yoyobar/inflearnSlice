import { useState, useRef, useReducer, useEffect } from 'react';
import './App.css';
import Editor from './components/Editor';
import Header from './components/Header';
import List from './components/List';

//CRUD
function reducer(state, action) {
    switch (action.type) {
        case 'CREATE':
            return [action.data, ...state];
        case 'RELOAD':
            return action.data;
        case 'UPDATE':
            return state.map((item) => (item.id === action.targetId ? { ...item, isDone: !item.isDone } : item));
        case 'DELETE':
            return state.filter((item) => item.id !== action.targetId);
        default:
            return state;
    }
}

function App() {
    const [todos, dispatch] = useReducer(reducer, [{}]);
    const loaded = useRef(false);

    //localStorage 저장
    useEffect(() => {
        if (loaded.current) {
            const saveData = JSON.stringify(todos);
            localStorage.setItem('todo', saveData);
            return;
        }
        loaded.current = true;
    }, [todos]);

    //CREATE
    const onCreate = (content) => {
        dispatch({
            type: 'CREATE',
            data: {
                id: new Date().getTime(),
                isDone: false,
                content: content,
                date: new Date().getTime(),
            },
        });
    };

    //RELOAD
    useEffect(() => {
        const loadData = JSON.parse(localStorage.getItem('todo'));
        if (loadData) {
            dispatch({
                type: 'RELOAD',
                data: loadData,
            });
        }
    }, []);

    //UPDATE
    const onUpdate = (targetId) => {
        dispatch({
            type: 'UPDATE',
            targetId: targetId,
        });
    };

    //DELETE
    const onDelete = (targetId) => {
        dispatch({
            type: 'DELETE',
            targetId: targetId,
        });
    };

    return (
        <div className='App'>
            <Header />
            <Editor onCreate={onCreate} />
            <List onDelete={onDelete} onUpdate={onUpdate} todos={todos} />
        </div>
    );
}

export default App;
