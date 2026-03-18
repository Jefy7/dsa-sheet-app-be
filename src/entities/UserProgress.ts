import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Problem } from './Problem';
import { User } from './User';

@Entity('user_progress')
@Index('idx_progress_user_problem_unique', ['userId', 'problemId'], { unique: true })
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  problemId!: string;

  @ManyToOne(() => User, (user) => user.progressEntries, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Problem, (problem) => problem.progressEntries, { onDelete: 'CASCADE' })
  problem!: Problem;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
