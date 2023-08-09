const express = require('express');
const Todo = require('../models/todo');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../../auth');

const router = express.Router();

router.get('/', isAuth, expressAsyncHandler( async (req, res, next) => {
  const todos = await Todo.find({ author : req.user._id }) // 해당 사용자의 todo만 조회
  if(todos.length === 0){
    res.status(404).json({ code : 404, message : 'Failed to find Todo'});
  }else{
    res.json({ code : 200, todos}) // 변수 이름이랑 프로퍼티 값이랑 같으면 하나로 축약 가능 ex) todos
  }
}))

router.get('/:id', (req, res, next) => {
  res.json('특정 할 일 조회');
})

router.post('/', isAuth, expressAsyncHandler( async (req, res, next) => {
  // 중복체크(현재 사영자가 생성하느 TODO의 타이틀이 이미 DB에 있는지 확인)
  const searchedTodo = await Todo.findOne({
    author : req.user._id,
    title : req.body.title,
  })
  if(searchedTodo){
    res.status(204).json({ code : 204, message : "이미 todo 있음"})
  }else{
    const todo = new Todo({
      author : req.user._id,
      title : req.body.title,
      description : req.body.description,
    })
    const newTodo = await todo.save();
    if(!newTodo){
      res.status(401).json({ code : 401, message : 'Failed to save Todo'});
    }else{
      res.status(201).json({ 
        code: 201, 
        message : 'New Todo created',
        newTodo
      });
    }
  }
}))

router.put('/:id', (req, res, next) => {
  res.json('특정 할 일 변경')
})

router.delete('/:id', (req, res, next) => { // /api/todos/{id}
  res.json('특정 할 일 삭제')
})

module.exports = router;