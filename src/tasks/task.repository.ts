import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { search, status } = filterDTO;
    const query = this.createQueryBuilder('tasks');

    query.where('tasks.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('tasks.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'tasks.title LIKE :search OR tasks.description LIKE :search',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    (task.title = title), (task.description = description);
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${user.username}". Data: ${createTaskDTO}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.user;
    return task;
  }
}
