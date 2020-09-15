const express = require("express");
const board = express.Router();
const Board = require('../../../models/board')
const result = require('../../../lib/defaultResult');
const Joi = require('@hapi/joi');

board.get('/find', async (req, res) => {
    try{
        Board.find({}, function (err, board) {
            return res.status(200).send(result(true,200,"성공",{ data: board }))
        });
    }catch(err){
        return res.status(400).send(result(true,500,"통신 에러",err))
    }
});

board.get('/find/:id', function (req, res) {
    try{
        Board.findOne({_id: req.params.id}, function (err, board) {
            return res.status(200).send(result(true,200,"성공",{ data: board }))
        })
    }catch(err){
        return res.status(400).send(result(true,500,"통신 에러",err))
    }
});


board.post('/save', async (req, res) => {
    try{
        let board_data = new Board();
        board_data.name = req.body.name;
        board_data.password = req.body.password;
        board_data.title = req.body.title;
        board_data.content = req.body.content;

        board_data.save(function (err) {
            if(err){
              console.log(err);
              return res.status(200).send(result(true,400,"실패",err))
            }
            return res.status(200).send(result(true,200,"성공",{ board: board_data } ))
        });

    }catch(err){
        return res.status(400).send(result(true,500,"통신 에러",err))
    }
});

board.put('/update', async (req, res) => {
    try{

        Board.update({ _id: req.body._id }, { $set: { name : req.body.name, title : req.body.title, content : req.body.content}  }, (err, data) => {
            
            if(err) return res.status(400).send(result(false,400,"수정 실패",err))
            
            if(!data.n) return res.status(200).send(result(true,200,"데이터가 없습니다.",""))
            
            return res.status(200).send(result(true,200,"수정 성공",data))
        })
        
    }catch(err){
        return res.status(400).send(result(true,500,"통신 에러",err))
    }
});



board.delete('/remove', async (req, res) => {
    try{
        Board.findOne({_id : req.body._id, password : req.body.password},(err,board) =>{

            if(err)  return res.status(400).send(result(true,400,"비밀번호를 확인해주세요. ",""))

            Board.remove({ _id : req.body._id}, (err, data) => {
                if(err) return res.status(400).send(result(true,400,"삭제 성공 ",err))
                return res.status(200).send(result(true,200,"삭제 성공 ",data))
            })            
        })
    }catch(err){
        return res.status(400).send(result(true,500,"통신 에러",err))
    }
});

module.exports = board;