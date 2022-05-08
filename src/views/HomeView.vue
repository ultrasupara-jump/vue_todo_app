<template>
  <div class="wrapper">
    <header class="header">
      <h1 class="title">TODO APP</h1>
    </header>
    <div class="todo-container">
      <div class="todo-form">
        <label  class="todo-label">
          <span class="todo-newText">New Todo:</span>
          <input v-model="newTodo" type="text" class="todo-input" placeholder="add todo text"/>
          <button class="btn todo-btn todo-btn--add" type="submit" @click.prevent="addTodo">Add</button>
        </label>
      </div>
      <div class="todo-task">
        <ul class="todo-list">
          <li v-for="todo in todos" :key="todo.id" class="todo-item">
            <label class="todo-item-label">
              <input type="checkbox" v-model="todo.done" v-on:change="stateTodo(todo)" class="todo-item-check">
              <span v-bind:class="{'is-done': todo.done }" class="todo-item-text">{{todo.text}}</span>
              <input type="button" value="×" v-on:click="deleteTodo(todo)" class="todo-item-delete">
            </label>
          </li>
        </ul>
        <div class = "logout">
          <button v-on:click = "logout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { db } from '../main.js'

export default {
  name: 'home',
  data() {
    return {
      newTodo: "",
      todos: [],
      authUser: {}
    }
  },
  methods: {
    addTodo: function(){
      db.collection("users").doc(this.authUser.uid).collection("todos").add({
        text: this.newTodo,
        done: false,
        createdAt: new Date()
      })
      .then((docRef) => {
        db.collection("users").doc(this.authUser.uid).collection("todos").doc(docRef.id).update({
          id: docRef.id
        })
      })
      this.newTodo = ""
    },
    stateTodo: function(){
      db.collection("users").doc(this.authUser.uid).collection("todos").doc(todo.id).update({...todo})
      }
    },
    deleteTodo: function(todo) {
      db.collection("users").doc(this.authUser.uid).collection("todos").doc(todo.id).delete()
    },
    logout: function() {
      firebase.auth().signOut()
    },
    //Firebaseからデータを取得
    getTodo: function() {
      db.collection("todos").onSnapshot((querySnapShot) => {
        const allTodos = [];
        querySnapShot.forEach(doc => {
          allTodos.push(doc.data())
        });
        this.todos = allTodos;
      })
    },
    //データの更新
    stateTodo: function(todo) {
      db.collection("todos").doc(todo.id).update(todo)
    },
    //データの削除
    deleteTodo: function(todo) {
      db.collection("todos").doc(todo.id).delete()
    },
  created: function() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.authUser = user;
        this.getTodo()
      }
    })
  },
  beforeRouteEnter(to, from, next) {
  next(vm => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next() //ユーザーログインが完了したらコンポーネントの作成へ
      } else {
        vm.$router.push("./login")
        //ログインしていない場合はログイン画面に移行する
      }
    })
  })
  }
}
</script>

<style lang="scss" scoped>
  .header {
    background-color: #5f9200;
    padding: 15px 30px;
    text-align: center;
  }

  .title {
    color: rgb(255, 255, 255);
    font-size: 20px;
    letter-spacing: 2px;
  }

  .btn {
    background-color: rgb(238, 238, 238);
    border-radius: 5px;
    padding: 7px 13px;
    cursor: pointer;
  }

  .todo-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 30px 20px;
  }

  .todo-form {
    padding: 20px;
    margin: 30px auto;
    border-radius: 5px;
    box-shadow: 0 3px 8px rgb(204, 204, 204);
  }

  .todo-label {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 auto;
  }

  .todo-newText {
    display: block;
    flex: 1 1 100%;
    text-align: left;
    margin-bottom: 10px;
  }

  .todo-task {
    height: 45vh;
    margin-bottom: 20px;
    overflow: scroll;
  }

  .todo-input {
    flex: 2 1 auto;
    margin-right: 1em;
  }

  .todo-list {
    list-style: none;
    padding: 0;
  }

  .todo-item {
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    text-align: left;

    &-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-text {
      flex: 2 1 auto;
      margin: 0 10px;
    }

    &-delete {
      display: flex;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      text-align: center;
      font-size: 20px;
      line-height: 0;
      cursor: pointer;
    }
  }

  .is-done {
    text-decoration: line-through;
    color: rgb(170, 170, 170);
  }

</style>
