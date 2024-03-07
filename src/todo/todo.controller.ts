import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-tod-dto/create-todo-dto';
import { TodoService } from './todo.service';
import { TodoEntity } from '../infrastructure/database/entities/todo.entity';

@Controller('todo')
export class TodoController {
  constructor(
    @Inject('TODO_ORIGINAL_SERVICE')
    private todoOriginalRepository: TodoService,
    private todoService: TodoService,
    @Inject('TODO_FACTORY_SERVICE')
    private todoServiceFactory: TodoService,
    @Inject('ASYNC_TODO_FACTORY_SERVICE')
    private todoAsyncServiceFactory: TodoService,
  ) {}
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return await this.todoOriginalRepository.createTodo(createTodoDto);
  }

  @Get()
  async getAllTodos() {
    return await this.todoService.getAllTodos();
  }

  @Put(':id')
  async update(
    @Body() updateTodoDto: CreateTodoDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TodoEntity> {
    return await this.todoServiceFactory.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.todoAsyncServiceFactory.deleteTodo(id);
  }
}
